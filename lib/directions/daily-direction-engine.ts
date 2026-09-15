// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Daily Direction Engine
// File: lib/directions/daily-direction-engine.ts
// ==========================================================

import type {
  CalculationTraceStep,
  DailyDirectionBreakdown,
  DailyDirectionResult,
  DailyDirectionSectorScore,
  DailyNumberActivation,
  DailyPalaceActivation,
  DailyTimeSignature,
  DirectionCode,
  PersonalDirectionProfile,
  WuXingElement,
} from '../../types/zwtsp.ts';
import {
  ALL_DIRECTION_CODES,
  DIRECTION_SECTORS,
  evaluateElementAffinityScore,
  getDirectionTier,
} from './direction-models.ts';
import { SpatialNumberMatrix } from './spatial-number-matrix.ts';

// Earthly branch mapping to hour names
const BRANCH_HOURS: Record<string, string> = {
  子: '23:00-01:00 (子时)',
  丑: '01:00-03:00 (丑时)',
  寅: '03:00-05:00 (寅时)',
  卯: '05:00-07:00 (卯时)',
  辰: '07:00-09:00 (辰时)',
  巳: '09:00-11:00 (巳时)',
  午: '11:00-13:00 (午时)',
  未: '13:00-15:00 (未时)',
  申: '15:00-17:00 (申时)',
  酉: '17:00-19:00 (酉时)',
  戌: '19:00-21:00 (戌时)',
  亥: '21:00-23:00 (亥时)',
};

export class DailyDirectionEngine {
  public static readonly VERSION = 'DIR-DAILY-V1.0';

