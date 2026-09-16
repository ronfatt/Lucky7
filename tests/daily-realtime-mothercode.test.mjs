import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { FourPillarsEngine } from '../lib/engines/four-pillars/four-pillars-engine.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { PersonalNumberDNAEngine } from '../lib/engines/personal-dna/personal-dna-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';
import { PersonalDirectionEngine } from '../lib/directions/personal-direction-engine.ts';
import { DailyDirectionEngine } from '../lib/directions/daily-direction-engine.ts';
import { DigitFeatureVectorEngine } from '../lib/synthesis/digit-feature-vector-engine.ts';
import { CandidateGenerationEngine } from '../lib/synthesis/candidate-generation-engine.ts';
import { MotherCodeEngine } from '../lib/synthesis/mother-code-engine.ts';
import { MemberDailyCalculator } from '../lib/prediction/member-daily-calculator.ts';
import { getRealtimeDate } from '../lib/utils/date-utils.ts';

describe('Real-time & Dynamic Daily Mother Code Verification', () => {
  const ronProfile = {
    id: 'user-ron',
    name: 'Ron Fatt',
    gender: 'male',
    birth_date: '1985-11-20',
    birth_time: '09:30:00',
    timezone: 'Asia/Kuala_Lumpur',
  };

  const liProfile = {
    id: 'user-li',
    name: '李知命',
    gender: 'male',
    birth_date: '1990-05-18',
    birth_time: '09:30:00',
    timezone: 'Asia/Shanghai',
  };

  const wangProfile = {
    id: 'user-wang',
    name: '王小美',
    gender: 'female',
    birth_date: '1995-08-12',
    birth_time: '14:20:00',
    timezone: 'Asia/Kuala_Lumpur',
  };

  test('1. Same member produces evolving, distinct mother codes across consecutive days', () => {
    const dates = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'];
    const codes = [];

    for (const d of dates) {
      const pred = MemberDailyCalculator.calculate(ronProfile, d);
      assert.ok(pred.motherCode && pred.motherCode.length === 4, `Valid 4-digit code expected for ${d}`);
      codes.push(pred.motherCode);
    }

    // Ensure they are not all identical static numbers (which was the bug previously)
    const uniqueCodes = new Set(codes);
    assert.ok(
      uniqueCodes.size >= 3,
      `Consecutive days must produce dynamically evolving mother codes. Got: ${codes.join(', ')}`
    );
  });

  test('2. Different members on the same date produce distinct personalized mother codes', () => {
    const testDate = '2026-09-17';
    const predRon = MemberDailyCalculator.calculate(ronProfile, testDate);
    const predLi = MemberDailyCalculator.calculate(liProfile, testDate);
    const predWang = MemberDailyCalculator.calculate(wangProfile, testDate);

    assert.notEqual(
      predRon.motherCode,
      predLi.motherCode,
      `Ron (${predRon.motherCode}) and Li (${predLi.motherCode}) must have distinct codes`
    );
    assert.notEqual(
      predRon.motherCode,
      predWang.motherCode,
      `Ron (${predRon.motherCode}) and Wang (${predWang.motherCode}) must have distinct codes`
    );
  });

  test('3. Real-time date utility returns current YYYY-MM-DD for Asia/Kuala_Lumpur', () => {
    const realtimeDate = getRealtimeDate('Asia/Kuala_Lumpur');
    assert.match(realtimeDate, /^\d{4}-\d{2}-\d{2}$/, 'Should be valid YYYY-MM-DD format');

    const predToday = MemberDailyCalculator.calculate(ronProfile, realtimeDate);
    assert.ok(predToday.motherCode.length === 4);
    assert.equal(predToday.date, realtimeDate);
  });
});
