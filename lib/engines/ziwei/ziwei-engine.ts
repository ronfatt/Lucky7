// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Zi Wei Dou Shu Engine
// File: lib/engines/ziwei/ziwei-engine.ts
// ==========================================================

import type {
  BirthProfile,
  StarPlacement,
  TransformationInstance,
  WuXingElement,
  ZiWeiBureau,
  ZiWeiChartData,
  ZiWeiPalaceInstance,
} from '../../../types/zwtsp.ts';
import { CalendarConversionEngine, EARTHLY_BRANCHES, HEAVENLY_STEMS } from '../calendar/calendar-engine.ts';
import { BRANCH_ELEMENTS } from '../calendar/calendar-engine.ts';

// 60 JiaZi NaYin to Five Elements Bureau (六十甲子纳音定五行局)
export const NAYIN_BUREAU_MAP: Record<string, ZiWeiBureau> = {
  // 水二局 (涧下水、泉中水、长流水、天河水、大溪水、大海水)
  丙子: '水二局', 丁丑: '水二局',
  甲申: '水二局', 乙酉: '水二局',
  壬辰: '水二局', 癸巳: '水二局',
  丙午: '水二局', 丁未: '水二局',
  甲寅: '水二局', 乙卯: '水二局',
  壬戌: '水二局', 癸亥: '水二局',

  // 木三局 (大林木、杨柳木、松柏木、平地木、桑柘木、石榴木)
  戊辰: '木三局', 己巳: '木三局',
  壬午: '木三局', 癸未: '木三局',
  庚寅: '木三局', 辛卯: '木三局',
  戊戌: '木三局', 己亥: '木三局',
  壬子: '木三局', 癸丑: '木三局',
  庚申: '木三局', 辛酉: '木三局',

  // 金四局 (海中金、剑锋金、白蜡金、沙中金、金箔金、钗钏金)
  甲子: '金四局', 乙丑: '金四局',
  壬申: '金四局', 癸酉: '金四局',
  庚辰: '金四局', 辛巳: '金四局',
  甲午: '金四局', 乙未: '金四局',
  壬寅: '金四局', 癸卯: '金四局',
  庚戌: '金四局', 辛亥: '金四局',

  // 土五局 (路旁土、城头土、屋上土、壁上土、大驿土、沙中土)
  庚午: '土五局', 辛未: '土五局',
  戊寅: '土五局', 己卯: '土五局',
  丙戌: '土五局', 丁亥: '土五局',
  庚子: '土五局', 辛丑: '土五局',
  戊申: '土五局', 己酉: '土五局',
  丙辰: '土五局', 丁巳: '土五局',

  // 火六局 (炉中火、山头火、霹雳火、山下火、覆灯火、天上火)
  丙寅: '火六局', 丁卯: '火六局',
  甲戌: '火六局', 乙亥: '火六局',
  戊子: '火六局', 己丑: '火六局',
  丙申: '火六局', 丁酉: '火六局',
  甲辰: '火六局', 乙巳: '火六局',
  戊午: '火六局', 己未: '火六局',
};

// 12 Standard Zi Wei Palaces in counter-clockwise sequence
export const PALACE_NAMES = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫',
  '财帛宫', '疾厄宫', '迁移宫', '交友宫',
  '官禄宫', '田宅宫', '福德宫', '父母宫'
] as const;

// Earthly Branches indexed starting from 寅 (idx 0 in traditional layout)
export const PALACE_BRANCH_ORDER = [
  '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'
] as const;

