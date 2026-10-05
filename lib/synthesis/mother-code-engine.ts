// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Mother Code Engine
// File: lib/synthesis/mother-code-engine.ts
// ==========================================================

import type {
  DigitFeatureVector,
  FourPillarsData,
  MotherCodeResult,
  PredictionCandidate,
} from '../../types/zwtsp.ts';

export class MotherCodeEngine {
  /**
   * Derives two harmonic extension digits for Six-Mark / 6D lottery
   * (e.g. Toto 6D, Damacai 3+3D, Magnum 6D) based on secondary energy resonance
   * and I Ching 6-yao completion (六爻成卦：初至四爻为4D本体，五爻天位与上爻宗庙为拓展双宿)
   */
  public static deriveSixMarkPair(
    topNumber: string,
    vectors?: DigitFeatureVector[],
    fourPillars?: FourPillarsData
  ): { pair: [number, number]; explanation: string } {
    const existingDigits = new Set(topNumber.split('').map(Number));

    // Case 1: Vectors available (Ranked feature vectors 0-9)
    if (vectors && vectors.length >= 6) {
      // Find candidate digits from vectors sorted by overallDigitScore descending
      const sortedVectors = [...vectors].sort((a, b) => b.overallDigitScore - a.overallDigitScore);

      // Filter for digits not already in topNumber to ensure fresh complementary resonance
      const unusedDigits = sortedVectors.filter(v => !existingDigits.has(v.digit));

      let d5: number;
      let d6: number;
      let reasonDetail = '';

      if (unusedDigits.length >= 2) {
        d5 = unusedDigits[0].digit;
        d6 = unusedDigits[1].digit;
        reasonDetail = `命理综合气场次席双宿【${d5}】(得分${unusedDigits[0].overallDigitScore.toFixed(1)}) 与【${d6}】(得分${unusedDigits[1].overallDigitScore.toFixed(1)})`;
      } else if (unusedDigits.length === 1) {
        d5 = unusedDigits[0].digit;
        const nextBest = sortedVectors.find(v => v.digit !== d5);
        d6 = nextBest ? nextBest.digit : (d5 + 5) % 10;
        reasonDetail = `天机变卦吉数【${d5}】与共振强星【${d6}】`;
      } else {
        d5 = sortedVectors[4].digit;
        d6 = sortedVectors[5].digit;
        reasonDetail = `五行气场序列第5、第6能量位【${d5}, ${d6}】`;
      }

      const explanation = `六合彩/6D拓展码：前四位【${topNumber}】承接本命与今日时空四象，后两位【${d5}${d6}】采纳${reasonDetail}，上二爻圆满定格天地变卦。`;
      return { pair: [d5, d6], explanation };
    }

    // Case 2: Deterministic He Tu & I Ching derivation when vectors not passed
    const sum = topNumber.split('').map(Number).reduce((a, b) => a + b, 0);
    const root = ((sum - 1) % 9) + 1; // 1..9

    // He Tu & Wu Xing generating pairing:
    // Root 1 (Water) -> [6, 4] (Partner Water 6, Metal Mother 4)
    // Root 2 (Fire)  -> [7, 3] (Partner Fire 7, Wood Mother 3)
    // Root 3 (Wood)  -> [8, 1] (Partner Wood 8, Water Mother 1)
    // Root 4 (Metal) -> [9, 5] (Partner Metal 9, Earth Mother 5)
    // Root 5 (Earth) -> [0, 2] (Partner Earth 0, Fire Mother 2)
    // Root 6 (Water) -> [1, 9] (Partner Water 1, Metal Mother 9)
    // Root 7 (Fire)  -> [2, 8] (Partner Fire 2, Wood Mother 8)
    // Root 8 (Wood)  -> [3, 6] (Partner Wood 3, Water Mother 6)
    // Root 9 (Metal) -> [4, 0] (Partner Metal 4, Earth Mother 0)
    const heTuMap: Record<number, [number, number]> = {
      1: [6, 4],
      2: [7, 3],
      3: [8, 1],
      4: [9, 5],
      5: [0, 2],
      6: [1, 9],
      7: [2, 8],
      8: [3, 6],
      9: [4, 0],
    };

    const pair = heTuMap[root] || [8, 1];
    const explanation = `六合彩/6D拓展码：前四位【${topNumber}】为核心母数，后两位【${pair[0]}${pair[1]}】取河图生旺相生数理（数根为${root}），上引天干相合，下纳地支六合。`;
    return { pair, explanation };
  }

  /**
   * Deterministically identifies the primary Mother Code from ranked candidates,
   * synthesizing both 4D Core Mother Code and 6D / Six-Mark Extended Code.
   */
  public static extractMotherCode(
    candidates: PredictionCandidate[],
    vectors?: DigitFeatureVector[],
    fourPillars?: FourPillarsData
  ): MotherCodeResult {
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
        sixMarkCode: '000088',
        sixMarkPair: [8, 8],
        sixMarkFormatted: '0000 · 88',
        sixMarkExplanation: '当前无有效候选序列，暂以乾卦吉数拓展。',
      };
    }

    const top1 = candidates[0];
    const resonantDigits = Array.from(new Set(top1.number.split('').map(Number)));

    const canonDesc = top1.breakdown.bodyUseRelation ? `，易理体用【${top1.breakdown.bodyUseRelation}】` : '';
    const summary = `本期母码【${top1.number}】：单字均分 ${top1.breakdown.digitStrength}，数字和 ${top1.breakdown.sum} (数字根 ${top1.breakdown.digitalRoot})${canonDesc}，综合模型得分 ${top1.score} 分。`;

    const { pair: sixMarkPair, explanation: sixMarkExplanation } = this.deriveSixMarkPair(
      top1.number,
      vectors,
      fourPillars
    );
    const sixMarkCode = `${top1.number}${sixMarkPair[0]}${sixMarkPair[1]}`;
    const sixMarkFormatted = `${top1.number} · ${sixMarkPair[0]}${sixMarkPair[1]}`;

    return {
      motherCode: top1.number,
      score: top1.score,
      rank: 1,
      breakdown: top1.breakdown,
      confidence: top1.confidence,
      resonantDigits,
      summary,
      sixMarkCode,
      sixMarkPair,
      sixMarkFormatted,
      sixMarkExplanation,
    };
  }
}

