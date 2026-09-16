// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Cross-Platform Lottery Hit Engine
// File: lib/lottery/lottery-hit-engine.ts
// Automatically cross-references member mother codes & variations against Malaysian & Singapore draws
// ==========================================================

import { MalaysiaLotteryProvider, MALAYSIAN_OPERATORS } from './malaysia-provider';
import type { Malaysian4DDrawRecord, MalaysianOperator, MalaysianPrizeTier } from '@/types/zwtsp';

export interface LotteryHitItem {
  operator: MalaysianOperator;
  operatorNameZh: string;
  badgeColor: string;
  tier: MalaysianPrizeTier;
  tierZh: string;
  drawNo: string;
  winningNumber: string;
  matchedNumber: string;
  hitSource: 'MOTHER_CODE' | 'VARIATION';
  hitSourceZh: string;
  variationIndex?: number;
  isDirect: boolean;
  matchTypeZh: string;
}

export interface DailyDrawHitReport {
  date: string;
  hasHit: boolean;
  totalHits: number;
  directHits: number;
  variationHits: number;
  highestTier: MalaysianPrizeTier | 'NONE';
  highestTierZh: string;
  highestOperator: MalaysianOperator | 'NONE';
  highestOperatorZh: string;
  hitSummary: string;
  celebrationTitle: string;
  hits: LotteryHitItem[];
  drawsAvailable: boolean;
  drawRecords: Malaysian4DDrawRecord[];
}

const TIER_PRIORITY: Record<MalaysianPrizeTier, number> = {
  FIRST: 5,
  SECOND: 4,
  THIRD: 3,
  SPECIAL: 2,
  CONSOLATION: 1,
};

const TIER_ZH_MAP: Record<MalaysianPrizeTier, string> = {
  FIRST: '头奖 (1st Prize)',
  SECOND: '二奖 (2nd Prize)',
  THIRD: '三奖 (3rd Prize)',
  SPECIAL: '特别奖 (Special)',
  CONSOLATION: '安慰奖 (Consolation)',
};

export class LotteryHitEngine {
  /**
   * Check whether a member's mother code and variations hit any lottery on a given date
   */
  public static checkHitsForDate(
    dateStr: string,
    motherCode: string,
    variations: string[] = []
  ): DailyDrawHitReport {
    const draws = MalaysiaLotteryProvider.getDrawsByDate(dateStr);
    const cleanMother = (motherCode || '').trim();
    const hits: LotteryHitItem[] = [];

    const opMap = new Map<string, { nameZh: string; badgeColor: string }>();
    for (const op of MALAYSIAN_OPERATORS) {
      opMap.set(op.id, { nameZh: op.nameZh, badgeColor: op.badgeColor });
    }

    if (draws.length > 0) {
      for (const draw of draws) {
        const opMeta = opMap.get(draw.operator) || {
          nameZh: draw.operator,
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        };

        const checkPrizeHit = (
          winningNum: string | undefined,
          tier: MalaysianPrizeTier
        ) => {
          if (!winningNum) return;
          const cleanWinning = winningNum.trim();
          const sortedWinning = cleanWinning.split('').sort().join('');

          // 1. Check Mother Code
          if (cleanMother && cleanMother.length === 4) {
            const isDirect = cleanWinning === cleanMother;
            const isPerm = !isDirect && cleanMother.split('').sort().join('') === sortedWinning;

            if (isDirect || isPerm) {
              hits.push({
                operator: draw.operator,
                operatorNameZh: opMeta.nameZh,
                badgeColor: opMeta.badgeColor,
                tier,
                tierZh: TIER_ZH_MAP[tier] || tier,
                drawNo: draw.drawNo,
                winningNumber: cleanWinning,
                matchedNumber: cleanMother,
                hitSource: 'MOTHER_CODE',
                hitSourceZh: '核心推演母码',
                isDirect,
                matchTypeZh: isDirect ? '正字直落' : '组选全保',
              });
            }
          }

          // 2. Check 12 Variations
          if (variations && variations.length > 0) {
            variations.forEach((v, idx) => {
              const cleanV = (v || '').trim();
              if (cleanV.length === 4 && cleanV !== cleanMother) {
                const isDirectV = cleanWinning === cleanV;
                const isPermV = !isDirectV && cleanV.split('').sort().join('') === sortedWinning;

                if (isDirectV || isPermV) {
                  hits.push({
                    operator: draw.operator,
                    operatorNameZh: opMeta.nameZh,
                    badgeColor: opMeta.badgeColor,
                    tier,
                    tierZh: TIER_ZH_MAP[tier] || tier,
                    drawNo: draw.drawNo,
                    winningNumber: cleanWinning,
                    matchedNumber: cleanV,
                    hitSource: 'VARIATION',
                    hitSourceZh: `第 ${idx + 1} 组同频变体`,
                    variationIndex: idx + 1,
                    isDirect: isDirectV,
                    matchTypeZh: isDirectV ? '正字直落' : '组选全保',
                  });
                }
              }
            });
          }
        };

        // Check 1st, 2nd, 3rd
        checkPrizeHit(draw.firstPrize, 'FIRST');
        checkPrizeHit(draw.secondPrize, 'SECOND');
        checkPrizeHit(draw.thirdPrize, 'THIRD');

        // Check Specials
        for (const sp of draw.specialPrizes || []) {
          checkPrizeHit(sp, 'SPECIAL');
        }

        // Check Consolations
        for (const cp of draw.consolationPrizes || []) {
          checkPrizeHit(cp, 'CONSOLATION');
        }
      }
    }

    // Deduplicate hits (same operator, tier, winningNumber, hitSource)
    const uniqueHits: LotteryHitItem[] = [];
    const seenKeys = new Set<string>();
    for (const h of hits) {
      const key = `${h.operator}-${h.tier}-${h.winningNumber}-${h.matchedNumber}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueHits.push(h);
      }
    }

    // Sort hits: direct hits first, highest tier first
    uniqueHits.sort((a, b) => {
      if (a.isDirect && !b.isDirect) return -1;
      if (!a.isDirect && b.isDirect) return 1;
      return (TIER_PRIORITY[b.tier] || 0) - (TIER_PRIORITY[a.tier] || 0);
    });

    const hasHit = uniqueHits.length > 0;
    const directHits = uniqueHits.filter((h) => h.isDirect).length;
    const variationHits = uniqueHits.filter((h) => h.hitSource === 'VARIATION').length;

    let highestTier: MalaysianPrizeTier | 'NONE' = 'NONE';
    let highestTierZh = '尚未命中';
    let highestOperator: MalaysianOperator | 'NONE' = 'NONE';
    let highestOperatorZh = '';
    let hitSummary = '今日开彩未命中';
    let celebrationTitle = '';

    if (hasHit) {
      const top = uniqueHits[0];
      highestTier = top.tier;
      highestTierZh = top.tierZh;
      highestOperator = top.operator;
      highestOperatorZh = top.operatorNameZh;
      hitSummary = `【${top.operatorNameZh}】${top.matchTypeZh} ${top.tierZh.split(' ')[0]} [${top.winningNumber}]`;
      celebrationTitle = `恭喜！在【${top.operatorNameZh}】${top.matchTypeZh}命中 ${top.tierZh} [${top.winningNumber}]！`;
    }

    return {
      date: dateStr,
      hasHit,
      totalHits: uniqueHits.length,
      directHits,
      variationHits,
      highestTier,
      highestTierZh,
      highestOperator,
      highestOperatorZh,
      hitSummary,
      celebrationTitle,
      hits: uniqueHits,
      drawsAvailable: draws.length > 0,
      drawRecords: draws,
    };
  }
}
