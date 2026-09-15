// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Model Consistency Engine
// File: lib/synthesis/model-consistency-engine.ts
// ==========================================================

import type {
  DailyDirectionResult,
  DailyNumberActivation,
  DigitFeatureVector,
  PersonalNumberDNA,
  RealitySignalRecord,
} from '../../types/zwtsp.ts';

export class ModelConsistencyEngine {
  /**
   * Evaluates consensus and conflict across separate model layers.
   * Model Consistency is STRICTLY SEPARATE from the Model Score.
   */
  public static evaluateConsistency(
    vectors: DigitFeatureVector[],
    personalDNA: PersonalNumberDNA,
    dailyActivatedDigits: DailyNumberActivation[],
    dailyDirection?: DailyDirectionResult,
    realitySignals: RealitySignalRecord[] = []
  ): 'LOW' | 'NORMAL' | 'HIGH' {
    let consensusPoints = 0;
    const top3Vectors = vectors.slice(0, 3).map((v) => v.digit);
    const coreDna = personalDNA.coreNumbers || [];
    const topDaily = dailyActivatedDigits.slice(0, 3).map((a) => a.digit);

    // 1. Cross-layer agreement between DNA and Daily Activation
    const dnaDailyOverlap = top3Vectors.filter((d) => coreDna.includes(d) && topDaily.includes(d));
    if (dnaDailyOverlap.length >= 2) consensusPoints += 2;
    else if (dnaDailyOverlap.length === 1) consensusPoints += 1;

    // 2. Spatial Direction agreement
    if (dailyDirection?.spatialNumberMatrix) {
      const dirDigits = dailyDirection.directionScores[dailyDirection.topDirection]?.resonantDigits || [];
      const dirOverlap = top3Vectors.filter((d) => dirDigits.includes(d));
      if (dirOverlap.length >= 2) consensusPoints += 2;
      else if (dirOverlap.length === 1) consensusPoints += 1;
    }

    // 3. Reality Signal agreement
    if (realitySignals.length > 0) {
      const observedDigits = new Set<number>();
      for (const s of realitySignals) {
        for (const d of s.normalizedDigits) observedDigits.add(d);
      }
      const realityOverlap = top3Vectors.filter((d) => observedDigits.has(d));
      if (realityOverlap.length >= 2) consensusPoints += 2;
      else if (realityOverlap.length === 1) consensusPoints += 1;
    }

    if (consensusPoints >= 4) return 'HIGH';
    if (consensusPoints >= 2) return 'NORMAL';
    return 'LOW';
  }
}
