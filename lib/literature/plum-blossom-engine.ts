// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Plum Blossom Trigram Engine
// File: lib/literature/plum-blossom-engine.ts
// Based on: 《梅花易数体用大全》李科儒著
// ==========================================================

import type { FiveElement, PlumBlossomTrigramMapping } from '../../types/zwtsp.ts';

export type BodyUseRelation =
  | 'YONG_SHENG_TI' // 用生体 (大吉，益本)
  | 'BI_HE'         // 体用比和 (吉，同气相求)
  | 'TI_KE_YONG'   // 体克用 (次吉，克成)
  | 'TI_SHENG_YONG' // 体生用 (平凶，泄气)
  | 'YONG_KE_TI';   // 用克体 (凶，受制)

export const EARLY_HEAVEN_TRIGRAMS: Record<number, PlumBlossomTrigramMapping> = {
  1: {
    digit: 1,
    trigram: 'QIAN',
    trigramZh: '乾',
    nature: '天',
    element: 'Metal',
    yinYang: 'Yang',
    bodyUseMeaning: '自强不息，刚健纯粹，首领之象',
  },
  2: {
    digit: 2,
    trigram: 'DUI',
    trigramZh: '兑',
    nature: '泽',
    element: 'Metal',
    yinYang: 'Yin',
    bodyUseMeaning: '和悦亨通，言语沟通，欢欣之象',
  },
  3: {
    digit: 3,
    trigram: 'LI',
    trigramZh: '离',
    nature: '火',
    element: 'Fire',
    yinYang: 'Yin',
    bodyUseMeaning: '光明依附，文明礼达，洞见之象',
  },
  4: {
    digit: 4,
    trigram: 'ZHEN',
    trigramZh: '震',
    nature: '雷',
    element: 'Wood',
    yinYang: 'Yang',
    bodyUseMeaning: '萌动奋发，声威惊远，开拓之象',
  },
  5: {
    digit: 5,
    trigram: 'XUN',
    trigramZh: '巽',
    nature: '风',
    element: 'Wood',
    yinYang: 'Yin',
    bodyUseMeaning: '柔顺渗透，行令无阻，灵动之象',
  },
  6: {
    digit: 6,
    trigram: 'KAN',
    trigramZh: '坎',
    nature: '水',
    element: 'Water',
    yinYang: 'Yang',
    bodyUseMeaning: '险陷涵蓄，智谋深藏，润下之象',
  },
  7: {
    digit: 7,
    trigram: 'GEN',
    trigramZh: '艮',
    nature: '山',
    element: 'Earth',
    yinYang: 'Yang',
    bodyUseMeaning: '止而不动，坚守基石，稳固之象',
  },
  8: {
    digit: 8,
    trigram: 'KUN',
    trigramZh: '坤',
    nature: '地',
    element: 'Earth',
    yinYang: 'Yin',
    bodyUseMeaning: '厚德载物，宽厚包容，藏蓄之象',
  },
};

export interface NumberBodyUseAnalysis {
  numberStr: string;
  upperDigit: number;
  upperTrigram: PlumBlossomTrigramMapping;
  lowerDigit: number;
  lowerTrigram: PlumBlossomTrigramMapping;
  tiTrigram: PlumBlossomTrigramMapping; // Upper is Ti (体) by convention
  yongTrigram: PlumBlossomTrigramMapping; // Lower is Yong (用)
  relation: BodyUseRelation;
  relationZh: string;
  verdict: string;
  canonicalCitation: string;
}

export class PlumBlossomEngine {
  /**
   * Retrieves Early Heaven Trigram mapping by digit (1-8, 0/9 modulo handled)
   */
  public static getTrigramByDigit(digit: number): PlumBlossomTrigramMapping {
    let mod = digit % 8;
    if (mod === 0) mod = 8;
    return EARLY_HEAVEN_TRIGRAMS[mod];
  }

