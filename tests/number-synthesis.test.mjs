import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SignalNormalizationEngine } from '../lib/signals/signal-normalization-engine.ts';
import { DigitExtractionEngine } from '../lib/signals/digit-extraction-engine.ts';
import { SignalPatternEngine } from '../lib/signals/signal-pattern-engine.ts';
import { RealitySignalStore } from '../lib/signals/reality-signal-store.ts';
import { FourPillarsEngine } from '../lib/engines/four-pillars/four-pillars-engine.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { PersonalNumberDNAEngine } from '../lib/engines/personal-dna/personal-dna-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';
import { PersonalDirectionEngine } from '../lib/directions/personal-direction-engine.ts';
import { DailyDirectionEngine } from '../lib/directions/daily-direction-engine.ts';
import { DigitFeatureVectorEngine } from '../lib/synthesis/digit-feature-vector-engine.ts';
import { CandidateGenerationEngine } from '../lib/synthesis/candidate-generation-engine.ts';
import { MotherCodeEngine } from '../lib/synthesis/mother-code-engine.ts';
import { VariationCodeEngine } from '../lib/synthesis/variation-code-engine.ts';
import { PredictionDataQualityEngine } from '../lib/synthesis/prediction-quality-engine.ts';
import { ModelConsistencyEngine } from '../lib/synthesis/model-consistency-engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Reality Signal - Normalization and Digit Extraction', () => {
  // Test "S 5729"
  const norm1 = SignalNormalizationEngine.normalize('S 5729');
  assert.deepEqual(norm1.letters, ['S']);
  assert.equal(norm1.numericValue, '5729');
  assert.deepEqual(norm1.digits, [5, 7, 2, 9]);

  // Test "Receipt #9275"
  const norm2 = SignalNormalizationEngine.normalize('Receipt #9275');
  assert.deepEqual(norm2.digits, [9, 2, 7, 5]);

  // Extraction of 5729: sum = 23, digital root = 5
  const ext = DigitExtractionEngine.extract([5, 7, 2, 9]);
  assert.equal(ext.digitSum, 23);
  assert.equal(ext.digitalRoot, 5);
  assert.deepEqual(ext.orderedDigits, [5, 7, 2, 9]);
  assert.deepEqual(ext.unorderedDigitSet, [2, 5, 7, 9]);

  // Repeated digit test for 5772
  const extRepeat = DigitExtractionEngine.extract([5, 7, 7, 2]);
  assert.deepEqual(extRepeat.repeatedDigits, [7]);
  assert.equal(extRepeat.repeatCount, 1);
});

test('Reality Signal - Pattern Detection (Mirror, Reverse, Ascending, Descending)', () => {
  // Mirror 1221
  const mirrorRes = SignalPatternEngine.detectPatterns([1, 2, 2, 1]);
  assert.equal(mirrorRes.isMirror, true);
  assert.ok(mirrorRes.patterns.includes('MIRROR'));

  // Ascending 1234
  const ascRes = SignalPatternEngine.detectPatterns([1, 2, 3, 4]);
  assert.equal(ascRes.isAscending, true);
  assert.ok(ascRes.patterns.includes('ASCENDING'));

  // Descending 4321
  const descRes = SignalPatternEngine.detectPatterns([4, 3, 2, 1]);
  assert.equal(descRes.isDescending, true);
  assert.ok(descRes.patterns.includes('DESCENDING'));

  // Reverse sequence 5729 vs 9275
  assert.equal(SignalPatternEngine.isReverseSequence([5, 7, 2, 9], [9, 2, 7, 5]), true);
  assert.equal(SignalPatternEngine.isReverseSequence([5, 7, 2, 9], [5, 2, 7, 9]), false);
});

