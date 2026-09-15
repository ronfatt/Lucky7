// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Wealth Direction Navigator
// File: lib/directions/wealth-direction-navigator.ts
// Calculates directional compass advice, lucky outing hours & retailer directions
// ==========================================================

import type {
  DailyDirectionResult,
  PersonalDirectionProfile,
  DirectionCode,
} from '../../types/zwtsp.ts';

export interface WealthDirectionGuide {
  primaryCode: DirectionCode;
  primaryNameZh: string;
  primaryDegree: number;
  secondaryCode: DirectionCode;
  secondaryNameZh: string;
  secondaryDegree: number;
  avoidCode: DirectionCode;
  avoidNameZh: string;
  auspiciousHourWindow: string;
  avoidHourWindow: string;
  tripAdviceZh: string;
  elementSynergyZh: string;
}

export const DIRECTION_DEGREE_MAP: Record<DirectionCode, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export const DIRECTION_ZH_MAP: Record<DirectionCode, string> = {
  N: '正北方 (坎一水)',
  NE: '东北方 (艮八土)',
  E: '正东方 (震三木)',
  SE: '东南方 (巽四木)',
  S: '正南方 (离九火)',
  SW: '西南方 (坤二土)',
  W: '正西方 (兑七金)',
  NW: '西北方 (乾六金)',
};

export class WealthDirectionNavigator {
  /**
   * Derives directional outing and retailer advice from daily and personal directions
   */
  public static calculateGuide(
    dailyDir?: DailyDirectionResult,
    personalDir?: PersonalDirectionProfile,
    auspiciousHour: string = '申时 (15:00 - 17:00)',
    avoidHour: string = '午时 (11:00 - 13:00)'
  ): WealthDirectionGuide {
    // Default to South (S, 180°) and Southwest (SW, 225°) as classical wealth axes
    let primaryCode: DirectionCode = 'S';
    let secondaryCode: DirectionCode = 'SW';
    let avoidCode: DirectionCode = 'N';

    if (dailyDir) {
      primaryCode = dailyDir.topDirection || 'S';
      secondaryCode = dailyDir.secondaryDirection || 'SW';
      avoidCode = dailyDir.leastDirection || 'N';
    }

    const primaryDegree = DIRECTION_DEGREE_MAP[primaryCode] ?? 180;
    const secondaryDegree = DIRECTION_DEGREE_MAP[secondaryCode] ?? 225;

    const primaryNameZh = DIRECTION_ZH_MAP[primaryCode] || '正南方 (离九火)';
    const secondaryNameZh = DIRECTION_ZH_MAP[secondaryCode] || '西南方 (坤二土)';
    const avoidNameZh = DIRECTION_ZH_MAP[avoidCode] || '正北方 (坎一水)';

    const tripAdviceZh = `今日出行建议：若前往博彩投注站，建议优先选择位于您居所或办公地点【${primaryNameZh.split(' ')[0]}】或【${secondaryNameZh.split(' ')[0]}】的网点。最佳出发时辰为【${auspiciousHour}】，沿此方位纳气吸财；请避开【${avoidNameZh.split(' ')[0]}】。`;
    const elementSynergyZh = `今日时空罗盘【${primaryCode}】方位引动生旺气脉，与流日干支形成良性共振。`;

    return {
      primaryCode,
      primaryNameZh,
      primaryDegree,
      secondaryCode,
      secondaryNameZh,
      secondaryDegree,
      avoidCode,
      avoidNameZh,
      auspiciousHourWindow: auspiciousHour,
      avoidHourWindow: avoidHour,
      tripAdviceZh,
      elementSynergyZh,
    };
  }
}
