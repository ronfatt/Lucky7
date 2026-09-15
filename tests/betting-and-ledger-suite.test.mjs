// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Betting Strategy & Ledger Test Suite
// File: tests/betting-and-ledger-suite.test.mjs
// Verifies:
// 1. Rational 4D permutation logic & operator packages (RM2-RM10)
// 2. Wealth compass azimuth calculation & outing guidance
// 3. Prediction ledger backtest statistics & metaphysical insights
// 4. Social share report text generation
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { BettingStrategyEngine } from '../lib/lottery/betting-strategy-engine.ts';
import { WealthDirectionNavigator } from '../lib/directions/wealth-direction-navigator.ts';
import { PredictionLedgerStore } from '../lib/prediction/prediction-ledger-store.ts';
import { SocialShareHelper } from '../lib/prediction/social-share-helper.ts';

test('Dimension 1: Betting Strategy Engine - Permutation Classification & Recommendations', (t) => {
  // Test 24 doors (all unique)
  const analysis24 = BettingStrategyEngine.analyzePermutations('5729');
  assert.equal(analysis24.totalPermutations, 24);
  assert.equal(analysis24.patternType, '4_DISTINCT');
  assert.ok(analysis24.patternNameZh.includes('24'));

  // Test 12 doors (1 pair)
  const analysis12 = BettingStrategyEngine.analyzePermutations('5529');
  assert.equal(analysis12.totalPermutations, 12);
  assert.equal(analysis12.patternType, '1_PAIR');
  assert.ok(analysis12.patternNameZh.includes('12'));

  // Test 6 doors (2 pairs)
  const analysis6 = BettingStrategyEngine.analyzePermutations('5522');
  assert.equal(analysis6.totalPermutations, 6);
  assert.equal(analysis6.patternType, '2_PAIRS');
  assert.ok(analysis6.patternNameZh.includes('6'));

  // Test 4 doors (3 same)
  const analysis4 = BettingStrategyEngine.analyzePermutations('5552');
  assert.equal(analysis4.totalPermutations, 4);
  assert.equal(analysis4.patternType, '3_SAME');
  assert.ok(analysis4.patternNameZh.includes('4'));

  // Test 1 door (4 same)
  const analysis1 = BettingStrategyEngine.analyzePermutations('5555');
  assert.equal(analysis1.totalPermutations, 1);
  assert.equal(analysis1.patternType, '4_SAME');
  assert.ok(analysis1.patternNameZh.includes('1门'));

  // Test Strategy Recommendation
  const rec = BettingStrategyEngine.generateStrategy('5729', 85);
  assert.equal(rec.suitabilityLevel, 'HIGH');
  assert.ok(rec.operators.length >= 3, 'Must support Magnum, DaMaCai, Sports Toto');
  assert.ok(rec.primaryPackage.totalBudgetRm <= 10, 'Must be rational small budget');
  assert.ok(rec.conservativePackage.totalBudgetRm <= 5, 'Conservative package under RM5');
});

test('Dimension 2: Wealth Compass & Outing Direction Navigator', (t) => {
  const mockDailyDirection = {
    date: '2026-09-13',
    topDirection: 'S',
    secondaryDirection: 'SW',
    leastDirection: 'N',
  };

  const guide = WealthDirectionNavigator.calculateGuide(
    mockDailyDirection,
    undefined,
    '申时 (15:00 - 17:00)',
    '午时 (11:00 - 13:00)'
  );

  assert.equal(guide.primaryCode, 'S');
  assert.ok(guide.primaryNameZh.includes('南方') || guide.primaryNameZh.includes('正南'));
  assert.equal(guide.primaryDegree, 180);
  assert.equal(guide.auspiciousHourWindow, '申时 (15:00 - 17:00)');
  assert.ok(guide.tripAdviceZh.includes('申时'), 'Guidance should include auspicious hour');
  assert.ok(guide.tripAdviceZh.includes('正南') || guide.tripAdviceZh.includes('南'), 'Guidance should include direction');
});

