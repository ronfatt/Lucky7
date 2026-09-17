// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Windfall Wealth Engine
// File: lib/engines/daily/windfall-wealth-engine.ts
// Based on: 蔡明宏《楚皇紫微斗数高级理论》 & 钦天门四化财福气数
// ==========================================================

import type {
  DailyTimeSignature,
  ZiWeiChartData,
  ZiWeiPalaceInstance,
} from '../../../types/zwtsp.ts';
import { FOUR_TRANSFORMATIONS_BY_STEM } from '../ziwei/ziwei-engine.ts';
import { CalendarConversionEngine } from '../calendar/calendar-engine.ts';
import { DailyEngine } from './daily-engine.ts';
import { getRealtimeDate } from '../../utils/date-utils.ts';

export type WindfallSuitability = 'SUITABLE' | 'NEUTRAL' | 'UNSUITABLE' | 'STRICTLY_AVOID';

export interface WindfallWealthAnalysis {
  score: number; // 0 - 100
  level: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  suitability: WindfallSuitability;
  suitabilityZh: string;
  suitabilityColor: string;
  verdictTitle: string;
  verdictAdvice: string;
  auspiciousHour: string;
  avoidHour: string;
  keyInfluences: {
    type: 'BENEFIC' | 'MALEFIC' | 'TRANSFORMATION';
    star: string;
    palace: string;
    description: string;
    scoreEffect: number;
  }[];
  wealthPalaceSummary: string;
  fortunePalaceSummary: string;
  antiGamblingWarning: string;
}

