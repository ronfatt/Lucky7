// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Canonical Citation Engine
// File: lib/literature/citation-engine.ts
// Matches prediction outputs with authoritative citations from the 6 books
// ==========================================================

import type { MetaphysicalCitation, FiveElement } from '../../types/zwtsp.ts';
import { PlumBlossomEngine } from './plum-blossom-engine.ts';

export const CORE_CANONICAL_CITATIONS: MetaphysicalCitation[] = [
  {
    id: 'cite-xs-01',
    sourceLiteratureId: 'LIT_XIANGSHU',
    sourceTitle: '劉金府象数心学紫微斗数',
    author: '刘金府',
    chapterTitle: '第一章：河洛十五数与四化大义',
    originalQuote: '星辰取数，是源于河图；取象，则是源于洛书。凡象数皆有其常与变。斗数，它只是一个河洛「十五数」的计算方法而己。',
    metaphysicalInterpretation: '数字推演之根本在于洛书九宫归纳与河图五行生成，每一位数字皆是天地阴阳在时空中的具体凝聚。',
    appliedAspect: 'NUMBER',
    relatedElements: ['Earth', 'Water'],
  },
  {
    id: 'cite-xs-02',
    sourceLiteratureId: 'LIT_XIANGSHU',
    sourceTitle: '劉金府象数心学紫微斗数',
    author: '刘金府',
    chapterTitle: '第二章：十天干授气与动静常变',
    originalQuote: '化气就是四化，四化源于十天干。五行就是星辰，阴阳相合而合为十。故以年干布四化象、立宫干。天干之气有十，故流行于运。',
    metaphysicalInterpretation: '天干气化决定了数字能量的生生不息，禄代表生发与顺遂，忌代表归藏与收敛。',
    appliedAspect: 'TRANSFORMATION',
    relatedTransformations: ['LU', 'JI'],
  },
  {
    id: 'cite-qt-01',
    sourceLiteratureId: 'LIT_QINTIAN',
    sourceTitle: '楚皇-紫微斗数高级理论大全',
    author: '蔡明宏 (华山钦天门第27代传人)',
    chapterTitle: '第二章：地理加自化理论',
    originalQuote: '自化者，出乎自然生机，动静有常；自化禄是出，向心自化为归，数之流布由此分明。知其然而不知其所以然者，迷于576象；通其易理河洛者，万化归一。',
    metaphysicalInterpretation: '空间方位（八方）与时间盘口引动自化效应，若数字与吉位相生，则向心聚气；反之则离心耗散。',
    appliedAspect: 'DIRECTION',
    relatedElements: ['Wood', 'Metal'],
  },
  {
    id: 'cite-mh-01',
    sourceLiteratureId: 'LIT_MEIHUA',
    sourceTitle: '梅花易数体用大全',
    author: '李科儒',
    chapterTitle: '第二章：体用生克之妙',
    originalQuote: '体生用为泄气之兆，用生体为进益之功；体克用谋求可得，用克体祸起仓卒；体用比和百事通泰。数以象成，象以数立。',
    metaphysicalInterpretation: '数字前二位为体，后二位为用，体用五行生生克克，断定该数组内运气脉是顺畅进益抑或相斥抵消。',
    appliedAspect: 'NUMBER',
  },
  {
    id: 'cite-fx-01',
    sourceLiteratureId: 'LIT_FEIXING_672',
    sourceTitle: '飞星紫微斗数十二宫六七二象',
    author: '飞星派历代先贤',
    chapterTitle: '命宫与财帛田宅飞化篇',
    originalQuote: '命宫化禄入财帛，求财顺遂而数有源；命宫化忌入田宅，藏富于家而气不散。财为用，田为体，体用相资，数自坚实。',
    metaphysicalInterpretation: '财帛与田宅是资产与数字汇聚的核心轴线，化禄引动财源生发，化忌守护资产底蕴。',
    appliedAspect: 'PALACE',
    relatedTransformations: ['LU', 'JI'],
  },
  {
    id: 'cite-lq-01',
    sourceLiteratureId: 'LIT_LIQI',
    sourceTitle: '由理气原则学习飞宫紫微斗数',
    author: '飞宫理气诸学者',
    chapterTitle: '理气总纲与应期篇',
    originalQuote: '理在数先，气依形著。天干施气，地支受化，十二宫如天地大炉。发于禄者显其端，归于忌者定其宿；追其流转，知数之所聚。',
    metaphysicalInterpretation: '流日干支如同天令，激发生命星盘中潜藏之数，应期吉凶如影随形。',
    appliedAspect: 'TIME',
  },
];

export class CitationEngine {
  /**
   * Matches classical literature citations for a target number (Mother Code or Candidate)
   */
  public static matchCitationsForNumber(
    numberStr: string,
    dominantElement?: FiveElement
  ): {
    plumBlossomCitation: string;
    primaryMetaphysicalCitation: MetaphysicalCitation;
    secondaryCitations: MetaphysicalCitation[];
  } {
    // 1. Compute Plum Blossom Body/Use Citation
    const plumAnalysis = PlumBlossomEngine.analyzeNumber(numberStr);
    const plumBlossomCitation = plumAnalysis.canonicalCitation;

    // 2. Select primary citation based on dominant element or number essence
    let primary = CORE_CANONICAL_CITATIONS[0];
    if (dominantElement === 'Wood' || dominantElement === 'Metal') {
      primary = CORE_CANONICAL_CITATIONS[2]; // Cai Ming-Hong
    } else if (dominantElement === 'Fire' || dominantElement === 'Water') {
      primary = CORE_CANONICAL_CITATIONS[1]; // Liu Jin-Fu
    }

    const secondary = CORE_CANONICAL_CITATIONS.filter((c) => c.id !== primary.id).slice(0, 2);

    return {
      plumBlossomCitation,
      primaryMetaphysicalCitation: primary,
      secondaryCitations: secondary,
    };
  }

  /**
   * Retrieves citations matching a specific keyword or aspect
   */
  public static getCitationsByAspect(
    aspect: MetaphysicalCitation['appliedAspect']
  ): MetaphysicalCitation[] {
    return CORE_CANONICAL_CITATIONS.filter((c) => c.appliedAspect === aspect);
  }
}
