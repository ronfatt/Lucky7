// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Fusion Scoring & Combination Engine
// File: lib/scoring/fusion-engine.ts
// ==========================================================

import type {
  DigitScores,
  MotherVariationResult,
  OpportunityLevel,
  OpportunityWindow,
  WeightConfiguration,
} from '../../types/zwtsp.ts';
import { getHeTuPartner } from '../numerology/digit-foundation.ts';

export const DEFAULT_WEIGHT_CONFIG: WeightConfiguration = {
  weightDestiny: 15,
  weightBazi: 15,
  weightStars: 10,
  weightTransformations: 5,
  weightElements: 10,
  weightLuoshu: 10,
  weightReality: 5,
  weightHistorical: 20,
  weightStructure: 10,
};

export class FusionScoringEngine {
  private weights: WeightConfiguration;

  constructor(customWeights: Partial<WeightConfiguration> = {}) {
    this.weights = { ...DEFAULT_WEIGHT_CONFIG, ...customWeights };
    this.normalizeWeights();
  }

  private normalizeWeights(): void {
    const sum =
      this.weights.weightDestiny +
      this.weights.weightBazi +
      this.weights.weightStars +
      this.weights.weightTransformations +
      this.weights.weightElements +
      this.weights.weightLuoshu +
      this.weights.weightReality +
      this.weights.weightHistorical +
      this.weights.weightStructure;

    if (sum !== 100 && sum > 0) {
      this.weights.weightDestiny = (this.weights.weightDestiny / sum) * 100;
      this.weights.weightBazi = (this.weights.weightBazi / sum) * 100;
      this.weights.weightStars = (this.weights.weightStars / sum) * 100;
      this.weights.weightTransformations = (this.weights.weightTransformations / sum) * 100;
      this.weights.weightElements = (this.weights.weightElements / sum) * 100;
      this.weights.weightLuoshu = (this.weights.weightLuoshu / sum) * 100;
      this.weights.weightReality = (this.weights.weightReality / sum) * 100;
      this.weights.weightHistorical = (this.weights.weightHistorical / sum) * 100;
      this.weights.weightStructure = (this.weights.weightStructure / sum) * 100;
    }
  }

  /**
   * Computes the normalized final score for a digit across the 9 dimensions
   */
  public computeDigitScore(scores: Omit<DigitScores, 'finalScore'>): DigitScores {
    const rawWeighted =
      (scores.personalScore * this.weights.weightDestiny) / 100 +
      (scores.timeScore * this.weights.weightBazi) / 100 +
      (scores.starScore * this.weights.weightStars) / 100 +
      (scores.transformationScore * this.weights.weightTransformations) / 100 +
      (scores.elementScore * this.weights.weightElements) / 100 +
      (scores.luoshuScore * this.weights.weightLuoshu) / 100 +
      (scores.realityScore * this.weights.weightReality) / 100 +
      (scores.historicalScore * this.weights.weightHistorical) / 100 +
      (scores.palaceScore * this.weights.weightStructure) / 100;

    // Strict non-negative clamping between 0 and 100
    const finalScore = Math.min(100, Math.max(0, Number(rawWeighted.toFixed(2))));

    return {
      ...scores,
      finalScore,
    };
  }

  /**
   * Evaluates Model Consistency across 9 independent engines (0-100)
   * Principle: Low variance across sub-models indicates high mutual resonance.
   * STRICT NOTE: This is NEVER winning probability.
   */
  public calculateModelConsistency(scores: DigitScores[]): number {
    if (scores.length === 0) return 50;

    // Calculate variance of sub-scores for top ranking digits
    const topScores = [...scores].sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);

    let totalVariance = 0;
    for (const d of topScores) {
      const components = [
        d.personalScore,
        d.timeScore,
        d.starScore,
        d.transformationScore,
        d.elementScore,
        d.luoshuScore,
        d.realityScore,
        d.historicalScore,
      ];
      const mean = components.reduce((acc, v) => acc + v, 0) / components.length;
      const variance = components.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / components.length;
      totalVariance += Math.sqrt(variance);
    }

    const avgStdDev = totalVariance / topScores.length;
    // Lower stdDev -> Higher consistency
    const consistency = Math.min(100, Math.max(0, Number((100 - avgStdDev * 1.5).toFixed(1))));
    return consistency;
  }

  /**
   * Generates Opportunity Window & Caution Guard
   */
  public evaluateOpportunityWindow(macroScore: number): OpportunityWindow {
    let level: OpportunityLevel = 'NORMAL';
    if (macroScore < 30) level = 'LOW';
    else if (macroScore < 50) level = 'WEAK';
    else if (macroScore < 70) level = 'NORMAL';
    else if (macroScore < 85) level = 'STRONG';
    else level = 'VERY STRONG';

    let cautionNotice: string | undefined;
    if (macroScore < 40) {
      cautionNotice = '今日不建议因本系统增加投注。';
    }

    return {
      score: macroScore,
      level,
      primaryTimeWindow: '巳时 (09:00 - 11:00) · 气清神定',
      secondaryTimeWindow: '申时 (15:00 - 17:00) · 金水互生',
      avoidTimeWindow: '午时 (11:00 - 13:00) · 烈阳冲克',
      cautionNotice,
    };
  }

  /**
   * Derives Mother Code & Variation Codes from ranked candidate digits
   */
  public generateMotherAndVariations(rankedDigits: number[], codeLength: number = 4): MotherVariationResult {
    // Select top candidates
    const primaryDigits = rankedDigits.slice(0, codeLength);
    if (primaryDigits.length < codeLength) {
      // pad deterministically if needed
      while (primaryDigits.length < codeLength) {
        const next = (primaryDigits[primaryDigits.length - 1] + 3) % 10;
        primaryDigits.push(next);
      }
    }

    const motherCode = primaryDigits.join('');

    // Generate structurally controlled variations
    const variations: Set<string> = new Set();

    // 1. Inversion permutation: Reverse middle pair
    if (codeLength >= 4) {
      const v1 = [primaryDigits[0], primaryDigits[2], primaryDigits[1], primaryDigits[3]].join('');
      if (v1 !== motherCode) variations.add(v1);
    }

    // 2. He Tu complement shift on last digit
    const lastPartner = getHeTuPartner(primaryDigits[primaryDigits.length - 1]);
    const v2Digits = [...primaryDigits];
    v2Digits[v2Digits.length - 1] = lastPartner;
    const v2 = v2Digits.join('');
    if (v2 !== motherCode) variations.add(v2);

    // 3. Head-Tail swap
    const v3Digits = [...primaryDigits];
    const temp = v3Digits[0];
    v3Digits[0] = v3Digits[v3Digits.length - 1];
    v3Digits[v3Digits.length - 1] = temp;
    const v3 = v3Digits.join('');
    if (v3 !== motherCode) variations.add(v3);

    // 4. Cyclic rotation
    const v4 = [...primaryDigits.slice(1), primaryDigits[0]].join('');
    if (v4 !== motherCode) variations.add(v4);

    return {
      motherCode,
      variations: Array.from(variations).slice(0, 4),
      derivationMethod: '河图互换 · 阴阳对冲 · 空间旋移 (受控变号算法)',
    };
  }
}

export const globalFusionEngine = new FusionScoringEngine();