test('Dimension 3: Prediction Ledger Store & Metaphysical Performance Backtest', (t) => {
  const records = PredictionLedgerStore.getAll();
  assert.ok(records.length >= 5, 'Should have initial seeded records');

  const stats = PredictionLedgerStore.getMetrics();
  assert.ok(stats.totalLogged >= 5, 'Total logged calculated');
  assert.ok(typeof stats.hitRatePercent === 'number', 'Hit rate is numeric');
  assert.ok(typeof stats.top3PrizeHits === 'number', 'Top 3 prizes calculated');
  assert.ok(stats.metaphysicalInsightZh.length > 0, 'Metaphysical rules derived');

  // Test adding a record
  const initialCount = records.length;
  PredictionLedgerStore.recordEntry({
    date: '2026-09-14',
    dayStemBranch: '辛卯日',
    motherCode: '3819',
    score: 93.0,
    windfallScore: 88,
    windfallSuitability: '吉星拱财',
    hasHit: true,
    hitType: 'DIRECT',
    hitTier: '头奖 (1st Prize)',
    hitOperator: '万能 4D',
    hitDate: '2026-09-14',
    notes: '流日禄马交驰，干支完全契合',
  });

  const updatedRecords = PredictionLedgerStore.getAll();
  assert.equal(updatedRecords.length, initialCount + 1);

  const updatedStats = PredictionLedgerStore.getMetrics();
  assert.ok(updatedStats.directHits >= 2, 'Direct hits should be updated');
});

test('Dimension 4: Social Share Report Text Helper', (t) => {
  const sampleProfile = {
    id: 'user-rms',
    name: '命主RMS',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '14:30',
    birthHour: 14,
    birthMinute: 30,
    birthPlace: 'Kuala Lumpur',
    timezone: 'Asia/Kuala_Lumpur',
    calendarType: 'gregorian',
  };

  const sampleWindfall = {
    score: 88,
    suitability: 'HIGHLY_SUITABLE',
    suitabilityZh: '大吉宜投',
    suitabilityColor: 'text-emerald-400',
    verdictAdvice: '吉星照耀',
    auspiciousHour: '申时 (15:00 - 17:00)',
    avoidHour: '午时 (11:00 - 13:00)',
    wealthPalaceSummary: '财帛宫化禄',
    riskToleranceRating: '激进适度',
  };

  const sampleClothing = {
    dailyElement: 'Metal',
    dailyElementZh: '金',
    userBureauZh: '水二局',
    primaryColors: [{ name: '金黄色', hex: '#EAB308', elementZh: '金', bgStyle: 'bg-amber-400' }],
    secondaryColors: [{ name: '乳白色', hex: '#FFFFFF', elementZh: '金', bgStyle: 'bg-slate-100' }],
    avoidColors: [{ name: '大红色', hex: '#EF4444', elementZh: '火', bgStyle: 'bg-rose-500' }],
    accessoryAdvice: '佩戴白水晶或金饰',
    overallAdviceZh: '金气生发，财运聚拢',
  };

  const reportText = SocialShareHelper.generateShareText({
    profile: sampleProfile,
    dateStr: '2026-09-13',
    dayStemBranch: '庚寅日',
    motherCode: '5729',
    score: 94.2,
    windfallAnalysis: sampleWindfall,
    clothingAdvice: sampleClothing,
  });

  assert.ok(reportText.includes('紫微时空数字推演'), 'Header should be present');
  assert.ok(reportText.includes('5729'), 'Mother code must be present');
  assert.ok(reportText.includes('庚寅日'), 'Day stem branch must be present');
  assert.ok(reportText.includes('大吉宜投'), 'Windfall suitability must be present');
  assert.ok(reportText.includes('理性敬告'), 'Disclaimer must be present');
});