test('Number Synthesis - Digit Feature Vector Generation & Re-normalization', () => {
  const profile = {
    name: '测试甲男',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };
  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const ziweiChart = ZiWeiEngine.generateChart(profile);
  const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);

  const testDate = '2026-09-13';
  const dailySig = DailyEngine.generateDailySignature(testDate);
  const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
  const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);

  // Case 1: Without Reality Signals (missing features re-normalized)
  const vectorsNoReality = DigitFeatureVectorEngine.computeVectors(
    personalDNA,
    activeNumbers,
    undefined,
    [],
    dailySig.dominantElement
  );

  assert.equal(vectorsNoReality.length, 10);
  for (const v of vectorsNoReality) {
    assert.equal(v.realityResonanceScore, 'NOT_AVAILABLE');
    assert.ok(v.overallDigitScore >= 0 && v.overallDigitScore <= 100);
    // Sum of effective weights should be exactly 1.0 (or within floating precision 0.999-1.001)
    const sumW = Object.values(v.effectiveWeights).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sumW - 1.0) < 0.005);
  }

  // Case 2: With Reality Signal
  const mockSig = RealitySignalStore.createSignal(
    {
      signalType: 'VEHICLE_PLATE',
      rawValue: 'S 5729',
      observationTime: '15:27:00',
      direction: 'SW',
    },
    personalDNA
  );

  const vectorsWithReality = DigitFeatureVectorEngine.computeVectors(
    personalDNA,
    activeNumbers,
    undefined,
    [mockSig],
    dailySig.dominantElement
  );

  assert.equal(vectorsWithReality.length, 10);
  for (const v of vectorsWithReality) {
    assert.notEqual(v.realityResonanceScore, 'NOT_AVAILABLE');
  }
});

test('Number Synthesis - Deterministic Candidate Generation & Mother Code', () => {
  const profile = {
    name: '测试甲男',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };
  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const ziweiChart = ZiWeiEngine.generateChart(profile);
  const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);

  const testDate = '2026-09-13';
  const dailySig = DailyEngine.generateDailySignature(testDate);
  const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
  const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);
  const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
    fourPillars,
    ziweiChart,
    personalDNA
  );
  const dailyDirection = DailyDirectionEngine.calculateDailyDirections(
    testDate,
    personalDirections,
    dailySig,
    activeNumbers,
    activePalaces
  );

  const vectors = DigitFeatureVectorEngine.computeVectors(
    personalDNA,
    activeNumbers,
    dailyDirection,
    [],
    dailySig.dominantElement
  );

  // Generate candidates
  const candidates1 = CandidateGenerationEngine.generateCandidates(
    vectors,
    personalDNA,
    activeNumbers,
    dailyDirection,
    [],
    20
  );

  const candidates2 = CandidateGenerationEngine.generateCandidates(
    vectors,
    personalDNA,
    activeNumbers,
    dailyDirection,
    [],
    20
  );

  // Strict determinism check
  assert.deepEqual(candidates1.map((c) => c.number), candidates2.map((c) => c.number));
  assert.equal(candidates1.length, 20);

  // Mother Code extraction
  const motherCode = MotherCodeEngine.extractMotherCode(candidates1);
  assert.ok(motherCode.motherCode);
  assert.equal(motherCode.rank, 1);
  assert.equal(motherCode.motherCode, candidates1[0].number);

  // Variations generation (max 50)
  const variations = VariationCodeEngine.generateVariations(motherCode.motherCode, motherCode.score, 50);
  assert.ok(variations.length > 0 && variations.length <= 50);
  assert.ok(variations.some((v) => v.variationType === 'REVERSE'));
  assert.ok(variations.some((v) => v.variationType === 'ROTATION'));

  // Consistency and Quality separation
  const quality = PredictionDataQualityEngine.evaluateDataQuality(
    personalDNA,
    dailySig,
    dailyDirection,
    []
  );
  assert.ok(quality.score >= 0 && quality.score <= 100);

  const consistency = ModelConsistencyEngine.evaluateConsistency(
    vectors,
    personalDNA,
    activeNumbers,
    dailyDirection,
    []
  );
  assert.ok(['LOW', 'NORMAL', 'HIGH'].includes(consistency));
});
