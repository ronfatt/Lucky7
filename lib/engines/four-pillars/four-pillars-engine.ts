// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Four Pillars Engine
// File: lib/engines/four-pillars/four-pillars-engine.ts
// ==========================================================

import type { BirthProfile, FourPillarsData, WuXingElement } from '../../../types/zwtsp.ts';
import { CalendarConversionEngine } from '../calendar/calendar-engine.ts';

export class FourPillarsEngine {
  public static readonly VERSION = 'BAZI-V1.0';

  /**
   * Generates Four Pillars data for a given birth profile
   */
  public static calculateFourPillars(profile: BirthProfile): FourPillarsData {
    const isHourKnown = profile.birthTimePrecision !== 'UNKNOWN';
    return CalendarConversionEngine.getFourPillars(
      profile.birthDate,
      profile.birthTime,
      isHourKnown
    );
  }

  /**
   * Normalizes element distribution percentages across Wood, Fire, Earth, Metal, Water to sum to 100
   */
  public static normalizeDistribution(rawDistribution: Record<WuXingElement, number>): Record<WuXingElement, number> {
    const total = Object.values(rawDistribution).reduce((a, b) => a + b, 0);
    if (total === 0) {
      return { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
    }

    const normalized: Record<WuXingElement, number> = {
      Wood: Math.round((rawDistribution.Wood / total) * 100),
      Fire: Math.round((rawDistribution.Fire / total) * 100),
      Earth: Math.round((rawDistribution.Earth / total) * 100),
      Metal: Math.round((rawDistribution.Metal / total) * 100),
      Water: Math.round((rawDistribution.Water / total) * 100),
    };

    // Ensure sum equals 100 by adjusting the largest value
    const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const keys = Object.keys(normalized) as WuXingElement[];
      keys.sort((a, b) => normalized[b] - normalized[a]);
      normalized[keys[0]] += (100 - sum);
    }

    return normalized;
  }
}
