// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Calendar Conversion Engine
// File: lib/engines/calendar/calendar-engine.ts
// ==========================================================

import type { FourPillarsData, WuXingElement } from '../../../types/zwtsp.ts';

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const STEM_ELEMENTS: Record<string, WuXingElement> = {
  甲: 'Wood', 乙: 'Wood',
  丙: 'Fire', 丁: 'Fire',
  戊: 'Earth', 己: 'Earth',
  庚: 'Metal', 辛: 'Metal',
  壬: 'Water', 癸: 'Water',
};

export const BRANCH_ELEMENTS: Record<string, WuXingElement> = {
  寅: 'Wood', 卯: 'Wood',
  巳: 'Fire', 午: 'Fire',
  辰: 'Earth', 丑: 'Earth', 未: 'Earth', 戌: 'Earth',
  申: 'Metal', 酉: 'Metal',
  亥: 'Water', 子: 'Water',
};

// Five Tigers Dun (五虎遁元) Year Stem -> Month Stem for 寅月 (1st Lunar Month)
// 甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚上，丁壬壬位顺行流，若言戊癸何方发，甲寅之上好追求。
const FIVE_TIGERS: Record<string, number> = {
  甲: 2, 己: 2, // 丙寅
  乙: 4, 庚: 4, // 戊寅
  丙: 6, 辛: 6, // 庚寅
  丁: 8, 壬: 8, // 壬寅
  戊: 0, 癸: 0, // 甲寅
};

// Five Rats Dun (五鼠遁元) Day Stem -> Hour Stem for 子时 (23:00 - 01:00)
// 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途。
const FIVE_RATS: Record<string, number> = {
  甲: 0, 己: 0, // 甲子
  乙: 2, 庚: 2, // 丙子
  丙: 4, 辛: 4, // 戊子
  丁: 6, 壬: 6, // 庚子
  戊: 8, 癸: 8, // 壬子
};

export interface LunarDateResult {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  lunarString: string;
}

/**
 * Astronomical Lunar Calendar Bit Data (1900-2100)
 * Format: 0x[leap_month_flag (4 bits)][month_days (12-13 bits)][leap_month_days (1 bit)]
 */
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];

export class CalendarConversionEngine {
  public static readonly VERSION = 'CAL-V1.0';

  /**
   * Converts Gregorian date to Chinese Lunar Date
   */
  public static toLunarDate(dateStr: string): LunarDateResult {
    const parts = dateStr.split('-').map(Number);
    const gYear = parts[0];
    const gMonth = parts[1];
    const gDay = parts[2];

    const baseDate = new Date(Date.UTC(1900, 0, 31));
    const targetDate = new Date(Date.UTC(gYear, gMonth - 1, gDay));
    let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);

    let lYear = 1900;
    let daysInYear = 0;

    for (let i = 1900; i <= 2100 && offset > 0; i++) {
      daysInYear = this.getLunarYearDays(i);
      offset -= daysInYear;
      lYear = i;
    }

    if (offset < 0) {
      offset += daysInYear;
    } else {
      lYear++;
    }

    const leapMonth = this.getLeapMonth(lYear);
    let isLeap = false;
    let lMonth = 1;
    let daysInMonth = 0;

    for (let m = 1; m <= 12 && offset >= 0; m++) {
      if (leapMonth > 0 && m === leapMonth + 1 && !isLeap) {
        --m;
        isLeap = true;
        daysInMonth = this.getLeapDays(lYear);
      } else {
        daysInMonth = this.getLunarMonthDays(lYear, m);
      }

      if (isLeap && m === leapMonth + 1) {
        isLeap = false;
      }

      offset -= daysInMonth;
      if (offset <= 0) {
        lMonth = m;
        break;
      }
    }

    offset += daysInMonth;
    const lDay = offset + 1;

    const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const lunarString = `农历${lYear}年${isLeap ? '闰' : ''}${monthNames[lMonth - 1]}月${lDay}日`;

