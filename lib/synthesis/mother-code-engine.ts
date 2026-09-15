// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Mother Code Engine
// File: lib/synthesis/mother-code-engine.ts
// ==========================================================

import type {
  MotherCodeResult,
  PredictionCandidate,
} from '../../types/zwtsp.ts';

export class MotherCodeEngine {
  /**
   * Deterministically identifies the primary Mother Code from ranked candidates
   */
  public static extractMotherCode(candidates: PredictionCandidate[]): MotherCodeResult {
    if (!candidates || candidates.length === 0) {
      return {
        motherCode: '0000',
        score: 50.0,
        rank: 1,
        breakdown: {
          digitStrength: 50,
          dnaScore: 50,
          dailyScore: 50,
          realityScore: 50,
          directionScore: 50,
          patternScore: 50,
          canonScore: 50,
          sum: 0,
          digitalRoot: 0,
        },
        confidence: 'LOW',
        resonantDigits: [0],
        summary: '当前无有效候选序列。',
      };
    }

    const top1 = candidates[0];
    const resonantDigits = Array.from(new Set(top1.number.split('').map(Number)));

    const canonDesc = top1.breakdown.bodyUseRelation ? `，易理体用【${top1.breakdown.bodyUseRelation}】` : '';
    const summary = `本期母码【${top1.number}】：单字均分 ${top1.breakdown.digitStrength}，数字和 ${top1.breakdown.sum} (数字根 ${top1.breakdown.digitalRoot})${canonDesc}，综合模型得分 ${top1.score} 分。`;

    return {
      motherCode: top1.number,
      score: top1.score,
      rank: 1,
      breakdown: top1.breakdown,
      confidence: top1.confidence,
      resonantDigits,
      summary,
    };
  }
}
