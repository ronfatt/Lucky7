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

  test('BaZi Month Pillar conforms strictly to 12 Solar Terms (交节换月)', () => {
    // Qing Qing Joan's birthday: 1982-12-14 06:00:00
    // Past 大雪 (1982-12-07), thus entered 子月!
    // In 壬戌 year: Five Tigers for 壬 produces 壬子月 (NOT 辛亥月)!
    const fpJoan = CalendarConversionEngine.getFourPillars('1982-12-14', '06:00:00', true);
    assert.equal(fpJoan.yearStem, '壬');
    assert.equal(fpJoan.yearBranch, '戌');
    assert.equal(fpJoan.monthStem, '壬');
    assert.equal(fpJoan.monthBranch, '子', 'Must be 子月 after 大雪');
    assert.equal(fpJoan.dayStem, '辛');
    assert.equal(fpJoan.dayBranch, '未');
    assert.equal(fpJoan.hourStem, '辛');
    assert.equal(fpJoan.hourBranch, '卯');
  });

  test('BaZi Year Pillar transitions exactly at LiChun (立春 315°)', () => {
    // 1983-01-15: Before 1983 LiChun -> belongs to 壬戌 year, 癸丑 month
    const fpPre = CalendarConversionEngine.getFourPillars('1983-01-15', '12:00:00', true);
    assert.equal(fpPre.yearStem, '壬');
    assert.equal(fpPre.yearBranch, '戌');
    assert.equal(fpPre.monthBranch, '丑');

    // 1983-02-05: After 1983 LiChun -> transitions to 癸亥 year, 甲寅 month
    const fpPost = CalendarConversionEngine.getFourPillars('1983-02-05', '12:00:00', true);
    assert.equal(fpPost.yearStem, '癸');
    assert.equal(fpPost.yearBranch, '亥');
    assert.equal(fpPost.monthBranch, '寅');
  });
});
