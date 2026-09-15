// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Lucky Clothing & Color Engine
// File: lib/engines/daily/lucky-clothing-engine.ts
// Based on: 传统干支纳音与五行生旺穿搭开运心法
// ==========================================================

import type {
  DailyTimeSignature,
  FiveElement,
  BirthProfile,
  ZiWeiChartData,
} from '../../../types/zwtsp.ts';

export interface ColorItem {
  name: string;
  category: 'PRIMARY' | 'SECONDARY' | 'AVOID';
  hex: string;
  bgStyle: string;
  borderStyle: string;
  textColor: string;
  element: FiveElement;
  elementZh: string;
  description: string;
}

export interface LuckyClothingAdvice {
  date: string;
  dayStemBranch: string;
  dailyElement: FiveElement;
  dailyElementZh: string;
  userBureauZh: string;
  primaryColors: ColorItem[];
  secondaryColors: ColorItem[];
  avoidColors: ColorItem[];
  accessoryAdvice: string;
  overallAdviceZh: string;
}

const STEM_ELEMENT_MAP: Record<string, FiveElement> = {
  甲: 'Wood', 乙: 'Wood',
  丙: 'Fire', 丁: 'Fire',
  戊: 'Earth', 己: 'Earth',
  庚: 'Metal', 辛: 'Metal',
  壬: 'Water', 癸: 'Water',
};

const ELEMENT_ZH_MAP: Record<FiveElement, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水',
};