// 14 Main Stars definitions
export const MAIN_STARS = [
  { name: '紫微', element: 'Earth' as WuXingElement, system: 'North' },
  { name: '天机', element: 'Wood' as WuXingElement, system: 'North' },
  { name: '太阳', element: 'Fire' as WuXingElement, system: 'North' },
  { name: '武曲', element: 'Metal' as WuXingElement, system: 'North' },
  { name: '天同', element: 'Water' as WuXingElement, system: 'North' },
  { name: '廉贞', element: 'Fire' as WuXingElement, system: 'North' },
  { name: '天府', element: 'Earth' as WuXingElement, system: 'South' },
  { name: '太阴', element: 'Water' as WuXingElement, system: 'South' },
  { name: '贪狼', element: 'Wood' as WuXingElement, system: 'South' },
  { name: '巨门', element: 'Water' as WuXingElement, system: 'South' },
  { name: '天相', element: 'Water' as WuXingElement, system: 'South' },
  { name: '天梁', element: 'Earth' as WuXingElement, system: 'South' },
  { name: '七杀', element: 'Metal' as WuXingElement, system: 'South' },
  { name: '破军', element: 'Water' as WuXingElement, system: 'South' },
];

// Birth Year Heavenly Stem Four Transformations (生年四化)
export const FOUR_TRANSFORMATIONS_BY_STEM: Record<string, Record<'Lu' | 'Quan' | 'Ke' | 'Ji', string>> = {
  甲: { Lu: '廉贞', Quan: '破军', Ke: '武曲', Ji: '太阳' },
  乙: { Lu: '天机', Quan: '天梁', Ke: '紫微', Ji: '太阴' },
  丙: { Lu: '天同', Quan: '天机', Ke: '文昌', Ji: '廉贞' },
  丁: { Lu: '太阴', Quan: '天同', Ke: '天机', Ji: '巨门' },
  戊: { Lu: '贪狼', Quan: '太阴', Ke: '右弼', Ji: '天机' },
  己: { Lu: '武曲', Quan: '贪狼', Ke: '天梁', Ji: '文曲' },
  庚: { Lu: '太阳', Quan: '武曲', Ke: '太阴', Ji: '天同' },
  辛: { Lu: '巨门', Quan: '太阳', Ke: '文曲', Ji: '文昌' },
  壬: { Lu: '天梁', Quan: '紫微', Ke: '左辅', Ji: '武曲' },
  癸: { Lu: '破军', Quan: '巨门', Ke: '太阴', Ji: '贪狼' },
};

export class ZiWeiEngine {
  public static readonly VERSION = 'ZW-TRADITIONAL-V1.0';

  /**
   * Generates complete Zi Wei Dou Shu destiny chart from birth profile
   */
  public static generateChart(profile: BirthProfile): ZiWeiChartData {
    const isHourKnown = profile.birthTimePrecision !== 'UNKNOWN' && Boolean(profile.birthTime);

    if (!isHourKnown) {
      // Incomplete handling: never invent birth hour!
      return {
        bureau: '水二局',
        lifePalaceBranch: 'UNKNOWN',
        lifePalacePosition: -1,
        bodyPalaceBranch: 'UNKNOWN',
        bodyPalacePosition: -1,
        palaces: [],
        calculationVersion: this.VERSION,
        isComplete: false,
        missingDataReason: '出生时间未知，部分紫微与时柱计算无法完成。',
      };
    }

    const lunar = CalendarConversionEngine.toLunarDate(profile.birthDate);
    const fourPillars = CalendarConversionEngine.getFourPillars(profile.birthDate, profile.birthTime, true);

    const lMonth = lunar.lunarMonth;
    // Map birth hour to 1-12 (子=1, 丑=2 ... 亥=12)
    const hourBranch = fourPillars.hourBranch || '子';
    const hourBranchIndex = EARTHLY_BRANCHES.indexOf(hourBranch as any) + 1; // 1 to 12

    // Life Palace: from 寅(0), clockwise (lMonth-1), then counter-clockwise (hourBranchIndex-1)
    const lifeBranchIdx = ((lMonth - 1) - (hourBranchIndex - 1) + 24) % 12;
    const lifePalaceBranch = PALACE_BRANCH_ORDER[lifeBranchIdx];

    // Body Palace: from 寅(0), clockwise (lMonth-1), then clockwise (hourBranchIndex-1)
    const bodyBranchIdx = ((lMonth - 1) + (hourBranchIndex - 1)) % 12;
    const bodyPalaceBranch = PALACE_BRANCH_ORDER[bodyBranchIdx];

    // Five Elements Bureau (derived from Life Palace Stem-Branch NaYin)
    const bureau = this.calculateBureau(fourPillars.yearStem, lifePalaceBranch);

    // Generate 12 Palaces with Heavenly Stems (五虎遁元)
    const palaces: ZiWeiPalaceInstance[] = [];
    for (let i = 0; i < 12; i++) {
      // In counter-clockwise direction from Life Palace
      const branchIdx = (lifeBranchIdx - i + 24) % 12;
      const branch = PALACE_BRANCH_ORDER[branchIdx];
      const palaceName = PALACE_NAMES[i];
      const element = BRANCH_ELEMENTS[branch];
      const stem = this.getPalaceStem(fourPillars.yearStem, branch);
      const stemBranch = `${stem}${branch}`;

      palaces.push({
        palaceName,
        branch,
        stem,
        stemBranch,
        position: i,
        element,
        stars: [],
        transformations: [],
        isLifePalace: palaceName === '命宫',
        isBodyPalace: branch === bodyPalaceBranch,
        score: 50,
      });
    }

    // Place 14 Main Stars
    this.placeMainStars(palaces, lunar.lunarDay, bureau);

    // Place Birth Year Four Transformations
    this.placeFourTransformations(palaces, fourPillars.yearStem);

    const lifeStem = this.getPalaceStem(fourPillars.yearStem, lifePalaceBranch);
    const bodyStem = this.getPalaceStem(fourPillars.yearStem, bodyPalaceBranch);

    return {
      bureau,
      lifePalaceBranch,
      lifePalaceStem: lifeStem,
      lifePalaceStemBranch: `${lifeStem}${lifePalaceBranch}`,
      lifePalacePosition: 0,
      bodyPalaceBranch,
      bodyPalaceStem: bodyStem,
      bodyPalaceStemBranch: `${bodyStem}${bodyPalaceBranch}`,
      bodyPalacePosition: palaces.findIndex(p => p.isBodyPalace),
      palaces,
      calculationVersion: this.VERSION,
      isComplete: true,
    };
  }

