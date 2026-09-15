// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Phase 6 Comprehensive Optimization Test Suite
// File: tests/phase6-comprehensive-optimizations.test.mjs
// Verifies:
// 1. Lottery historical analytics, omissions, top 3 prize counts
// 2. 24-hour 12-double-hours curve & 7-day draw calendar forecast
// 3. Saved predictions store & auto draw checker
// 4. Plum blossom imagery & dream divination + plate OCR
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { LotteryPatternEngine } from '../lib/lottery/lottery-pattern-engine.ts';
import { MalaysiaLotteryProvider } from '../lib/lottery/malaysia-provider.ts';
import { WindfallWealthEngine } from '../lib/engines/daily/windfall-wealth-engine.ts';
import { PlumBlossomImageryEngine } from '../lib/literature/plum-blossom-imagery-engine.ts';
import { SavedPredictionsStore } from '../lib/prediction/saved-predictions-store.ts';
import { AutoDrawChecker } from '../lib/prediction/auto-draw-checker.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';

const SAMPLE_PROFILE = {
  id: 'test-user',
  name: '测试命主',
  gender: 'male',
  birthDate: '1990-05-18',
  birthTime: '14:30',
  birthHour: 14,
  birthMinute: 30,
  birthPlace: 'Kuala Lumpur',
  timezone: 'Asia/Kuala_Lumpur',
  calendarType: 'gregorian',
};

test('ZWTSP Dimension 1: Lottery Historical Analytics & Omissions', (t) => {
  const analysis = LotteryPatternEngine.analyzePattern('5729', 'ALL');

  assert.equal(analysis.targetNumber, '5729');
  assert.ok(analysis.totalDrawsScanned > 0, 'Should scan draws');
  assert.ok(typeof analysis.totalHits === 'number', 'Total hits should be a number');
  assert.ok(typeof analysis.top3Hits === 'number', 'Top 3 hits should be calculated');

  // Verify omission stats
  assert.ok(analysis.omissionStats, 'Omission stats must exist');
  assert.ok(typeof analysis.omissionStats.currentOmission === 'number', 'Current omission must be a number');
  assert.ok(typeof analysis.omissionStats.averageOmission === 'number', 'Average omission must be a number');
  assert.ok(typeof analysis.omissionStats.maxOmission === 'number', 'Max omission must be a number');
  assert.ok(
    ['EXTREME_COLD', 'COLD', 'WARM', 'HOT'].includes(analysis.omissionStats.omissionStatus),
    'Omission status must be valid'
  );

  // Verify same stem-branch stats
  assert.ok(analysis.sameStemBranchStats, 'Same stem-branch stats must exist');
  assert.ok(analysis.sameStemBranchStats.summary.length > 0, 'Stem summary must be non-empty');

  // Test summary generator
  const summaryText = LotteryPatternEngine.generatePatternSummary(analysis);
  assert.ok(summaryText.includes('5729'), 'Summary must mention target number');
  assert.ok(summaryText.includes('遗漏'), 'Summary must mention omission analytics');
});

test('ZWTSP Dimension 2: 24-Hour Curve & 7-Day Draw Calendar Forecast', (t) => {
  const ziweiChart = ZiWeiEngine.generateChart(SAMPLE_PROFILE);
  const dailySig = DailyEngine.generateDailySignature('2026-09-13', SAMPLE_PROFILE.timezone);

  // 1. 24-Hour 12 Double-Hours Curve
  const hourlyPoints = WindfallWealthEngine.calculate24HourCurve(ziweiChart, dailySig);
  assert.equal(hourlyPoints.length, 12, 'Must generate exactly 12 double-hours points');

  const branches = hourlyPoints.map((p) => p.branch);
  assert.deepEqual(branches, ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']);

  const bestPoints = hourlyPoints.filter((p) => p.isBest);
  const worstPoints = hourlyPoints.filter((p) => p.isWorst);
  assert.equal(bestPoints.length, 1, 'Exactly one best hour must be flagged');
  assert.equal(worstPoints.length, 1, 'Exactly one worst hour must be flagged');

  // 2. 7-Day Draw Calendar
  const forecast = WindfallWealthEngine.calculate7DayDrawForecast(ziweiChart, '2026-09-13');
  assert.equal(forecast.length, 7, 'Must forecast 7 days');

  // Check draw day flags (Sunday 2026-09-13, Wed 2026-09-16, Sat 2026-09-19)
  const sunday = forecast.find((f) => f.dayOfWeekZh === '周日');
  const wednesday = forecast.find((f) => f.dayOfWeekZh === '周三');
  const monday = forecast.find((f) => f.dayOfWeekZh === '周一');

  assert.ok(sunday && sunday.isDrawDay, 'Sunday must be a draw day');
  assert.ok(wednesday && wednesday.isDrawDay, 'Wednesday must be a draw day');
  assert.ok(monday && !monday.isDrawDay, 'Monday must not be a draw day');
});

test('ZWTSP Dimension 3: Saved Favorites Store & Auto Draw Checker', (t) => {
  const allSaved = SavedPredictionsStore.getAll();
  assert.ok(Array.isArray(allSaved), 'Must return array of saved items');
  assert.ok(allSaved.length > 0, 'Default saved items should be seeded');

  // Save new number
  const saveRes = SavedPredictionsStore.save({
    number: '8833',
    sourceType: 'CANDIDATE',
    sourceTitleZh: '测试候选号',
    date: '2026-09-13',
    score: 88.5,
    notes: '自动测试心水',
  });
  assert.ok(saveRes.success, 'Save should succeed');
  assert.ok(SavedPredictionsStore.isSaved('8833'), 'Should identify saved status');

  // Run auto draw checker
  const checkRes = AutoDrawChecker.checkSingle(saveRes.item);
  assert.ok(typeof checkRes.hasHit === 'boolean');
  assert.ok(typeof checkRes.totalHits === 'number');
  assert.ok(checkRes.highestTierZh.length > 0);
});

test('ZWTSP Dimension 4: Plum Blossom Imagery & Dream Divination + OCR', (t) => {
  // Test dream with fire & dragon
  const fireDream = PlumBlossomImageryEngine.divinateFromImagery('梦见大火与巨龙');
  assert.ok(fireDream.hexagramName.length > 0, 'Must produce a hexagram name');
  assert.equal(fireDream.matchedTrigrams.upper.name, '离', 'Fire must map to Li Trigram');
  assert.equal(fireDream.matchedTrigrams.lower.name, '乾', 'Dragon must map to Qian Trigram');
  assert.equal(fireDream.recommended4DNumbers.length, 4, 'Must yield 4 candidate 4D numbers');

  // Test dream with flood & snake
  const waterDream = PlumBlossomImageryEngine.divinateFromImagery('梦到大暴雨和洪水还有蟒蛇');
  assert.ok(waterDream.matchedTrigrams.upper.name === '坎' || waterDream.matchedTrigrams.lower.name === '坎');
  assert.ok(waterDream.matchedTrigrams.upper.name === '巽' || waterDream.matchedTrigrams.lower.name === '巽');

  // Test Plate parser
  const plateRes = PlumBlossomImageryEngine.parsePlateOrReceipt('WVP 8295 B');
  assert.equal(plateRes.extracted4D, '8295', 'Must extract 8295 from plate');

  const receiptRes = PlumBlossomImageryEngine.parsePlateOrReceipt('Order #INV-2026-3849-PAID');
  assert.equal(receiptRes.extracted4D, '3849', 'Must extract 3849 from receipt');
});