export class LuckyClothingEngine {
  /**
   * Calculates today's lucky clothing colors and style recommendations
   * based on the user's birth profile / bureau and today's transit stem-branch
   */
  public static calculateLuckyClothing(
    profile: BirthProfile,
    dailySig: DailyTimeSignature,
    chart?: ZiWeiChartData
  ): LuckyClothingAdvice {
    const dayStem = dailySig.dayStemBranch?.charAt(0) || '戊';
    const transitElement: FiveElement = STEM_ELEMENT_MAP[dayStem] || 'Earth';
    const bureauZh = chart?.bureau || '水二局';

    // Extract bureau element (e.g. "水二局" -> Water)
    let userElement: FiveElement = 'Water';
    if (bureauZh.includes('木')) userElement = 'Wood';
    else if (bureauZh.includes('火')) userElement = 'Fire';
    else if (bureauZh.includes('土')) userElement = 'Earth';
    else if (bureauZh.includes('金')) userElement = 'Metal';
    else if (bureauZh.includes('水')) userElement = 'Water';

    // Standard Five Elements Palette definitions:
    // Gold/Metal: White, Silver, Light Gold, Champagne
    // Wood: Green, Emerald, Olive, Mint
    // Water: Black, Navy Blue, Deep Blue, Charcoal
    // Fire: Red, Burgundy, Purple, Orange
    // Earth: Yellow, Khaki, Camel, Earth Tones, Brown

    let primaryColors: ColorItem[] = [];
    let secondaryColors: ColorItem[] = [];
    let avoidColors: ColorItem[] = [];
    let accessoryAdvice = '';
    let overallAdviceZh = '';

    // Logic:
    // When transit is Earth (戊/己):
    // Earth generates Metal (土生金), Fire generates Earth (火生土), Wood overcomes Earth (木克土)
    if (transitElement === 'Earth') {
      primaryColors = [
        {
          name: '金色 / 纯白色 / 银灰色',
          category: 'PRIMARY',
          hex: '#EAB308',
          bgStyle: 'bg-gradient-to-r from-amber-400 to-yellow-200',
          borderStyle: 'border-yellow-400/50',
          textColor: 'text-yellow-300',
          element: 'Metal',
          elementZh: '金',
          description: '流日戊土生金，金气通达，催生偏财纳气',
        },
        {
          name: '大地黄 / 暖卡其色 / 焦糖色',
          category: 'PRIMARY',
          hex: '#D97706',
          bgStyle: 'bg-gradient-to-r from-yellow-600 to-amber-700',
          borderStyle: 'border-amber-500/50',
          textColor: 'text-amber-300',
          element: 'Earth',
          elementZh: '土',
          description: '比和同旺，厚德载福，稳固财库底气',
        },
      ];

      secondaryColors = [
        {
          name: '玄黑 / 深藏青色',
          category: 'SECONDARY',
          hex: '#1E293B',
          bgStyle: 'bg-slate-800',
          borderStyle: 'border-slate-700',
          textColor: 'text-slate-300',
          element: 'Water',
          elementZh: '水',
          description: '金生水旺，润泽灵感，利于直觉推演',
        },
      ];

      avoidColors = [
        {
          name: '翠绿 / 墨绿色 / 军绿',
          category: 'AVOID',
          hex: '#15803D',
          bgStyle: 'bg-emerald-900',
          borderStyle: 'border-emerald-700',
          textColor: 'text-emerald-400',
          element: 'Wood',
          elementZh: '木',
          description: '木克流日戊土，易惹口舌阻滞与杂念暗耗',
        },
      ];

      accessoryAdvice = '今日首选搭配金属腕表、金银饰品或黄色系皮具，有助于生发今日流日财星之气。';
      overallAdviceZh = `今日为【${dailySig.dayStemBranch}】，天干${dayStem}土当令。今日穿搭首选金色、白色或大地黄色系，土金相生，大旺偏财灵感；今日忌大面积穿着翠绿色，以免木克日土耗损财气。`;
    } else if (transitElement === 'Metal') {
      primaryColors = [
        {
          name: '黑色 / 藏青 / 深蓝色',
          category: 'PRIMARY',
          hex: '#0F172A',
          bgStyle: 'bg-slate-900',
          borderStyle: 'border-blue-500/50',
          textColor: 'text-blue-300',
          element: 'Water',
          elementZh: '水',
          description: '金水相生，智慧通达，灵感源源不断',
        },
        {
          name: '白银 / 象牙白',
          category: 'PRIMARY',
          hex: '#F8FAFC',
          bgStyle: 'bg-slate-200',
          borderStyle: 'border-white/50',
          textColor: 'text-white',
          element: 'Metal',
          elementZh: '金',
          description: '金气纯粹，收敛聚精，提升决策专注力',
        },
      ];
      secondaryColors = [
        {
          name: '米色 / 浅棕',
          category: 'SECONDARY',
          hex: '#B45309',
          bgStyle: 'bg-amber-800',
          borderStyle: 'border-amber-600',
          textColor: 'text-amber-200',
          element: 'Earth',
          elementZh: '土',
          description: '土生金旺，源泉不竭',
        },
      ];
      avoidColors = [
        {
          name: '大红 / 亮粉 / 亮紫',
          category: 'AVOID',
          hex: '#DC2626',
          bgStyle: 'bg-rose-900',
          borderStyle: 'border-rose-700',
          textColor: 'text-rose-400',
          element: 'Fire',
          elementZh: '火',
          description: '火克流日之金，燥烈伤气，冲动破财',
        },
      ];
      accessoryAdvice = '今日宜搭配蓝宝石、黑曜石或银质挂饰，流通金水财气。';
      overallAdviceZh = `今日为【${dailySig.dayStemBranch}】，金气肃穆，首选黑白蓝深色系，以金生水催旺偏财灵感；忌穿大红大紫。`;
    } else if (transitElement === 'Water') {
      primaryColors = [
        {
          name: '墨绿 / 翠绿 / 森林绿',
          category: 'PRIMARY',
          hex: '#16A34A',
          bgStyle: 'bg-emerald-700',
          borderStyle: 'border-emerald-500/50',
          textColor: 'text-emerald-300',
          element: 'Wood',
          elementZh: '木',
          description: '水生木发，欣欣向荣，生机蓬勃聚气',
        },
        {
          name: '纯白 / 银灰',
          category: 'PRIMARY',
          hex: '#E2E8F0',
          bgStyle: 'bg-slate-300',
          borderStyle: 'border-slate-400',
          textColor: 'text-slate-200',
          element: 'Metal',
          elementZh: '金',
          description: '金生丽水，源远流长，生旺本元',
        },
      ];
      secondaryColors = [
        {
          name: '幽黑 / 深靛蓝',
          category: 'SECONDARY',
          hex: '#020617',
          bgStyle: 'bg-black',
          borderStyle: 'border-slate-800',
          textColor: 'text-slate-400',
          element: 'Water',
          elementZh: '水',
          description: '水势充盈，顺水推舟',
        },
      ];
      avoidColors = [
        {
          name: '土黄 / 棕褐 / 咖啡色',
          category: 'AVOID',
          hex: '#78350F',
          bgStyle: 'bg-amber-950',
          borderStyle: 'border-amber-800',
          textColor: 'text-amber-500',
          element: 'Earth',
          elementZh: '土',
          description: '土阻水势，泥泞滞涩，财路受阻',
        },
      ];
      accessoryAdvice = '今日适宜佩戴檀木、菩提手串或白金饰品。';
      overallAdviceZh = `今日为【${dailySig.dayStemBranch}】，水气丰沛，穿戴绿色与白色系最能引动生机与贵人相助；避免土黄色系。`;
    } else if (transitElement === 'Wood') {
      primaryColors = [
        {
          name: '朱红 / 暖橙 / 紫罗兰',
          category: 'PRIMARY',
          hex: '#EA580C',
          bgStyle: 'bg-orange-600',
          borderStyle: 'border-orange-500/50',
          textColor: 'text-orange-300',
          element: 'Fire',
          elementZh: '火',
          description: '木生火旺，点燃灵觉，炎上致吉',
        },
        {
          name: '青绿 / 草绿',
          category: 'PRIMARY',
          hex: '#22C55E',
          bgStyle: 'bg-emerald-600',
          borderStyle: 'border-emerald-400/50',
          textColor: 'text-emerald-300',
          element: 'Wood',
          elementZh: '木',
          description: '同气相求，精神爽利',
        },
      ];
      secondaryColors = [
        {
          name: '黑色 / 深蓝',
          category: 'SECONDARY',
          hex: '#1E293B',
          bgStyle: 'bg-slate-800',
          borderStyle: 'border-slate-700',
          textColor: 'text-slate-300',
          element: 'Water',
          elementZh: '水',
          description: '水润木长，厚积薄发',
        },
      ];
      avoidColors = [
        {
          name: '银白 / 金灰',
          category: 'AVOID',
          hex: '#94A3B8',
          bgStyle: 'bg-slate-500',
          borderStyle: 'border-slate-400',
          textColor: 'text-slate-300',
          element: 'Metal',
          elementZh: '金',
          description: '金伐秀木，易破损财脉',
        },
      ];
      accessoryAdvice = '今日适宜佩戴红玛瑙、朱砂手串或红绳饰品，引燃偏财。';
      overallAdviceZh = `今日为【${dailySig.dayStemBranch}】，木气腾发，穿戴红紫色或绿色系生旺气机；避免纯白银灰金系衣服。`;
    } else {
      // Fire
      primaryColors = [
        {
          name: '暖黄 / 驼色 / 卡其',
          category: 'PRIMARY',
          hex: '#F59E0B',
          bgStyle: 'bg-amber-500',
          borderStyle: 'border-amber-400/50',
          textColor: 'text-amber-200',
          element: 'Earth',
          elementZh: '土',
          description: '火生土旺，沉稳受纳，化躁为财',
        },
        {
          name: '红色 / 嫣红',
          category: 'PRIMARY',
          hex: '#E11D48',
          bgStyle: 'bg-rose-600',
          borderStyle: 'border-rose-400/50',
          textColor: 'text-rose-200',
          element: 'Fire',
          elementZh: '火',
          description: '烈火生辉，气势如虹',
        },
      ];
      secondaryColors = [
        {
          name: '翠绿 / 青色',
          category: 'SECONDARY',
          hex: '#10B981',
          bgStyle: 'bg-emerald-500',
          borderStyle: 'border-emerald-400',
          textColor: 'text-emerald-200',
          element: 'Wood',
          elementZh: '木',
          description: '木火通明，清澈明辨',
        },
      ];
      avoidColors = [
        {
          name: '纯黑 / 深黑蓝',
          category: 'AVOID',
          hex: '#020617',
          bgStyle: 'bg-black',
          borderStyle: 'border-slate-800',
          textColor: 'text-slate-500',
          element: 'Water',
          elementZh: '水',
          description: '水火相激，极易产生焦躁与判断失误',
        },
      ];
      accessoryAdvice = '今日适宜搭配蜜蜡、黄水晶或暖色宝石，敛火生财。';
      overallAdviceZh = `今日为【${dailySig.dayStemBranch}】，火气炽热，穿黄色或暖色系能收纳化泄为财；切忌大面积黑色。`;
    }

    return {
      date: dailySig.gregorianDate,
      dayStemBranch: dailySig.dayStemBranch,
      dailyElement: transitElement,
      dailyElementZh: ELEMENT_ZH_MAP[transitElement],
      userBureauZh: bureauZh,
      primaryColors,
      secondaryColors,
      avoidColors,
      accessoryAdvice,
      overallAdviceZh,
    };
  }
}