  /**
   * Calculates the Heavenly Stem of a Palace branch using Five Tigers Dun (五虎遁元)
   * 甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸何方发甲寅好追求。
   */
  public static getPalaceStem(yearStem: string, branch: string): string {
    const startStemMap: Record<string, number> = {
      甲: 2, 己: 2, // 丙
      乙: 4, 庚: 4, // 戊
      丙: 6, 辛: 6, // 庚
      丁: 8, 壬: 8, // 壬
      戊: 0, 癸: 0, // 甲
    };
    const startStemIdx = startStemMap[yearStem] ?? 2;
    const branchOffsetFromYin = PALACE_BRANCH_ORDER.indexOf(branch as any);
    if (branchOffsetFromYin === -1) return '';
    const stemIdx = (startStemIdx + branchOffsetFromYin) % 10;
    return HEAVENLY_STEMS[stemIdx];
  }

  /**
   * Calculates Five Elements Bureau (五行局) via canonical 60 JiaZi NaYin
   * Based on the Heavenly Stem and Earthly Branch of the Life Palace (命宫干支纳音)
   */
  public static calculateBureau(yearStem: string, lifePalaceBranch: string): ZiWeiBureau {
    const lifeStem = this.getPalaceStem(yearStem, lifePalaceBranch);
    const stemBranch = `${lifeStem}${lifePalaceBranch}`;
    return NAYIN_BUREAU_MAP[stemBranch] || '水二局';
  }

