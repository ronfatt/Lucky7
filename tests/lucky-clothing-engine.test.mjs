// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Lucky Clothing Engine Test Suite
// File: tests/lucky-clothing-engine.test.mjs
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { LuckyClothingEngine } from '../lib/engines/daily/lucky-clothing-engine.ts';
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

test('Lucky Clothing Engine - Calculates Lucky Colors for 2026-09-13 (庚寅日 · Metal Transit)', (t) => {
  const dailySig = DailyEngine.generateDailySignature('2026-09-13', SAMPLE_PROFILE.timezone); // 庚寅日 -> 庚 (Metal)
  const advice = LuckyClothingEngine.calculateLuckyClothing(SAMPLE_PROFILE, dailySig);

  assert.equal(advice.dailyElement, 'Metal', 'Day stem 庚 must be Metal element');
  assert.equal(advice.dailyElementZh, '金', 'Day stem 庚 must be 金');

  // Primary colors should include Water / Metal (black, navy, white)
  assert.ok(advice.primaryColors.length >= 2, 'Must provide primary lucky colors');
  const primaryNames = advice.primaryColors.map((c) => c.name).join(' ');
  assert.ok(primaryNames.includes('黑') || primaryNames.includes('蓝') || primaryNames.includes('白'), 'Should recommend Black/Blue/White on Metal transit');

  // Avoid colors should include Fire (火克金)
  assert.ok(advice.avoidColors.length > 0, 'Must provide colors to avoid');
  const avoidNames = advice.avoidColors.map((c) => c.name).join(' ');
  assert.ok(avoidNames.includes('红') || avoidNames.includes('粉'), 'Should avoid red/fire on metal day');

  // Advice text checks
  assert.ok(advice.accessoryAdvice.length > 0, 'Must have accessory advice');
  assert.ok(advice.overallAdviceZh.includes('庚'), 'Advice should reference day stem 庚');
});

test('Lucky Clothing Engine - Handles Earth Day Transit', (t) => {
  const earthSig = {
    gregorianDate: '2026-09-14',
    dayStemBranch: '戊子日',
    dominantElement: 'Earth',
  };
  const earthAdvice = LuckyClothingEngine.calculateLuckyClothing(SAMPLE_PROFILE, earthSig);
  assert.equal(earthAdvice.dailyElement, 'Earth');
  assert.equal(earthAdvice.dailyElementZh, '土');
  assert.ok(earthAdvice.primaryColors.some((c) => c.element === 'Metal' || c.element === 'Earth'));
});
