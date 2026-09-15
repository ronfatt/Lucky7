// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 24 Solar Terms Engine
// File: lib/engines/calendar/solar-terms.ts
// ==========================================================

import type { SolarTermInfo } from '../../../types/zwtsp.ts';

export const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
] as const;

// Approximate solar term offsets in days from reference century
const SOLAR_TERM_BASE = [
  6.0, 20.5, 4.0, 19.0, 6.0, 21.0,
  5.0, 20.5, 6.0, 21.5, 6.0, 21.5,
  7.0, 23.0, 8.0, 23.5, 8.0, 23.5,
  8.5, 24.0, 7.5, 22.5, 7.5, 22.0
];

export class SolarTermEngine {
  public static readonly VERSION = 'SOLAR-V1.0';

  /**
   * Resolves the current Solar Term for any Gregorian date
   */
  public static getSolarTermInfo(dateStr: string): SolarTermInfo {
    const parts = dateStr.split('-').map(Number);
    const year = parts[0];
    const month = parts[1]; // 1-12
    const day = parts[2];   // 1-31

    // Determine the two candidate terms for this month
    const termIndex1 = (month - 1) * 2;
    const termIndex2 = termIndex1 + 1;

    const termDay1 = Math.floor(SOLAR_TERM_BASE[termIndex1]);
    const termDay2 = Math.floor(SOLAR_TERM_BASE[termIndex2]);

    let currentTerm: string;
    let prevTerm: string;
    let nextTerm: string;

    if (day < termDay1) {
      // Prior to 1st term of month: current term is 2nd term of previous month
      const prevIdx = (termIndex1 - 1 + 24) % 24;
      currentTerm = SOLAR_TERMS[prevIdx];
      prevTerm = SOLAR_TERMS[(prevIdx - 1 + 24) % 24];
      nextTerm = SOLAR_TERMS[termIndex1];
    } else if (day >= termDay1 && day < termDay2) {
      // Between 1st and 2nd term of month
      currentTerm = SOLAR_TERMS[termIndex1];
      prevTerm = SOLAR_TERMS[(termIndex1 - 1 + 24) % 24];
      nextTerm = SOLAR_TERMS[termIndex2];
    } else {
      // At or after 2nd term of month
      currentTerm = SOLAR_TERMS[termIndex2];
      prevTerm = SOLAR_TERMS[termIndex1];
      nextTerm = SOLAR_TERMS[(termIndex2 + 1) % 24];
    }

    // Determine season based on solar term
    let season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'FourSeasonsEnd' = 'Autumn';
    let seasonZh = '秋季';

    if (['立春', '雨水', '惊蛰', '春分', '清明'].includes(currentTerm)) {
      season = 'Spring';
      seasonZh = '春季 · 木旺条达';
    } else if (['立夏', '小满', '芒种', '夏至', '小暑'].includes(currentTerm)) {
      season = 'Summer';
      seasonZh = '夏季 · 火旺光明';
    } else if (['立秋', '处暑', '白露', '秋分', '寒露'].includes(currentTerm)) {
      season = 'Autumn';
      seasonZh = '秋季 · 金气肃敛';
    } else if (['立冬', '小雪', '大雪', '冬至', '小寒'].includes(currentTerm)) {
      season = 'Winter';
      seasonZh = '冬季 · 水德归藏';
    } else {
      season = 'FourSeasonsEnd';
      seasonZh = '四季末 · 坤土斡旋';
    }

    const termStartStr = `${year}-${String(month).padStart(2, '0')}-${String(Math.max(1, day < termDay2 ? termDay1 : termDay2)).padStart(2, '0')}`;
    const termEndStr = `${year}-${String(month).padStart(2, '0')}-${String(day < termDay1 ? termDay1 : termDay2).padStart(2, '0')}`;

    return {
      currentTerm,
      previousTerm: prevTerm,
      nextTerm,
      season,
      seasonZh,
      termStartDate: termStartStr,
      termEndDate: termEndStr,
    };
  }
}
