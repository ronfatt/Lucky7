// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Number Explanation Engine
// File: lib/synthesis/number-explanation-engine.ts
// ==========================================================

import type {
  DigitFeatureVector,
  PersonalNumberDNA,
  PredictionCandidate,
} from '../../types/zwtsp.ts';

export class NumberExplanationEngine {
  /**
   * Produces an objective, feature-grounded natural language explanation for a candidate number
   */
  public static explainCandidate(
    candidate: PredictionCandidate,
    vectors: DigitFeatureVector[],
    personalDNA: PersonalNumberDNA
  ): string {
    const vectorMap = new Map<number, DigitFeatureVector>();
    for (const v of vectors) {
      vectorMap.set(v.digit, v);
    }

    const digits = candidate.number.split('').map(Number);
    const coreDna = personalDNA.coreNumbers || [];
    const explanations: string[] = [];

    for (const d of digits) {
      const v = vectorMap.get(d);
      const isDna = coreDna.includes(d);
      const isTopVector = (v?.rank || 10) <= 4;

      if (isDna && isTopVector) {
        explanations.push(`数字【${d}】兼具个人先天核心DNA与流日高分激活`);
      } else if (isDna) {
        explanations.push(`数字【${d}】契合个人先天气场`);
      } else if (isTopVector) {
        explanations.push(`数字【${d}】受当日流日时空与方位强力激活`);
      } else {
        explanations.push(`数字【${d}】为结构数理支撑位`);
      }
    }

    return `组合【${candidate.number}】（模型评分 ${candidate.score}，评级 ${candidate.confidence}）：${explanations.join('；')}。整体数字和为 ${candidate.breakdown.sum}，数字根为 ${candidate.breakdown.digitalRoot}，各维度气场协同有序。`;
  }
}