  /**
   * Calculates Daily Direction Score and Compatibility for a user on a given date
   */
  public static calculateDailyDirections(
    dateStr: string,
    personalProfile: PersonalDirectionProfile,
    dailySignature: DailyTimeSignature,
    dailyActivatedDigits: DailyNumberActivation[],
    dailyPalaces?: DailyPalaceActivation[]
  ): DailyDirectionResult {
    const traceSteps: CalculationTraceStep[] = [];
    const spatialMatrix = SpatialNumberMatrix.buildMatrix(dailyActivatedDigits);
    const sectorScores: Partial<Record<DirectionCode, DailyDirectionSectorScore>> = {};

    const dailyElement = dailySignature.dominantElement || 'Fire';

    for (const code of ALL_DIRECTION_CODES) {
      const sector = DIRECTION_SECTORS[code];
      const personalScoreObj = personalProfile.directionScores[code];
      const personalCompat = personalScoreObj ? personalScoreObj.score : 60;

      // 1. Personal Compatibility (35%)
      const personalPart = personalCompat;

      // 2. Daily Element Interaction (20%)
      const elementInteraction = evaluateElementAffinityScore(dailyElement, sector.element);

      // 3. Daily Activated Digits Resonance (15%)
      const topDigits = SpatialNumberMatrix.getTopDigitsForDirection(spatialMatrix, code, 3);
      let digitResonanceSum = 0;
      for (const d of topDigits) {
        const act = dailyActivatedDigits.find((a) => a.digit === d);
        digitResonanceSum += act ? act.activationScore : 50;
      }
      const activatedDigitsScore = Number((digitResonanceSum / Math.max(1, topDigits.length)).toFixed(1));

      // 4. Daily Palace Resonance (15%)
      // If daily palaces are present, look for auspicious palace names (命宫, 财帛, 官禄)
      let palaceResonance = 68;
      if (dailyPalaces && dailyPalaces.length > 0) {
        const auspicious = dailyPalaces.filter(
          (p) => ['命宫', '财帛宫', '官禄宫', '福德宫'].includes(p.palaceName) && p.activationScore >= 70
        );
        if (auspicious.length > 0) {
          palaceResonance = 85;
        }
      }

      // 5. Time Windows Synergy (10%)
      // Check if primaryWindow or secondaryWindow branches match this sector's branches
      let timeWindowScore = 65;
      const combinedWindows = `${dailySignature.primaryWindow} ${dailySignature.secondaryWindow}`;
      const branchMatch = sector.earthlyBranches.some((b) => combinedWindows.includes(b));
      if (branchMatch) {
        timeWindowScore = 92;
      }

      // 6. Star Transformations (5%)
      const starTransScore = 75; // Baseline positive celestial harmony

      // Final Dynamic Weighted Score
      const finalScore = Number(
        (
          personalPart * 0.35 +
          elementInteraction * 0.20 +
          activatedDigitsScore * 0.15 +
          palaceResonance * 0.15 +
          timeWindowScore * 0.10 +
          starTransScore * 0.05
        ).toFixed(2)
      );

      const auspiciousHours = sector.earthlyBranches.map((b) => BRANCH_HOURS[b] || `${b}时`);

      const breakdown: DailyDirectionBreakdown = {
        personalCompatibility: Number(personalPart.toFixed(1)),
        elementInteraction: Number(elementInteraction.toFixed(1)),
        activatedDigitsScore,
        palaceResonance,
        timeWindowScore,
        starTransScore,
      };

      sectorScores[code] = {
        direction: code,
        score: finalScore,
        rank: 1, // calculated below
        tier: getDirectionTier(finalScore),
        breakdown,
        resonantDigits: topDigits,
        auspiciousHours,
        description: `${sector.nameZh}（${sector.baguaName}卦·${sector.element}）：与今日${dailyElement}气场生克指数 ${elementInteraction} 分，个人气场匹配 ${personalPart.toFixed(1)} 分。`,
      };
    }

    // Rank 8 sectors
    const sorted = Object.values(sectorScores).sort((a, b) => b!.score - a!.score);
    sorted.forEach((item, index) => {
      item!.rank = index + 1;
    });

    const topDirection = sorted[0]!.direction;
    const secondaryDirection = sorted[1]!.direction;
    const leastDirection = sorted[sorted.length - 1]!.direction;

    // Check Contested Condition (difference between #1 and #2 <= 2.0)
    const diff = sorted[0]!.score - sorted[1]!.score;
    const isContested = diff <= 2.0;
    const contestedReason = isContested
      ? `今日首选方位【${DIRECTION_SECTORS[topDirection].nameZh}】与次选方位【${DIRECTION_SECTORS[secondaryDirection].nameZh}】气场分差仅 ${diff.toFixed(1)} 分（≤2.0），呈现双向并峙态势，建议结合个人实际出行路径及吉时窗口择定。`
      : undefined;

    // Compute Confidence & Consistency
    const spread = sorted[0]!.score - sorted[sorted.length - 1]!.score;
    const confidenceScore = Number(Math.min(96, Math.max(65, 75 + spread * 0.8)).toFixed(1));

    // Consistency: how well daily top directions align with personal best
    const personalRankOfTop = personalProfile.directionScores[topDirection]?.rank || 4;
    const consistencyScore = Number(Math.max(60, 95 - (personalRankOfTop - 1) * 8).toFixed(1));

    traceSteps.push({
      factor: '今日时空方位综合定序',
      points: sorted[0]!.score,
      description: isContested
        ? `注意：今日信号接近（首选与次选分差 ${diff.toFixed(2)} ≤ 2.0），${contestedReason}`
        : `首选方位优势明确（分差 ${diff.toFixed(2)}），推荐【${DIRECTION_SECTORS[topDirection].nameZh}】。`,
    });

    return {
      date: dateStr,
      topDirection,
      secondaryDirection,
      leastDirection,
      isContested,
      contestedReason,
      confidenceScore,
      consistencyScore,
      directionScores: sectorScores as Record<DirectionCode, DailyDirectionSectorScore>,
      spatialNumberMatrix: spatialMatrix,
      calculationTrace: traceSteps,
    };
  }
}
