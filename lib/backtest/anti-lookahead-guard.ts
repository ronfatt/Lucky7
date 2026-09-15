// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Anti-Lookahead Bias Guard
// File: lib/backtest/anti-lookahead-guard.ts
// ==========================================================

import type { RealitySignalRecord } from '../../types/zwtsp.ts';

export class AntiLookaheadGuard {
  /**
   * Filters out any reality signals or observations that occurred AFTER the historical draw timestamp
   */
  public static filterSignalsBeforeDraw(
    signals: RealitySignalRecord[],
    drawDateStr: string,
    drawTimeStr: string = '19:00:00',
    timezone: string = 'Asia/Shanghai'
  ): RealitySignalRecord[] {
    const drawDeadline = new Date(`${drawDateStr}T${drawTimeStr}`).getTime();

    return signals.filter((s) => {
      // Determine the calendar date of observation (from createdAt or fallback to drawDateStr)
      const obsDate = s.createdAt ? s.createdAt.slice(0, 10) : drawDateStr;
      const sigTime = s.observationTime
        ? new Date(`${obsDate}T${s.observationTime}`).getTime()
        : new Date(s.createdAt).getTime();

      // Signal must have occurred strictly BEFORE the draw deadline
      return sigTime <= drawDeadline;
    });
  }

  /**
   * Asserts that prediction timestamp is strictly prior to draw timestamp
   */
  public static assertZeroLeakage(predictionTime: string, drawTime: string): boolean {
    const predTs = new Date(predictionTime).getTime();
    const drawTs = new Date(drawTime).getTime();
    if (predTs > drawTs) {
      throw new Error(
        `CRITICAL ANTI-LOOKAHEAD BIAS VIOLATION: Prediction time (${predictionTime}) is after Draw time (${drawTime})!`
      );
    }
    return true;
  }
}
