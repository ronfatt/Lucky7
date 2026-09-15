// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Windfall Wealth Engine Unit Tests
// File: tests/windfall-wealth-engine.test.mjs
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { WindfallWealthEngine } from '../lib/engines/daily/windfall-wealth-engine.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';

const completeProfile = {
  name: '知命测试',
  gender: 'male',
  birthDate: '1990-05-18',
  birthTime: '09:30:00', // 巳时
  birthTimePrecision: 'EXACT',
  birthPlace: '吉隆坡',
  timezone: 'Asia/Kuala_Lumpur',
  calendarType: 'gregorian',
};

const unknownHourProfile = {
  ...completeProfile,
  birthTimePrecision: 'UNKNOWN',
  birthTime: undefined,
};

test('1. Unknown birth hour produces safe, conservative windfall wealth assessment', () => {
  const chart = ZiWeiEngine.generateChart(unknownHourProfile);
  const sig = DailyEngine.generateDailySignature('2026-09-13', 'Asia/Kuala_Lumpur');
  const analysis = WindfallWealthEngine.evaluateWindfall(chart, sig);

  assert.equal(analysis.suitability, 'UNSUITABLE');
  assert.ok(analysis.score <= 50, 'Score should be conservative (<= 50)');
  assert.ok(analysis.verdictTitle.includes('时辰未知'));
  assert.ok(analysis.antiGamblingWarning.includes('切勿沉迷赌博'));
});

test('2. Complete chart evaluates windfall score and returns structured rating', () => {
  const chart = ZiWeiEngine.generateChart(completeProfile);
  const sig = DailyEngine.generateDailySignature('2026-09-13', 'Asia/Kuala_Lumpur');
  const analysis = WindfallWealthEngine.evaluateWindfall(chart, sig);

  assert.ok(typeof analysis.score === 'number');
  assert.ok(analysis.score >= 12 && analysis.score <= 98);
  assert.ok(['VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'].includes(analysis.level));
  assert.ok(['SUITABLE', 'NEUTRAL', 'UNSUITABLE', 'STRICTLY_AVOID'].includes(analysis.suitability));
  assert.ok(analysis.verdictTitle.length > 0);
  assert.ok(analysis.verdictAdvice.length > 0);
  assert.ok(analysis.keyInfluences.length > 0);
  assert.ok(analysis.antiGamblingWarning.length > 0);
});

test('3. Day stem transit triggering 化忌 on wealth/fortune palace severely penalizes score', () => {
  // Let's mock a chart where 财帛宫 has 贪狼
  const mockPalaces = [
    {
      palaceName: '财帛宫',
      branch: '午',
      position: 4,
      element: 'Fire',
      stars: [{ name: '贪狼', element: 'Wood', system: 'South', brightness: 'Miao' }],
      transformations: [],
    },
    {
      palaceName: '福德宫',
      branch: '子',
      position: 10,
      element: 'Water',
      stars: [{ name: '地劫', element: 'Fire', system: 'North', brightness: 'Ping' }],
      transformations: [],
    },
  ];

  const mockChart = {
    bureau: '火六局',
    lifePalaceBranch: '寅',
    lifePalacePosition: 0,
    bodyPalaceBranch: '午',
    bodyPalacePosition: 4,
    palaces: mockPalaces,
    calculationVersion: 'ZW-TEST-1.0',
    isComplete: true,
  };

  // Day Stem '癸' -> 贪狼化忌!
  const sigJi = {
    date: '2026-09-13',
    timezone: 'Asia/Kuala_Lumpur',
    gregorianDate: '2026-09-13',
    lunarDate: '八月初三',
    solarTerm: { currentTerm: '白露', seasonZh: '仲秋' },
    yearStemBranch: '丙午年',
    monthStemBranch: '丁酉月',
    dayStemBranch: '癸未日', // 癸 -> 贪狼化忌
    hourStemBranch: '丙午时',
    woodScore: 50,
    fireScore: 60,
    earthScore: 50,
    metalScore: 50,
    waterScore: 70,
    dominantElement: 'Water',
    secondaryElement: 'Metal',
    weakElement: 'Earth',
    opportunityScore: 55,
    opportunityLevel: 'NORMAL',
    primaryWindow: '申时',
    secondaryWindow: '亥时',
    avoidWindow: '巳时',
    calculationVersion: 'ZW-TEST-1.0',
  };

  const analysisJi = WindfallWealthEngine.evaluateWindfall(mockChart, sigJi);
  // With 贪狼化忌 and 地劫 in 福德宫, score should plummet into STRICTLY_AVOID
  assert.equal(analysisJi.suitability, 'STRICTLY_AVOID');
  assert.ok(analysisJi.score <= 42, `Expected score <= 42, got ${analysisJi.score}`);
  assert.ok(analysisJi.verdictTitle.includes('坚决不宜投注') || analysisJi.verdictTitle.includes('大凶避赌'));
  assert.ok(analysisJi.keyInfluences.some((i) => i.star.includes('化忌')));
});

test('4. Day stem transit triggering 化禄 on wealth/fortune palace significantly boosts score', () => {
  const mockPalaces = [
    {
      palaceName: '财帛宫',
      branch: '午',
      position: 4,
      element: 'Fire',
      stars: [
        { name: '武曲', element: 'Metal', system: 'North', brightness: 'Miao' },
        { name: '天府', element: 'Earth', system: 'South', brightness: 'Miao' },
      ],
      transformations: [],
    },
    {
      palaceName: '福德宫',
      branch: '子',
      position: 10,
      element: 'Water',
      stars: [{ name: '贪狼', element: 'Wood', system: 'South', brightness: 'Miao' }],
      transformations: [],
    },
  ];

  const mockChart = {
    bureau: '金四局',
    lifePalaceBranch: '寅',
    lifePalacePosition: 0,
    bodyPalaceBranch: '午',
    bodyPalacePosition: 4,
    palaces: mockPalaces,
    calculationVersion: 'ZW-TEST-1.0',
    isComplete: true,
  };

  // Day Stem '己' -> 武曲化禄, 贪狼化权!
  const sigLu = {
    date: '2026-09-13',
    timezone: 'Asia/Kuala_Lumpur',
    gregorianDate: '2026-09-13',
    lunarDate: '八月初三',
    solarTerm: { currentTerm: '白露', seasonZh: '仲秋' },
    yearStemBranch: '丙午年',
    monthStemBranch: '丁酉月',
    dayStemBranch: '己巳日', // 己 -> 武曲化禄, 贪狼化权!
    hourStemBranch: '丙午时',
    woodScore: 50,
    fireScore: 60,
    earthScore: 50,
    metalScore: 70,
    waterScore: 50,
    dominantElement: 'Metal',
    secondaryElement: 'Earth',
    weakElement: 'Fire',
    opportunityScore: 85,
    opportunityLevel: 'HIGH',
    primaryWindow: '申时',
    secondaryWindow: '酉时',
    avoidWindow: '午时',
    calculationVersion: 'ZW-TEST-1.0',
  };

  const analysisLu = WindfallWealthEngine.evaluateWindfall(mockChart, sigLu);
  assert.equal(analysisLu.suitability, 'SUITABLE');
  assert.ok(analysisLu.score >= 80, `Expected score >= 80, got ${analysisLu.score}`);
  assert.ok(analysisLu.verdictTitle.includes('极佳') || analysisLu.verdictTitle.includes('吉星拱财'));
  assert.ok(analysisLu.keyInfluences.some((i) => i.star.includes('化禄')));
});
