// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Digit Feature Vector Engine
// File: lib/synthesis/digit-feature-vector-engine.ts
// ==========================================================

import type {
  DailyDirectionResult,
  DailyNumberActivation,
  DigitFeatureVector,
  PersonalNumberDNA,
  RealitySignalRecord,
  WuXingElement,
} from '../../types/zwtsp.ts';
import { getDigitElement, evaluateElementRelationship } from '../numerology/digit-foundation.ts';
import { RealitySignalStore } from '../signals/reality-signal-store.ts';

export class DigitFeatureVectorEngine {
  /**
   * Generates 0-9 composite feature vectors with dynamic missing-feature re-normalization
   */
  public static computeVectors(
    personalDNA: PersonalNumberDNA,
    dailyActivatedDigits: DailyNumberActivation[],
    dailyDirection?: DailyDirectionResult,
    realitySignals: RealitySignalRecord[] = [],
    dailyElement: WuXingElement = 'Fire'
  ): DigitFeatureVector[] {
    const vectors: DigitFeatureVector[] = [];

    // Frequency analysis from reality signals
    const frequencies = RealitySignalStore.getDigitFrequencies(realitySignals);
    const maxFreq = Math.max(1, ...Object.values(frequencies));

    // Check if Reality Signals are available
    const hasReality = realitySignals.length > 0;

    // Dynamic V2 weights:
    // DNA: 0.15, Daily: 0.30, Reality: 0.20, Direction: 0.15, Freq: 0.10, Pattern: 0.10, Element: 0.20
    const rawWeights: Record<string, number> = {
      dna: 0.15,
      daily: 0.30,
      reality: hasReality ? 0.20 : 0.0,
      direction: 0.15,
      frequency: 0.10,
      pattern: 0.10,
      element: 0.20,
    };

    // Re-normalize available weights so they sum to 1.0
    const availableWeightSum = Object.values(rawWeights).reduce((a, b) => a + b, 0);
    const effectiveWeights: Record<string, number> = {};
    for (const [k, w] of Object.entries(rawWeights)) {
      effectiveWeights[k] = Number((w / availableWeightSum).toFixed(4));
    }

    const availableFeatures = Object.keys(rawWeights).filter((k) => rawWeights[k] > 0);

    for (let d = 0; d <= 9; d++) {
      // 1. Personal DNA
      const personalDnaScore = personalDNA.scoresByDigit ? (personalDNA.scoresByDigit[d] ?? 60) : 60;

      // 2. Daily Activation
      const dailyObj = dailyActivatedDigits.find((a) => a.digit === d);
      const dailyActivationScore = dailyObj ? dailyObj.activationScore : 55;

      // 3. Reality Resonance
      let realityResonanceScore: number | 'NOT_AVAILABLE' = 'NOT_AVAILABLE';
      if (hasReality) {
        // Average resonance score of signals containing this digit
        const containing = realitySignals.filter((s) => s.normalizedDigits.includes(d));
        if (containing.length > 0) {
          const sum = containing.reduce((acc, s) => acc + s.resonanceScore, 0);
          realityResonanceScore = Number((sum / containing.length).toFixed(1));
        } else {
          realityResonanceScore = 40.0; // Digit not observed today
        }
      }

      // 4. Direction Score (from Top Direction's Spatial Matrix)
      let directionScore = 60.0;
      if (dailyDirection && dailyDirection.spatialNumberMatrix) {
        const topDir = dailyDirection.topDirection;
        directionScore = dailyDirection.spatialNumberMatrix[topDir]?.[d] ?? 60.0;
      }

      // 5. Frequency Score (scaled 30 - 95)
      const freqCount = frequencies[d] || 0;
      const frequencyScore = Number((40 + (freqCount / maxFreq) * 55).toFixed(1));

      // 6. Pattern Score (Core digits & Daily time-space pairings)
      let patternScore = 65.0;
      if (personalDNA.coreNumbers?.includes(d)) patternScore += 8.0;
      const topActivatedDigits = dailyActivatedDigits.slice(0, 4).map((a) => a.digit);
      if (topActivatedDigits.includes(d)) patternScore += 12.0; // Daily dynamic resonance
      if (d === 7 || d === 8) patternScore += 6.0; // Traditional auspicious structural resonance
      patternScore = Math.min(98.0, patternScore);

      // 7. Element Score (Enhanced with He Tu classical generating pairs: 1-6水, 2-7火, 3-8木, 4-9金, 5-0土)
      const digitEl = getDigitElement(d);
      const rel = evaluateElementRelationship(digitEl, dailyElement);
      let elementScore = rel.score;

      // 河图五行生成配对共振 (刘金府《象数心学紫微斗数》/ 蔡明宏《楚皇理论》)
      const heTuCompanion = (d + 5) % 10;
      const topActivated = dailyActivatedDigits.slice(0, 4).map((a) => a.digit);
      if (personalDNA.coreNumbers?.includes(heTuCompanion)) {
        elementScore = Math.min(99.0, elementScore + 5.0); // 先天河图共宗生成加权
      }
      if (topActivated.includes(heTuCompanion)) {
        elementScore = Math.min(99.0, elementScore + 4.0); // 流日时空天干生成协同
      }

      // Overall Composite Score
      let overall =
        personalDnaScore * effectiveWeights.dna +
        dailyActivationScore * effectiveWeights.daily +
        directionScore * effectiveWeights.direction +
        frequencyScore * effectiveWeights.frequency +
        patternScore * effectiveWeights.pattern +
        elementScore * effectiveWeights.element;

      if (hasReality && typeof realityResonanceScore === 'number') {
        overall += realityResonanceScore * effectiveWeights.reality;
      }

      const overallDigitScore = Number(overall.toFixed(1));

      vectors.push({
        digit: d,
        personalDnaScore,
        dailyActivationScore,
        realityResonanceScore,
        directionScore,
        frequencyScore,
        patternScore,
        elementScore,
        overallDigitScore,
        rank: 1, // Updated below
        availableFeatures,
        effectiveWeights,
      });
    }

    // Rank 0-9 descending
    vectors.sort((a, b) => b.overallDigitScore - a.overallDigitScore);
    vectors.forEach((v, idx) => {
      v.rank = idx + 1;
    });

    return vectors;
  }
}