  /**
   * Evaluates the Five Elements Body/Use Relationship
   */
  public static evaluateRelation(ti: FiveElement, yong: FiveElement): { relation: BodyUseRelation; relationZh: string; verdict: string } {
    // 1. 比和
    if (ti === yong) {
      return {
        relation: 'BI_HE',
        relationZh: '体用比和',
        verdict: '五行同气比和，内外气脉贯通，百事谐和吉昌。',
      };
    }

    // 2. 五行生克字典 (生我者为用生体，我生者为体生用，克我者为用克体，我克者为体克用)
    const generates: Record<FiveElement, FiveElement> = {
      Wood: 'Fire',
      Fire: 'Earth',
      Earth: 'Metal',
      Metal: 'Water',
      Water: 'Wood',
    };

    const overcomes: Record<FiveElement, FiveElement> = {
      Wood: 'Earth',
      Earth: 'Water',
      Water: 'Fire',
      Fire: 'Metal',
      Metal: 'Wood',
    };

    if (generates[yong] === ti) {
      return {
        relation: 'YONG_SHENG_TI',
        relationZh: '用生体',
        verdict: '客来生主，得天独厚，有进益萌发之喜，大吉！',
      };
    }

    if (generates[ti] === yong) {
      return {
        relation: 'TI_SHENG_YONG',
        relationZh: '体生用',
        verdict: '主去生客，气机耗散，宜收敛守成，防过分耗力。',
      };
    }

    if (overcomes[ti] === yong) {
      return {
        relation: 'TI_KE_YONG',
        relationZh: '体克用',
        verdict: '我克彼成，虽劳心尽力，然机谋可行，克制致胜。',
      };
    }

    if (overcomes[yong] === ti) {
      return {
        relation: 'YONG_KE_TI',
        relationZh: '用克体',
        verdict: '客来侵我，气场受制，切忌激进追逐，谨慎避险。',
      };
    }

    return {
      relation: 'BI_HE',
      relationZh: '体用平顺',
      verdict: '气机相安，静观其变。',
    };
  }

  /**
   * Performs complete Plum Blossom Body/Use analysis on a 4-digit number
   * (Digits 1 & 2 form Upper/Ti, Digits 3 & 4 form Lower/Yong)
   */
  public static analyzeNumber(numberStr: string): NumberBodyUseAnalysis {
    const clean = numberStr.padStart(4, '0').slice(-4);
    const d1 = Number(clean[0]) || 8;
    const d2 = Number(clean[1]) || 8;
    const d3 = Number(clean[2]) || 8;
    const d4 = Number(clean[3]) || 8;

    // Upper trigram from sum of first two digits
    const upperSum = d1 + d2;
    const upperDigit = upperSum % 8 === 0 ? 8 : upperSum % 8;
    const upperTrigram = this.getTrigramByDigit(upperDigit);

    // Lower trigram from sum of last two digits
    const lowerSum = d3 + d4;
    const lowerDigit = lowerSum % 8 === 0 ? 8 : lowerSum % 8;
    const lowerTrigram = this.getTrigramByDigit(lowerDigit);

    // Upper as Ti, Lower as Yong
    const { relation, relationZh, verdict } = this.evaluateRelation(
      upperTrigram.element,
      lowerTrigram.element
    );

    const canonicalCitation = `李科儒《梅花易数体用大全》卷二断诀：上卦得【${upperTrigram.trigramZh}为${upperTrigram.nature}（${upperTrigram.element}）】为体，下卦得【${lowerTrigram.trigramZh}为${lowerTrigram.nature}（${lowerTrigram.element}）】为用。${verdict} 经云：“${
      relation === 'YONG_SHENG_TI'
        ? '用生体，福厚益增，所谋如意。'
        : relation === 'BI_HE'
        ? '体用比和，得友相助，百事顺昌。'
        : relation === 'TI_KE_YONG'
        ? '体克用，事虽劳神，终能制伏成局。'
        : relation === 'TI_SHENG_YONG'
        ? '体生用，财散人劳，诸事宜防脱节。'
        : '用克体，事多龃龉，吉处藏凶。'
    }”`;

    return {
      numberStr: clean,
      upperDigit,
      upperTrigram,
      lowerDigit,
      lowerTrigram,
      tiTrigram: upperTrigram,
      yongTrigram: lowerTrigram,
      relation,
      relationZh,
      verdict,
      canonicalCitation,
    };
  }
}
