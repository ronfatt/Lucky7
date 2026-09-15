// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Spatial-Number Resonance Matrix
// File: lib/directions/spatial-number-matrix.ts
// ==========================================================

import type {
  DailyNumberActivation,
  DirectionCode,
  WuXingElement,
} from '../../types/zwtsp.ts';
import { ALL_DIRECTION_CODES, DIRECTION_SECTORS, evaluateElementAffinityScore } from './direction-models.ts';
import { getDigitElement } from '../numerology/digit-foundation.ts';

// He Tu pairs: 1-6 Water, 2-7 Fire, 3-8 Wood, 4-9 Metal, 5-0 Earth
const HETU_PAIRS: Record<number, number> = {
  1: 6, 6: 1,
  2: 7, 7: 2,
  3: 8, 8: 3,
  4: 9, 9: 4,
  5: 0, 0: 5,
};

export class SpatialNumberMatrix {
  /**
   * Builds an 8 x 10 Spatial Number Resonance Matrix
   * mapping each Direction to resonance scores for digits 0-9.
   */
  public static buildMatrix(
    dailyActivatedDigits?: DailyNumberActivation[]
  ): Record<DirectionCode, Record<number, number>> {
    const matrix: Partial<Record<DirectionCode, Record<number, number>>> = {};

    const dailyScoresMap: Record<number, number> = {};
    if (dailyActivatedDigits) {
      for (const act of dailyActivatedDigits) {
        dailyScoresMap[act.digit] = act.activationScore;
      }
    }

    for (const code of ALL_DIRECTION_CODES) {
      const sector = DIRECTION_SECTORS[code];
      const digitMap: Record<number, number> = {};

      for (let digit = 0; digit <= 9; digit++) {
        let score = 45; // baseline

        // 1. Luo Shu Palace Match
        if (digit === sector.luoshuNumber) {
          score += 28; // Exact Luo Shu host number match
        } else if (HETU_PAIRS[sector.luoshuNumber] === digit) {
          score += 22; // He Tu generative counterpart
        }

        // 2. Element Affinity between Sector and Digit
        const digitEl = getDigitElement(digit);
        const elAffinity = evaluateElementAffinityScore(digitEl, sector.element);
        score += (elAffinity - 60) * 0.35;

        // 3. Daily Activation influence
        if (dailyScoresMap[digit] !== undefined) {
          const dailyInfluence = (dailyScoresMap[digit] - 50) * 0.25;
          score += dailyInfluence;
        }

        // Clamp between 10 and 99
        digitMap[digit] = Math.max(10, Math.min(99, Number(score.toFixed(1))));
      }

      matrix[code] = digitMap;
    }

    return matrix as Record<DirectionCode, Record<number, number>>;
  }

  /**
   * Retrieves the Top N resonant digits for a specific direction
   */
  public static getTopDigitsForDirection(
    matrix: Record<DirectionCode, Record<number, number>>,
    direction: DirectionCode,
    limit: number = 3
  ): number[] {
    const dirMap = matrix[direction];
    if (!dirMap) return [];

    return Object.entries(dirMap)
      .map(([digitStr, score]) => ({ digit: Number(digitStr), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.digit);
  }
}