export class WindfallWealthEngine {
  /**
   * Evaluates today's windfall wealth index (偏财运指数) and betting suitability
   * based on the user's Zi Wei chart and today's transit time signature
   */
  public static evaluateWindfall(
    chart: ZiWeiChartData,
    dailySig: DailyTimeSignature
  ): WindfallWealthAnalysis {
    // If chart is incomplete (unknown hour), return a conservative prudent evaluation
    if (!chart || !chart.isComplete || chart.palaces.length === 0) {
      return {
        score: 45,
        level: 'LOW',
        suitability: 'UNSUITABLE',
        suitabilityZh: '时辰未知 · 谨守为上',
        suitabilityColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        verdictTitle: '命盘时辰未知 · 财福气脉不显',
        verdictAdvice: '由于出生时辰未知，紫微斗数十二宫财帛宫与福德宫位置未定。依据传统象数心法，气机未明之时，切莫轻动妄念，今日不建议进行任何博彩投注。',
        auspiciousHour: '申时 (15:00 - 17:00)',
        avoidHour: '午时 (11:00 - 13:00)',
        keyInfluences: [
          {
            type: 'MALEFIC',
            star: '时辰未定',
            palace: '财帛/福德',
            description: '时柱未知导致流日干支四化无法精准定宫，气数以保守守成为主。',
            scoreEffect: -15,
          },
        ],
        wealthPalaceSummary: '时辰未定，财帛宫位置待校准',
        fortunePalaceSummary: '时辰未定，福德宫位置待校准',
        antiGamblingWarning: '所有博彩均为独立物理随机事件，传统易理推演仅供学术文化参考，切勿沉迷赌博。',
      };
    }

    const palaces = chart.palaces;
    const wealthPalace = palaces.find((p) => p.palaceName === '财帛宫');
    const fortunePalace = palaces.find((p) => p.palaceName === '福德宫');
    const lifePalace = palaces.find((p) => p.palaceName === '命宫');
    const propertyPalace = palaces.find((p) => p.palaceName === '田宅宫');

    // Extract Day Heavenly Stem from DailyTimeSignature (e.g. '戊子日' -> '戊')
    const dayStem = (dailySig.dayStemBranch?.charAt(0) || '丙') as keyof typeof FOUR_TRANSFORMATIONS_BY_STEM;
    const dailyTransforms = FOUR_TRANSFORMATIONS_BY_STEM[dayStem] || FOUR_TRANSFORMATIONS_BY_STEM['丙'];

    const luStar = dailyTransforms.Lu;   // 化禄
    const quanStar = dailyTransforms.Quan; // 化权
    const keStar = dailyTransforms.Ke;   // 化科
    const jiStar = dailyTransforms.Ji;   // 化忌

    let baseScore = 58; // Neutral baseline
    const influences: WindfallWealthAnalysis['keyInfluences'] = [];

    // Helper to check stars in palace
    const checkPalaceStars = (palace: ZiWeiPalaceInstance | undefined, palaceRole: string) => {
      if (!palace) return;
      const starNames = (palace.stars || []).map((s) => (s as any).starName || (s as any).name);

      // 1. Benefic wealth stars
      if (starNames.includes('武曲')) {
        baseScore += 8;
        influences.push({
          type: 'BENEFIC',
          star: '武曲',
          palace: palace.palaceName,
          description: `财星之尊坐守【${palace.palaceName}】，正财偏财皆有底气。`,
          scoreEffect: +8,
        });
      }
      if (starNames.includes('贪狼')) {
        baseScore += 10;
        influences.push({
          type: 'BENEFIC',
          star: '贪狼',
          palace: palace.palaceName,
          description: `偏财第一星坐守【${palace.palaceName}】，投机变动气场活跃。`,
          scoreEffect: +10,
        });
      }
      if (starNames.includes('天府')) {
        baseScore += 6;
        influences.push({
          type: 'BENEFIC',
          star: '天府',
          palace: palace.palaceName,
          description: `南斗禄库之王镇守【${palace.palaceName}】，蓄水聚财，防守坚实。`,
          scoreEffect: +6,
        });
      }
      if (starNames.includes('太阴')) {
        baseScore += 6;
        influences.push({
          type: 'BENEFIC',
          star: '太阴',
          palace: palace.palaceName,
          description: `富星太阴滋润【${palace.palaceName}】，水润金生，暗财滋长。`,
          scoreEffect: +6,
        });
      }

      // 2. Malefic drain stars (空劫煞星)
      if (starNames.includes('地空') || starNames.includes('地劫')) {
        baseScore -= 14;
        influences.push({
          type: 'MALEFIC',
          star: '地空/地劫',
          palace: palace.palaceName,
          description: `劫空截煞侵入【${palace.palaceName}】，半空折翅，主财气骤空、暗耗无常！`,
          scoreEffect: -14,
        });
      }
      if (starNames.includes('擎羊') || starNames.includes('陀罗')) {
        baseScore -= 10;
        influences.push({
          type: 'MALEFIC',
          star: '擎羊/陀罗',
          palace: palace.palaceName,
          description: `羊陀凶刃交战于【${palace.palaceName}】，恐有急躁亏损或是非暗耗。`,
          scoreEffect: -10,
        });
      }

      // 3. Daily Four Transformations (流日四化)
      if (starNames.includes(luStar)) {
        baseScore += 24;
        influences.push({
          type: 'TRANSFORMATION',
          star: `${luStar}化禄`,
          palace: palace.palaceName,
          description: `今日流日天干【${dayStem}】引动【${luStar}化禄】入【${palace.palaceName}】，偏财气运大盛，吉星高照！`,
          scoreEffect: +24,
        });
      }
      if (starNames.includes(quanStar)) {
        baseScore += 12;
        influences.push({
          type: 'TRANSFORMATION',
          star: `${quanStar}化权`,
          palace: palace.palaceName,
          description: `今日流日【${quanStar}化权】入【${palace.palaceName}】，决策果决，掌控力强。`,
          scoreEffect: +12,
        });
      }
      if (starNames.includes(keStar)) {
        baseScore += 8;
        influences.push({
          type: 'TRANSFORMATION',
          star: `${keStar}化科`,
          palace: palace.palaceName,
          description: `今日流日【${keStar}化科】入【${palace.palaceName}】，神清智明，贵人相顾。`,
          scoreEffect: +8,
        });
      }
      if (starNames.includes(jiStar)) {
        baseScore -= 32;
        influences.push({
          type: 'TRANSFORMATION',
          star: `${jiStar}化忌`,
          palace: palace.palaceName,
          description: `【凶格警示】今日流日【${jiStar}化忌】直冲【${palace.palaceName}】，破财败耗之兆，极忌投机博彩！`,
          scoreEffect: -32,
        });
      }
    };

    // Evaluate 财帛宫 (Wealth) & 福德宫 (Karma / Speculative Luck)
    checkPalaceStars(wealthPalace, '财帛宫');
    checkPalaceStars(fortunePalace, '福德宫');

    // Also check if Ji falls in opposite palace (e.g. 命宫 clashes 迁移宫, or 子女 clashes 田宅)
    // Clamping score between 12 and 98
    const finalScore = Math.min(98, Math.max(12, Math.round(baseScore)));

    let level: WindfallWealthAnalysis['level'] = 'MODERATE';
    let suitability: WindfallSuitability = 'NEUTRAL';
    let suitabilityZh = '运势平稳 · 量力而行';
    let suitabilityColor = 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    let verdictTitle = '今日偏财运平顺';
    let verdictAdvice = '今日财福气机无大煞亦无暴发大格，若有灵感契合仅宜微额理性娱乐，切忌贪恋追投。';

    if (finalScore >= 80) {
      level = 'VERY_HIGH';
      suitability = 'SUITABLE';
      suitabilityZh = '吉星拱财 · 适度把握';
      suitabilityColor = 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      verdictTitle = '今日偏财气场极佳（适合小试怡情）';
      verdictAdvice = '流日吉化星曜生旺财福线，灵感与数理共振显著。适合在今日吉时参考契合号码进行理性参与，不可骄纵。';
    } else if (finalScore >= 65) {
      level = 'HIGH';
      suitability = 'SUITABLE';
      suitabilityZh = '偏财通顺 · 顺势而为';
      suitabilityColor = 'text-gold-400 border-gold-500/50 bg-gold-500/10';
      verdictTitle = '今日偏财运良好';
      verdictAdvice = '气机和缓顺遂，偏财运势较佳，若有心仪契合数字可从容参考，保持平常心。';
    } else if (finalScore <= 42) {
      level = 'LOW';
      suitability = 'STRICTLY_AVOID';
      suitabilityZh = '大凶避赌 · 极不适合投注';
      suitabilityColor = 'text-rose-400 border-rose-500/50 bg-rose-500/10';
      verdictTitle = '【警告】今日财气大受制克 · 坚决不宜投注';
      verdictAdvice = '紫微斗数流日化忌或煞星直冲财福线！气数显现破耗、截流暗漏之象。传统心学严正告诫：今日切莫参与任何彩票与投机赌博，万不可抱侥幸心理，守财静观方为上策！';
    } else {
      level = 'MODERATE';
      suitability = 'UNSUITABLE';
      suitabilityZh = '吉凶互见 · 谨防暗耗';
      suitabilityColor = 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      verdictTitle = '今日偏财暗藏阻滞 · 不建议投注';
      verdictAdvice = '今日财星遇阻或有微煞耗损，气脉不纯。博彩输多赢少，极易引发冲动无谓损耗，建议克制欲望，休养生息。';
    }

    const wealthStarsDesc = (wealthPalace?.stars || []).map((s) => (s as any).starName || (s as any).name).join('、') || '无主星（借对宫）';
    const fortuneStarsDesc = (fortunePalace?.stars || []).map((s) => (s as any).starName || (s as any).name).join('、') || '无主星（借对宫）';

    return {
      score: finalScore,
      level,
      suitability,
      suitabilityZh,
      suitabilityColor,
      verdictTitle,
      verdictAdvice,
      auspiciousHour: finalScore >= 65 ? '申时 (15:00 - 17:00) · 财星纳气' : '无显著偏财吉时 (守成为上)',
      avoidHour: '午时 (11:00 - 13:00) · 烈煞冲耗',
      keyInfluences: influences.length > 0 ? influences : [
        {
          type: 'BENEFIC',
          star: '天梁/天相',
          palace: '三方四正',
          description: '流日星辰平和，财帛稳健守成。',
          scoreEffect: 0,
        },
      ],
      wealthPalaceSummary: `财帛宫位【${wealthPalace?.branch || '巳'}】：星曜【${wealthStarsDesc}】`,
      fortunePalaceSummary: `福德宫位【${fortunePalace?.branch || '亥'}】：星曜【${fortuneStarsDesc}】`,
      antiGamblingWarning: '【理性警示】紫微象数乃传统中华哲学运势推演模型，任何博彩开彩均为纯粹独立随机物理事件，无任何预测能保证获胜，切勿沉迷赌博，量力自制！',
    };
  }

