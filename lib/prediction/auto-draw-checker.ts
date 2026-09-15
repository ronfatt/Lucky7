// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Automatic Draw Checker Engine
// File: lib/prediction/auto-draw-checker.ts
// Automatically cross-references saved numbers against Malaysian & regional draws
// ==========================================================

import { MalaysiaLotteryProvider } from '../lottery/malaysia-provider.ts';
import type { LotteryHitMatchItem } from '../lottery/malaysia-provider.ts';
import type { SavedPredictionItem } from './saved-predictions-store.ts';
import type { MalaysianPrizeTier } from '../../types/zwtsp.ts';

export interface DrawCheckResult {
  item: SavedPredictionItem;
  hasHit: boolean;
  totalHits: number;
  directHits: number;
  permHits: number;
  highestTier: MalaysianPrizeTier | 'NONE';
  highestTierZh: string;
  badgeColor: string;
  celebrationTitle: string;
  recentHits: LotteryHitMatchItem[];
}

export class AutoDrawChecker {
  /**
   * Checks a saved prediction item against historical draws
   */
  public static checkSingle(item: SavedPredictionItem): DrawCheckResult {
    const hits = MalaysiaLotteryProvider.getRecentMatchesForNumber(item.number, 50, 'ALL');

    const directHits = hits.filter((h) => h.matchType === 'DIRECT').length;
    const permHits = hits.filter((h) => h.matchType === 'PERMUTATION').length;

    let highestTier: MalaysianPrizeTier | 'NONE' = 'NONE';
    let highestTierZh = '尚未命中 / 蓄势储备';
    let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
    let celebrationTitle = '未命中历史开奖';

    if (hits.length > 0) {
      // Find highest tier
      const tierRank: Record<MalaysianPrizeTier, number> = {
        FIRST: 5,
        SECOND: 4,
        THIRD: 3,
        SPECIAL: 2,
        CONSOLATION: 1,
      };

      let maxRank = 0;
      for (const h of hits) {
        const rank = tierRank[h.tier] || 0;
        if (rank > maxRank) {
          maxRank = rank;
          highestTier = h.tier;
        }
      }

      const topHit = hits[0];
      if (highestTier === 'FIRST') {
        highestTierZh = '🎉 命中 头奖 (1st Prize)';
        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
        celebrationTitle = `恭喜！在【${topHit.operatorNameZh}】${topHit.matchTypeZh}命中头奖！`;
      } else if (highestTier === 'SECOND') {
        highestTierZh = '🥈 命中 二奖 (2nd Prize)';
        badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/50';
        celebrationTitle = `恭喜！在【${topHit.operatorNameZh}】${topHit.matchTypeZh}命中二奖！`;
      } else if (highestTier === 'THIRD') {
        highestTierZh = '🥉 命中 三奖 (3rd Prize)';
        badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
        celebrationTitle = `恭喜！在【${topHit.operatorNameZh}】${topHit.matchTypeZh}命中三奖！`;
      } else if (highestTier === 'SPECIAL') {
        highestTierZh = '✨ 命中 特别奖 (Special)';
        badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/50';
        celebrationTitle = `在【${topHit.operatorNameZh}】${topHit.matchTypeZh}斩获特别奖！`;
      } else {
        highestTierZh = '🎯 命中 安慰奖 (Consolation)';
        badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/50';
        celebrationTitle = `在【${topHit.operatorNameZh}】${topHit.matchTypeZh}斩获安慰奖！`;
      }
    }

    return {
      item,
      hasHit: hits.length > 0,
      totalHits: hits.length,
      directHits,
      permHits,
      highestTier,
      highestTierZh,
      badgeColor,
      celebrationTitle,
      recentHits: hits.slice(0, 5),
    };
  }

  /**
   * Checks all saved prediction items
   */
  public static checkAll(items: SavedPredictionItem[]): DrawCheckResult[] {
    return items.map((item) => this.checkSingle(item));
  }
}
