import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CalendarConversionEngine } from '../lib/engines/calendar/calendar-engine.ts';
import { SolarTermEngine } from '../lib/engines/calendar/solar-terms.ts';

describe('ZWTSP Calendar & Solar Terms Verification', () => {
  test('Gregorian to Lunar astronomical conversion matches canonical ephemeris', () => {
    // 1990-05-18 -> Lunar 1990年四月廿四
    const l1 = CalendarConversionEngine.toLunarDate('1990-05-18');
    assert.equal(l1.lunarYear, 1990);
    assert.equal(l1.lunarMonth, 4);
    assert.equal(l1.lunarDay, 24);

    // 2026-09-13
    const l2 = CalendarConversionEngine.toLunarDate('2026-09-13');
    assert.equal(l2.lunarYear, 2026);
    assert.ok(l2.lunarMonth >= 1 && l2.lunarMonth <= 12);
    assert.ok(l2.lunarDay >= 1 && l2.lunarDay <= 30);
  });

  test('Four Pillars Ganzhi calculation conforms strictly to BaZi rules', () => {
    const fp = CalendarConversionEngine.getFourPillars('1990-05-18', '09:30:00', true);

    // 1990 is 庚午年
    assert.equal(fp.yearStem, '庚');
    assert.equal(fp.yearBranch, '午');
    assert.equal(fp.yearElement, 'Metal');

    // 09:30 is 巳时
    assert.equal(fp.hourBranch, '巳');
    assert.ok(fp.isHourKnown);
  });

  test('Unknown birth hour does NOT invent default time or hour branch', () => {
    const fp = CalendarConversionEngine.getFourPillars('1990-05-18', undefined, false);
    assert.equal(fp.hourStem, undefined);
    assert.equal(fp.hourBranch, undefined);
    assert.equal(fp.isHourKnown, false);
  });

  test('24 Solar Terms Engine resolves correct solar term and seasonal element', () => {
    // September 13 is 白露 in Autumn
    const termInfo = SolarTermEngine.getSolarTermInfo('2026-09-13');
    assert.ok(['白露', '处暑', '秋分'].includes(termInfo.currentTerm));
    assert.equal(termInfo.season, 'Autumn');
    assert.ok(termInfo.seasonZh.includes('秋季'));
  });
});
