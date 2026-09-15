// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Classical Canon Priority Engine Tests
// File: tests/canon-priority-engine.test.mjs
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { CandidateScoringEngine } from '../lib/synthesis/candidate-scoring-engine.ts';
import { DigitFeatureVectorEngine } from '../lib/synthesis/digit-feature-vector-engine.ts';
import { MotherCodeEngine } from '../lib/synthesis/mother-code-engine.ts';
import { PlumBlossomEngine } from '../lib/literature/plum-blossom-engine.ts';

// Mock test profile and activations
const mockPersonalDNA = {
  coreNumbers: [1, 6, 8],
  scoresByDigit: { 0: 60, 1: 90, 2: 60, 3: 65, 4: 70, 5: 60, 6: 88, 7: 75, 8: 92, 9: 70 },
  dominantElement: 'Water',
  confidenceScore: 92,
};

const mockDailyActivated = [
  { digit: 8, activationScore: 95 },
  { digit: 6, activationScore: 88 },
  { digit: 1, activationScore: 82 },
  { digit: 3, activationScore: 75 },
  { digit: 7, activationScore: 70 },
  { digit: 4, activationScore: 65 },
  { digit: 2, activationScore: 60 },
  { digit: 9, activationScore: 55 },
  { digit: 5, activationScore: 50 },
  { digit: 0, activationScore: 45 },
];

const mockVectors = [
  { digit: 8, overallDigitScore: 90 },
  { digit: 6, overallDigitScore: 85 },
  { digit: 1, overallDigitScore: 82 },
  { digit: 7, overallDigitScore: 78 },
  { digit: 3, overallDigitScore: 75 },
  { digit: 4, overallDigitScore: 70 },
  { digit: 2, overallDigitScore: 65 },
  { digit: 9, overallDigitScore: 60 },
  { digit: 5, overallDigitScore: 55 },
  { digit: 0, overallDigitScore: 50 },
];

test('1. PlumBlossomEngine evaluates classical Body/Use relationships accurately', () => {
  // Let's test specific combinations
  // Digits: [1, 6, 3, 3] -> Upper sum = 7 (艮 Earth), Lower sum = 6 (坎 Water)
  // Earth overcomes Water -> 体克用
  const analysis1 = PlumBlossomEngine.analyzeNumber('1633');
  assert.ok(analysis1.relation, 'Has relation defined');
  assert.equal(typeof analysis1.relationZh, 'string');
  assert.ok(analysis1.canonicalCitation.includes('李科儒'));

  // Upper sum = 3 (离 Fire), Lower sum = 4 (震 Wood)
  // Wood generates Fire -> 用生体 (大吉)
  // e.g. "1222" -> 1+2=3 (离 Fire), 2+2=4 (震 Wood) -> Wood generates Fire -> YONG_SHENG_TI!
  const analysisYongShengTi = PlumBlossomEngine.analyzeNumber('1222');
  assert.equal(analysisYongShengTi.relation, 'YONG_SHENG_TI');
  assert.equal(analysisYongShengTi.relationZh, '用生体');
});

test('2. CandidateScoringEngine integrates Canon Priority into CandidateScoreBreakdown', () => {
  // "1222" has 'YONG_SHENG_TI' -> very high canon score
  const resYongShengTi = CandidateScoringEngine.evaluateCandidate(
    [1, 2, 2, 2],
    mockVectors,
    mockPersonalDNA,
    mockDailyActivated
  );

  assert.ok(resYongShengTi.breakdown.canonScore >= 85, 'YongShengTi canon score should be >= 85');
  assert.equal(resYongShengTi.breakdown.bodyUseRelation, '用生体');
  assert.ok(resYongShengTi.breakdown.canonVerdict?.includes('用生体'));

  // Check trace log
  const canonTrace = resYongShengTi.trace.find((t) => t.factor.includes('易理典籍优先'));
  assert.ok(canonTrace, 'Trace contains Canon Priority factor');
  assert.ok(canonTrace.points > 0, 'Canon points are positive');
});

test('3. Canon Priority demotes numbers with 用克体 (Yong Ke Ti) under equal conditions', () => {
  // Candidate A: 1222 (Upper 3 Fire, Lower 4 Wood -> Wood generates Fire = 用生体)
  // Candidate B: 3311 (Upper 6 Water, Lower 2 Metal? 3+3=6 Water, 1+1=2 Metal -> Metal generates Water = 用生体)
  // Let's create an exact Yong Ke Ti:
  // Upper 3 Fire (Ti), Lower 6 Water (Yong: Water overcomes Fire = 用克体)
  // E.g. digits: [1, 2, 3, 3] -> 1+2=3 (Fire Ti), 3+3=6 (Water Yong) -> Water overcomes Fire = 用克体!
  const resYongKeTi = CandidateScoringEngine.evaluateCandidate(
    [1, 2, 3, 3],
    mockVectors,
    mockPersonalDNA,
    mockDailyActivated
  );

  assert.equal(resYongKeTi.breakdown.bodyUseRelation, '用克体');
  assert.ok(resYongKeTi.breakdown.canonScore <= 55, 'YongKeTi canon score should be low (<= 55)');

  const resYongShengTi = CandidateScoringEngine.evaluateCandidate(
    [1, 2, 2, 2],
    mockVectors,
    mockPersonalDNA,
    mockDailyActivated
  );

  assert.ok(
    resYongShengTi.breakdown.canonScore > resYongKeTi.breakdown.canonScore,
    'Auspicious Canon score must strictly exceed inauspicious Canon score'
  );
});

test('4. He Luo 15 and Yin-Yang 10 pairings grant bonus points in Canon evaluation', () => {
  // Digits: [1, 4, 6, 4] -> sum = 15 (河洛十五归中), first and last digits (1+4!=10), but middle (4+6=10)!
  const res = CandidateScoringEngine.evaluateCandidate(
    [1, 4, 6, 4],
    mockVectors,
    mockPersonalDNA,
    mockDailyActivated
  );

  assert.equal(res.breakdown.sum, 15);
  assert.ok(res.breakdown.canonVerdict?.includes('河洛合吉'));
});

test('5. DigitFeatureVectorEngine strengthens elementScore with He Tu generation pairings', () => {
  // Vector computation: personalDNA has 1, 6, 8.
  // Digit 1 has He Tu companion 6 ((1+5)%10 = 6). Since 6 is in personalDNA.coreNumbers,
  // digit 1 gets a He Tu boost.
  const vectors = DigitFeatureVectorEngine.computeVectors(
    mockPersonalDNA,
    mockDailyActivated,
    undefined,
    [],
    'Water'
  );

  assert.equal(vectors.length, 10);
  const vec1 = vectors.find((v) => v.digit === 1);
  assert.ok(vec1, 'Digit 1 exists');
  assert.ok(vec1.elementScore >= 70, 'He Tu boosted element score is high');
});

test('6. MotherCodeEngine cleanly incorporates canon data into summary and breakdown', () => {
  const candidates = [
    CandidateScoringEngine.evaluateCandidate([1, 2, 2, 2], mockVectors, mockPersonalDNA, mockDailyActivated),
  ].map((res, idx) => ({
    number: '1222',
    rank: idx + 1,
    score: res.score,
    breakdown: res.breakdown,
    confidence: 'HIGH',
    generationMethod: 'PRIMARY_PERMUTATION',
    trace: res.trace,
  }));

  const motherRes = MotherCodeEngine.extractMotherCode(candidates);
  assert.equal(motherRes.motherCode, '1222');
  assert.ok(motherRes.breakdown.canonScore >= 80);
  assert.ok(motherRes.summary.includes('易理体用【用生体】'));
});
