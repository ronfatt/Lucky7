// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Model Performance Engine
// File: lib/backtest/model-performance-engine.ts
// ==========================================================

import type {
  BacktestDrawEvaluation,
  DrawResultRecord,
  MalaysianPrizeTier,
} from '../../types/zwtsp.ts';

export class ModelPerformanceEngine {
  /**
   * Evaluates a single historical draw against model predictions (supports generic & Malaysian 23-prize)
   */
  public static evaluateDraw(
    drawId: string,
    drawDate: string,
    actualNumber: string,
    motherCode: string,
    candidates: string[],
    drawRecord?: DrawResultRecord
  ): BacktestDrawEvaluation {
    const actualDigits = actualNumber.split('').map(Number);
    const sortedActualStr = [...actualDigits].sort((a, b) => a - b).join('');

    let exactMatch = false;
    let maxPositionMatches = 0;
    let digitSetMatch = false;
    let maxPartialHits = 0;
    let rankOfActual: number | undefined;

    candidates.forEach((cand, idx) => {
      const candDigits = cand.split('').map(Number);

      // 1. Exact Match with 1st Prize
      if (cand === actualNumber) {
        exactMatch = true;
        if (rankOfActual === undefined) {
          rankOfActual = idx + 1;
        }
      }

      // 2. Position Matches
      let posCount = 0;
      for (let i = 0; i < Math.min(candDigits.length, actualDigits.length); i++) {
        if (candDigits[i] === actualDigits[i]) {
          posCount++;
        }
      }
      if (posCount > maxPositionMatches) {
        maxPositionMatches = posCount;
      }

      // 3. Digit Set Match (Unordered)
      const sortedCandStr = [...candDigits].sort((a, b) => a - b).join('');
      if (sortedCandStr === sortedActualStr) {
        digitSetMatch = true;
      }

      // 4. Partial Unique Digit Hits
      const actualSet = new Set(actualDigits);
      let hits = 0;
      for (const d of new Set(candDigits)) {
        if (actualSet.has(d)) hits++;
      }
      if (hits > maxPartialHits) {
        maxPartialHits = hits;
      }
    });

    // 5. Malaysian 23-number prize tier verification
    let top3Hit = false;
    let all23Hit = false;
    let winningTier: MalaysianPrizeTier | undefined;

    if (drawRecord) {
      const candSet = new Set(candidates.slice(0, 20));

      if (candSet.has(actualNumber) || (drawRecord.firstPrize && candSet.has(drawRecord.firstPrize))) {
        top3Hit = true;
        all23Hit = true;
        winningTier = 'FIRST';
      } else if (drawRecord.secondPrize && candSet.has(drawRecord.secondPrize)) {
        top3Hit = true;
        all23Hit = true;
        winningTier = 'SECOND';
      } else if (drawRecord.thirdPrize && candSet.has(drawRecord.thirdPrize)) {
        top3Hit = true;
        all23Hit = true;
        winningTier = 'THIRD';
      } else if (drawRecord.specialPrizes?.some((sp) => candSet.has(sp))) {
        all23Hit = true;
        winningTier = 'SPECIAL';
      } else if (drawRecord.consolationPrizes?.some((cp) => candSet.has(cp))) {
        all23Hit = true;
        winningTier = 'CONSOLATION';
      } else if (drawRecord.allWinningNumbers?.some((wn) => candSet.has(wn))) {
        all23Hit = true;
      }
    }

    return {
      drawId,
      drawDate,
      operator: drawRecord?.operator,
      drawNo: drawRecord?.drawNo,
      actualNumber,
      motherCode,
      topCandidates: candidates.slice(0, 20),
      exactMatch,
      positionMatches: maxPositionMatches,
      digitSetMatch,
      partialDigitHits: maxPartialHits,
      rankOfActual,
      top3Hit,
      winningTier,
      all23Hit,
    };
  }
}