  /**
   * Calculates 24-hour / 12 Chinese double-hours transit windfall fluctuation curve
   */
  public static calculate24HourCurve(
    chart: ZiWeiChartData,
    dailySig: DailyTimeSignature
  ): HourlyWindfallPoint[] {
    const dailyBase = this.evaluateWindfall(chart, dailySig).score;
    const dayStem = dailySig.dayStemBranch?.charAt(0) || '戊';

    const BRANCHES = [
      { branch: '子', nameZh: '子时', timeRange: '23:00 - 01:00' },
      { branch: '丑', nameZh: '丑时', timeRange: '01:00 - 03:00' },
      { branch: '寅', nameZh: '寅时', timeRange: '03:00 - 05:00' },
      { branch: '卯', nameZh: '卯时', timeRange: '05:00 - 07:00' },
      { branch: '辰', nameZh: '辰时', timeRange: '07:00 - 09:00' },
      { branch: '巳', nameZh: '巳时', timeRange: '09:00 - 11:00' },
      { branch: '午', nameZh: '午时', timeRange: '11:00 - 13:00' },
      { branch: '未', nameZh: '未时', timeRange: '13:00 - 15:00' },
      { branch: '申', nameZh: '申时', timeRange: '15:00 - 17:00' },
      { branch: '酉', nameZh: '酉时', timeRange: '17:00 - 19:00' },
      { branch: '戌', nameZh: '戌时', timeRange: '19:00 - 21:00' },
      { branch: '亥', nameZh: '亥时', timeRange: '21:00 - 23:00' },
    ];

    // Five Rats Seek Hour Stem (五鼠遁日起时诀)
    const STEM_START_MAP: Record<string, number> = {
      甲: 0, 己: 0, // 甲子
      乙: 2, 庚: 2, // 丙子
      丙: 4, 辛: 4, // 戊子
      丁: 6, 壬: 6, // 庚子
      戊: 8, 癸: 8, // 壬子
    };
    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const startStemIdx = STEM_START_MAP[dayStem] ?? 8;

    const points: HourlyWindfallPoint[] = BRANCHES.map((b, idx) => {
      const hourStem = STEMS[(startStemIdx + idx) % 10];
      const hourStemBranch = `${hourStem}${b.branch}`;
      const hourTransforms =
        FOUR_TRANSFORMATIONS_BY_STEM[hourStem as keyof typeof FOUR_TRANSFORMATIONS_BY_STEM] ||
        FOUR_TRANSFORMATIONS_BY_STEM['丙'];

      // Hourly modulation algorithm:
      // If hour stem matches wealth Lu, boost score
      // If hour stem triggers Ji on Wealth/Fortune, drop score
      let delta = 0;
      let title = `${b.nameZh} · 运势平稳`;
      let description = `流时干支【${hourStemBranch}】，气机循常，不宜大动。`;

      // Specific traditional favorable hours for wealth (申/酉/辰/巳)
      if (b.branch === '申') {
        delta += 14;
        title = `${b.nameZh} · 金水相生 (财星纳气)`;
        description = `申时金旺生水，流时四化【${hourTransforms.Lu}化禄】入照，为今日偏财运峰值吉时。`;
      } else if (b.branch === '辰') {
        delta += 10;
        title = `${b.nameZh} · 水库蓄财 (灵感汇聚)`;
        description = `辰土为水之库，流时【${hourTransforms.Quan}化权】生旺，利于数字逻辑推演。`;
      } else if (b.branch === '巳') {
        delta += 8;
        title = `${b.nameZh} · 驿马金生 (偏财暗动)`;
        description = `巳火生土，变动机运活跃，适宜关注突发灵感号码。`;
      } else if (b.branch === '午') {
        delta -= 16;
        title = `${b.nameZh} · 烈煞冲刑 (大忌投注)`;
        description = `午火极燥，冲克日支金水脉络，流时【${hourTransforms.Ji}化忌】见煞，气机耗散，严禁动念。`;
      } else if (b.branch === '卯') {
        delta -= 9;
        title = `${b.nameZh} · 气机未定 (谨守为上)`;
        description = `破耗星隐现，思绪易受外界杂音干扰，不宜投注。`;
      } else if (b.branch === '酉') {
        delta += 6;
        title = `${b.nameZh} · 酉金成器 (正偏互济)`;
        description = `酉时兑金主收敛，适宜对推演结果进行收尾复核。`;
      }

      const score = Math.min(99, Math.max(10, Math.round(dailyBase + delta)));
      let status: 'AUSPICIOUS' | 'NEUTRAL' | 'AVOID' = 'NEUTRAL';
      if (score >= 70) status = 'AUSPICIOUS';
      else if (score <= 45) status = 'AVOID';

      return {
        branch: b.branch,
        nameZh: b.nameZh,
        timeRange: b.timeRange,
        hourStemBranch,
        score,
        status,
        title,
        description,
        isBest: false,
        isWorst: false,
      };
    });

    // Mark best and worst
    let maxIdx = 0;
    let minIdx = 0;
    points.forEach((p, i) => {
      if (p.score > points[maxIdx].score) maxIdx = i;
      if (p.score < points[minIdx].score) minIdx = i;
    });
    points[maxIdx].isBest = true;
    points[minIdx].isWorst = true;

    return points;
  }

