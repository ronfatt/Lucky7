// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Flying Star Si Hua Engine
// File: lib/literature/flying-star-sihua-engine.ts
// Based on: 《飞星紫微斗数十二宫六七二象》 & 《由理气原则学习飞宫紫微斗数》
// ==========================================================

import type { FlyingStarSiHuaPattern } from '../../types/zwtsp.ts';

export const CANONICAL_FLYING_STAR_PATTERNS: FlyingStarSiHuaPattern[] = [
  {
    id: 'fsp-ming-lu-cai',
    fromPalace: '命宫',
    siHuaType: 'LU',
    siHuaName: '化禄',
    toPalace: '财帛宫',
    canonicalMeaning: '求财顺遂，源头有水，主自食其力而得财自如，有生生不息之意象。',
    numberImplication: '对应生发数理（1、6 水木象），气势顺畅，数字多带相生。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》命宫飞化第一章',
  },
  {
    id: 'fsp-ming-quan-guan',
    fromPalace: '命宫',
    siHuaType: 'QUAN',
    siHuaName: '化权',
    toPalace: '官禄宫',
    canonicalMeaning: '积极开创，责任担当，凡事亲力亲为，具掌控与主导全局之势能。',
    numberImplication: '对应阳刚刚健数理（4、9 金火象），主数字具爆发力与穿透力。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》命宫飞化第二章',
  },
  {
    id: 'fsp-ming-ke-qian',
    fromPalace: '命宫',
    siHuaType: 'KE',
    siHuaName: '化科',
    toPalace: '迁移宫',
    canonicalMeaning: '出外有名声，广结善缘，遇难成祥，得贵人照拂提携。',
    numberImplication: '对应文明清贵数理（2、7 火木象），数字讲究阴阳停匀平和。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》命宫飞化第三章',
  },
  {
    id: 'fsp-ming-ji-tian',
    fromPalace: '命宫',
    siHuaType: 'JI',
    siHuaName: '化忌',
    toPalace: '田宅宫',
    canonicalMeaning: '忌入田宅为库藏，虽操心顾家，然有聚财置产之实，财气深藏不露。',
    numberImplication: '对应收敛归藏数理（5、0 土金象），利于合数逢五逢十归中。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》命宫飞化第四章',
  },
  {
    id: 'fsp-cai-lu-tian',
    fromPalace: '财帛宫',
    siHuaType: 'LU',
    siHuaName: '化禄',
    toPalace: '田宅宫',
    canonicalMeaning: '获利归库，财源滚滚而入不动产与蓄金池，大吉大利之富局。',
    numberImplication: '数主重叠对子（如双数聚库），和值常现吉宫生发之象。',
    sourceLiterature: '《由理气原则学习飞宫紫微斗数》财库理气篇',
  },
  {
    id: 'fsp-cai-ji-ji',
    fromPalace: '财帛宫',
    siHuaType: 'JI',
    siHuaName: '化忌',
    toPalace: '疾厄宫',
    canonicalMeaning: '钱财损及身心，求财过于操劳或投资容易受拖累，宜稳健戒贪。',
    numberImplication: '数字波动较大，避开相克冲煞之数组，不宜博冷。',
    sourceLiterature: '《由理气原则学习飞宫紫微斗数》理气避险篇',
  },
  {
    id: 'fsp-guan-lu-ming',
    fromPalace: '官禄宫',
    siHuaType: 'LU',
    siHuaName: '化禄',
    toPalace: '命宫',
    canonicalMeaning: '事业反哺命造，事半功倍，常有意外良机临身，所谋皆有回响。',
    numberImplication: '顺行递增数理（升势排列），能量由外向内回注。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》官禄篇',
  },
  {
    id: 'fsp-tian-lu-guan',
    fromPalace: '田宅宫',
    siHuaType: 'LU',
    siHuaName: '化禄',
    toPalace: '官禄宫',
    canonicalMeaning: '底气充盈，基业雄厚，可用之资调度自如，无资金枯竭之患。',
    numberImplication: '底数稳健，首位数字多居厚重土金之位。',
    sourceLiterature: '《飞星紫微斗数十二宫六七二象》田宅篇',
  },
  {
    id: 'fsp-zihua-lu',
    fromPalace: '命宫',
    siHuaType: 'LU',
    siHuaName: '自化禄',
    toPalace: '命宫',
    canonicalMeaning: '自化禄为出，出乎自然生机，为人开朗大度，然须防聚少散多、无形中消耗。',
    numberImplication: '灵动通达数理，取象生动，不拘泥于死板定数。',
    sourceLiterature: '蔡明宏《楚皇-紫微斗数高级理论大全》自化真谛篇',
  },
  {
    id: 'fsp-zihua-ji',
    fromPalace: '命宫',
    siHuaType: 'JI',
    siHuaName: '自化忌',
    toPalace: '命宫',
    canonicalMeaning: '自化忌为泄，易自生烦恼或行事虎头蛇尾，唯以定力坚持方能破茧成蝶。',
    numberImplication: '数理宜用合数调和，以土制水或以金生水，化解动摇。',
    sourceLiterature: '蔡明宏《楚皇-紫微斗数高级理论大全》自化真谛篇',
  },
];

export class FlyingStarSiHuaEngine {
  /**
   * Retrieves all canonical flying star patterns
   */
  public static getAllPatterns(): FlyingStarSiHuaPattern[] {
    return [...CANONICAL_FLYING_STAR_PATTERNS];
  }

  /**
   * Finds matching pattern by fromPalace, siHuaType, and toPalace
   */
  public static findPattern(
    fromPalace: string,
    siHuaType: 'LU' | 'QUAN' | 'KE' | 'JI',
    toPalace: string
  ): FlyingStarSiHuaPattern | undefined {
    return CANONICAL_FLYING_STAR_PATTERNS.find(
      (p) => p.fromPalace === fromPalace && p.siHuaType === siHuaType && p.toPalace === toPalace
    );
  }

  /**
   * Queries patterns involving a specific palace (either as source or destination)
   */
  public static queryPatternsByPalace(palaceName: string): FlyingStarSiHuaPattern[] {
    return CANONICAL_FLYING_STAR_PATTERNS.filter(
      (p) => p.fromPalace.includes(palaceName) || p.toPalace.includes(palaceName)
    );
  }
}