  /**
   * Places 14 Main Stars across the 12 Palaces
   */
  private static placeMainStars(palaces: ZiWeiPalaceInstance[], lunarDay: number, bureau: ZiWeiBureau): void {
    const bureauNumMap: Record<ZiWeiBureau, number> = {
      水二局: 2, 木三局: 3, 金四局: 4, 土五局: 5, 火六局: 6,
    };
    const bNum = bureauNumMap[bureau];

    // Standard Zi Wei Star position calculation
    let remainder = lunarDay % bNum;
    let quotient = Math.floor(lunarDay / bNum);
    let ziWeiBranchIdx = 0;

    if (remainder === 0) {
      ziWeiBranchIdx = (quotient - 1 + 12) % 12;
    } else {
      const added = bNum - remainder;
      quotient = Math.floor((lunarDay + added) / bNum);
      if (added % 2 === 1) {
        ziWeiBranchIdx = (quotient - 1 - added + 24) % 12;
      } else {
        ziWeiBranchIdx = (quotient - 1 + added) % 12;
      }
    }

    const ziWeiPalace = palaces.find(p => p.branch === PALACE_BRANCH_ORDER[ziWeiBranchIdx]);
    if (ziWeiPalace) {
      ziWeiPalace.stars.push({ starName: '紫微', element: 'Earth', isMainStar: true, brightness: '庙' });
    }

    // Place other Northern stars relative to Zi Wei (counter-clockwise)
    // 紫微(0), 天机(-1), 太阳(-3), 武曲(-4), 天同(-5), 廉贞(-8)
    const northOffsets: Array<[string, number, WuXingElement]> = [
      ['天机', -1, 'Wood'],
      ['太阳', -3, 'Fire'],
      ['武曲', -4, 'Metal'],
      ['天同', -5, 'Water'],
      ['廉贞', -8, 'Fire'],
    ];

    for (const [sName, offset, el] of northOffsets) {
      const targetIdx = (ziWeiBranchIdx + offset + 24) % 12;
      const targetBranch = PALACE_BRANCH_ORDER[targetIdx];
      const p = palaces.find(item => item.branch === targetBranch);
      if (p) {
        p.stars.push({ starName: sName, element: el, isMainStar: true, brightness: '旺' });
      }
    }

    // Place Southern stars relative to Tian Fu (symmetry across 寅-申 axis)
    // Tian Fu branch index = (12 - ziWeiBranchIdx) % 12 (symmetry)
    const tianFuBranchIdx = (12 - ziWeiBranchIdx) % 12;
    const tianFuPalace = palaces.find(p => p.branch === PALACE_BRANCH_ORDER[tianFuBranchIdx]);
    if (tianFuPalace) {
      tianFuPalace.stars.push({ starName: '天府', element: 'Earth', isMainStar: true, brightness: '庙' });
    }

    // Southern stars placed clockwise from Tian Fu
    // 天府(0), 太阴(1), 贪狼(2), 巨门(3), 天相(4), 天梁(5), 七杀(6), 破军(10)
    const southOffsets: Array<[string, number, WuXingElement]> = [
      ['太阴', 1, 'Water'],
      ['贪狼', 2, 'Wood'],
      ['巨门', 3, 'Water'],
      ['天相', 4, 'Water'],
      ['天梁', 5, 'Earth'],
      ['七杀', 6, 'Metal'],
      ['破军', 10, 'Water'],
    ];

    for (const [sName, offset, el] of southOffsets) {
      const targetIdx = (tianFuBranchIdx + offset) % 12;
      const targetBranch = PALACE_BRANCH_ORDER[targetIdx];
      const p = palaces.find(item => item.branch === targetBranch);
      if (p) {
        p.stars.push({ starName: sName, element: el, isMainStar: true, brightness: '旺' });
      }
    }
  }

  /**
   * Places Birth-Year Four Transformations across Palaces where target stars reside
   */
  private static placeFourTransformations(palaces: ZiWeiPalaceInstance[], yearStem: string): void {
    const stemRules = FOUR_TRANSFORMATIONS_BY_STEM[yearStem];
    if (!stemRules) return;

    const transTypes: Array<'Lu' | 'Quan' | 'Ke' | 'Ji'> = ['Lu', 'Quan', 'Ke', 'Ji'];
    const labelMap = { Lu: '化禄', Quan: '化权', Ke: '化科', Ji: '化忌' };

    for (const t of transTypes) {
      const starName = stemRules[t];
      // Find palace containing this star
      const targetPalace = palaces.find(p => p.stars.some(s => s.starName === starName));
      if (targetPalace) {
        targetPalace.transformations.push({
          starName,
          transformation: t,
          label: labelMap[t],
        });
      }
    }
  }
}