  /**
   * Calculates next 7 days' windfall wealth forecast highlighting Malaysian draw days
   */
  public static calculate7DayDrawForecast(
    chart: ZiWeiChartData,
    startDateStr: string = getRealtimeDate()
  ): DrawDayForecastItem[] {
    const startDate = new Date(startDateStr);
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const forecast: DrawDayForecastItem[] = [];

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + i);

      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, '0');
      const d = String(targetDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday...
      const dayName = dayNames[dayOfWeek];

      // Draw day rules for Malaysia & Singapore:
      // Wed (3), Sat (6), Sun (0) are standard main draw days
      // Tue (2) is special draw day
      let isDrawDay = false;
      let drawTypeZh = '非开彩日 (修养蓄力)';
      if (dayOfWeek === 3 || dayOfWeek === 6 || dayOfWeek === 0) {
        isDrawDay = true;
        drawTypeZh = '常规定期开彩日';
      } else if (dayOfWeek === 2) {
        isDrawDay = true;
        drawTypeZh = '特别开彩日 (Special Draw)';
      }

      // Astronomical day stem & branch calculation
      const fourPillars = CalendarConversionEngine.getFourPillars(dateStr, '10:00:00', true);
      const dayStemBranch = `${fourPillars.dayStem}${fourPillars.dayBranch}日`;

      // Genuine windfall evaluation against that date's dynamic signature
      const dailySig = DailyEngine.generateDailySignature(dateStr);
      const dayEval = chart && chart.palaces && chart.palaces.length > 0 ? this.evaluateWindfall(chart, dailySig) : null;

      let score = dayEval ? dayEval.score : 55 + ((i * 7 + 3) % 35);
      if (isDrawDay && dayOfWeek === 3) score += 4; // Wednesday draw boost

      score = Math.min(96, Math.max(25, score));

      const suitability = dayEval ? dayEval.suitability : (score >= 70 ? 'SUITABLE' : score <= 45 ? 'UNSUITABLE' : 'NEUTRAL');
      const suitabilityZh = dayEval ? dayEval.suitabilityZh : (score >= 70 ? '吉星拱照 · 适度参与' : score <= 45 ? '阻滞暗耗 · 谨守为宜' : '运势平和 · 随缘参考');
      const advice = dayEval ? dayEval.verdictAdvice : '气运清明，心态放平，可小试心水号码。';

      forecast.push({
        date: dateStr,
        dayOfWeekZh: dayName,
        dayStemBranch,
        isDrawDay,
        drawTypeZh,
        score,
        suitability,
        suitabilityZh,
        advice,
      });
    }

    return forecast;
  }
}

export interface HourlyWindfallPoint {
  branch: string;
  nameZh: string;
  timeRange: string;
  hourStemBranch: string;
  score: number;
  status: 'AUSPICIOUS' | 'NEUTRAL' | 'AVOID';
  title: string;
  description: string;
  isBest: boolean;
  isWorst: boolean;
}

export interface DrawDayForecastItem {
  date: string;
  dayOfWeekZh: string;
  dayStemBranch: string;
  isDrawDay: boolean;
  drawTypeZh: string;
  score: number;
  suitability: WindfallSuitability;
  suitabilityZh: string;
  advice: string;
}
