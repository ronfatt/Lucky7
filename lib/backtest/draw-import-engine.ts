// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Draw Import Engine
// File: lib/backtest/draw-import-engine.ts
// ==========================================================

import type {
  DrawResultRecord,
  Malaysian4DDrawRecord,
  MalaysianOperator,
} from '../../types/zwtsp.ts';

export interface RawDrawInput {
  gameProfileId?: string;
  operator?: MalaysianOperator;
  drawNo?: string;
  drawDate: string;
  drawTime?: string;
  resultNumber?: string;
  firstPrize?: string;
  secondPrize?: string;
  thirdPrize?: string;
  specialPrizes?: string[];
  consolationPrizes?: string[];
  source?: string;
}

export class DrawImportEngine {
  /**
   * Validates and imports a batch of raw historical lottery draws (Generic or Malaysian 23-Prize)
   */
  public static importDraws(
    rawItems: RawDrawInput[],
    gameProfileId: string = 'GAME_4D'
  ): DrawResultRecord[] {
    const validDraws: DrawResultRecord[] = [];
    const seenKeys = new Set<string>();

    for (const raw of rawItems) {
      const dateStr = raw.drawDate?.trim();
      if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        continue;
      }

      // First prize or fallback to resultNumber
      const primaryNum = (raw.firstPrize || raw.resultNumber || '').trim();
      if (!primaryNum || !/^\d{4}$/.test(primaryNum)) {
        continue;
      }

      const op = raw.operator || 'MAGNUM';
      const key = `${op}-${dateStr}-${primaryNum}`;
      if (seenKeys.has(key)) {
        continue;
      }
      seenKeys.add(key);

      const digits = primaryNum.split('').map(Number);
      const firstPrize = primaryNum;
      const secondPrize = (raw.secondPrize || '').trim();
      const thirdPrize = (raw.thirdPrize || '').trim();
      const specialPrizes = (raw.specialPrizes || []).map((s) => s.trim()).filter((s) => /^\d{4}$/.test(s));
      const consolationPrizes = (raw.consolationPrizes || []).map((s) => s.trim()).filter((s) => /^\d{4}$/.test(s));

      const allWinning: string[] = [firstPrize];
      if (/^\d{4}$/.test(secondPrize)) allWinning.push(secondPrize);
      if (/^\d{4}$/.test(thirdPrize)) allWinning.push(thirdPrize);
      allWinning.push(...specialPrizes);
      allWinning.push(...consolationPrizes);

      validDraws.push({
        id: `draw-${op.toLowerCase()}-${dateStr}-${primaryNum}`,
        gameProfileId: raw.gameProfileId || `${op}_4D`,
        operator: op,
        drawNo: raw.drawNo || `${dateStr.replace(/-/g, '')}`,
        drawDate: dateStr,
        drawTime: raw.drawTime || '19:00:00',
        timezone: 'Asia/Kuala_Lumpur',
        resultNumber: primaryNum,
        digits,
        firstPrize,
        secondPrize: secondPrize || undefined,
        thirdPrize: thirdPrize || undefined,
        specialPrizes: specialPrizes.length > 0 ? specialPrizes : undefined,
        consolationPrizes: consolationPrizes.length > 0 ? consolationPrizes : undefined,
        allWinningNumbers: allWinning,
        source: raw.source || 'Historical Verified Record',
        verified: true,
        createdAt: new Date().toISOString(),
      });
    }

    // Sort chronologically ascending
    validDraws.sort((a, b) => a.drawDate.localeCompare(b.drawDate));
    return validDraws;
  }
}