    return {
      lunarYear: lYear,
      lunarMonth: lMonth,
      lunarDay: lDay,
      isLeapMonth: isLeap,
      lunarString,
    };
  }

  private static getLunarYearDays(year: number): number {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    }
    return sum + this.getLeapDays(year);
  }

  private static getLeapMonth(year: number): number {
    return LUNAR_INFO[year - 1900] & 0xf;
  }

  private static getLeapDays(year: number): number {
    if (this.getLeapMonth(year)) {
      return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  private static getLunarMonthDays(year: number, month: number): number {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  }

  /**
   * Calculates Julian Day Number for an exact Gregorian calendar date
   */
  public static getJulianDay(year: number, month: number, day: number): number {
    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  }

  /**
   * Calculates the Four Pillars (八字) for a given Gregorian date and optional time
   */
  public static getFourPillars(dateStr: string, timeStr?: string, isHourKnown: boolean = true): FourPillarsData {
    const parts = dateStr.split('-').map(Number);
    const gYear = parts[0];
    const gMonth = parts[1];
    const gDay = parts[2];

    const lunar = this.toLunarDate(dateStr);

    // Year Pillar: Year Stem & Branch based on Lunar Year
    const yearStemIdx = (lunar.lunarYear - 4) % 10;
    const yearBranchIdx = (lunar.lunarYear - 4) % 12;
    const yearStem = HEAVENLY_STEMS[(yearStemIdx + 10) % 10];
    const yearBranch = EARTHLY_BRANCHES[(yearBranchIdx + 12) % 12];

    // Month Pillar: Lunar Month + Five Tigers formula
    const monthBranchIdx = (lunar.lunarMonth + 1) % 12; // 1st lunar month starts at 寅 (idx 2)
    const monthBranch = EARTHLY_BRANCHES[monthBranchIdx];
    const tigerStart = FIVE_TIGERS[yearStem] ?? 2;
    const monthStemIdx = (tigerStart + (lunar.lunarMonth - 1)) % 10;
    const monthStem = HEAVENLY_STEMS[monthStemIdx];

    // Day Pillar: Calculated via Julian Day Number
    const jdn = this.getJulianDay(gYear, gMonth, gDay);
    const dayOffset = Math.floor(jdn + 0.5) + 49;
    const dayStem = HEAVENLY_STEMS[((dayOffset % 10) + 10) % 10];
    const dayBranch = EARTHLY_BRANCHES[((dayOffset % 12) + 12) % 12];

    // Hour Pillar: If known, based on time and Day Stem (Five Rats Dun)
    let hourStem: string | undefined;
    let hourBranch: string | undefined;
    let hourElement: WuXingElement | undefined;

    if (isHourKnown && timeStr) {
      const tParts = timeStr.split(':').map(Number);
      const hour = tParts[0];
      // Earthly branch hours: 23:00-01:00 子, 01:00-03:00 丑, 03:00-05:00 寅...
      const hBranchIdx = Math.floor(((hour + 1) % 24) / 2);
      hourBranch = EARTHLY_BRANCHES[hBranchIdx];
      const ratStart = FIVE_RATS[dayStem] ?? 0;
      const hStemIdx = (ratStart + hBranchIdx) % 10;
      hourStem = HEAVENLY_STEMS[hStemIdx];
      hourElement = STEM_ELEMENTS[hourStem];
    }

    const yearElement = STEM_ELEMENTS[yearStem];
    const monthElement = STEM_ELEMENTS[monthStem];
    const dayElement = STEM_ELEMENTS[dayStem];
    const dayMaster = dayStem;
    const dayMasterElement = dayElement;

    // Calculate element distribution (stems + branches)
    const distribution: Record<WuXingElement, number> = {
      Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0,
    };

    distribution[yearElement]++;
    distribution[BRANCH_ELEMENTS[yearBranch]]++;
    distribution[monthElement]++;
    distribution[BRANCH_ELEMENTS[monthBranch]]++;
    distribution[dayElement]++;
    distribution[BRANCH_ELEMENTS[dayBranch]]++;

    if (hourStem && hourBranch) {
      distribution[STEM_ELEMENTS[hourStem]]++;
      distribution[BRANCH_ELEMENTS[hourBranch]]++;
    }

    return {
      yearStem,
      yearBranch,
      monthStem,
      monthBranch,
      dayStem,
      dayBranch,
      hourStem,
      hourBranch,
      yearElement,
      monthElement,
      dayElement,
      hourElement,
      dayMaster,
      dayMasterElement,
      elementDistribution: distribution,
      isHourKnown: Boolean(isHourKnown && hourStem && hourBranch),
      calculationVersion: this.VERSION,
    };
  }
}
