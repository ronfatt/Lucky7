// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 24 Solar Terms Engine
// File: lib/engines/calendar/solar-terms.ts
// ==========================================================

import type { SolarTermInfo } from '../../../types/zwtsp.ts';
import { CalendarConversionEngine } from './calendar-engine.ts';

export const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
] as const;

export class SolarTermEngine {
  public static readonly VERSION = 'SOLAR-V2.0';

  /**
   * Resolves the exact Solar Term for any Gregorian date via solar ecliptic longitude
   */
  public static getSolarTermInfo(dateStr: string): SolarTermInfo {
    const parts = dateStr.split('-').map(Number);
    const year = parts[0];
    const month = parts[1]; // 1-12
    const day = parts[2];   // 1-31

    const solarLon = CalendarConversionEngine.getSolarLongitude(year, month, day, 12);
    // 24 terms: 15° each, starting from 285° (0: 小寒)
    const termIndex = Math.floor(((solarLon - 285 + 360) % 360) / 15);
    const currentTerm = SOLAR_TERMS[termIndex];
    const prevTerm = SOLAR_TERMS[(termIndex - 1 + 24) % 24];
    const nextTerm = SOLAR_TERMS[(termIndex + 1) % 24];

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

    // Find exact solar term start and end boundaries (within ~16 days)
    let startD = new Date(Date.UTC(year, month - 1, day));
    while (true) {
      const prevD = new Date(startD.getTime() - 86400000);
      const pLon = CalendarConversionEngine.getSolarLongitude(prevD.getUTCFullYear(), prevD.getUTCMonth() + 1, prevD.getUTCDate(), 12);
      const pIdx = Math.floor(((pLon - 285 + 360) % 360) / 15);
      if (pIdx !== termIndex) break;
      startD = prevD;
    }

    let endD = new Date(Date.UTC(year, month - 1, day));
    while (true) {
      const nextD = new Date(endD.getTime() + 86400000);
      const nLon = CalendarConversionEngine.getSolarLongitude(nextD.getUTCFullYear(), nextD.getUTCMonth() + 1, nextD.getUTCDate(), 12);
      const nIdx = Math.floor(((nLon - 285 + 360) % 360) / 15);
      if (nIdx !== termIndex) break;
      endD = nextD;
    }

    const termStartStr = startD.toISOString().slice(0, 10);
    const termEndStr = endD.toISOString().slice(0, 10);

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
