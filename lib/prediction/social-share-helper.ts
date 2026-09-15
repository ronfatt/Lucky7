// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Social Share Helper
// File: lib/prediction/social-share-helper.ts
// Generates beautifully formatted Emoji text for WhatsApp, WeChat, and Telegram
// ==========================================================

import type { BirthProfile } from '../../types/zwtsp.ts';
import type { WindfallWealthAnalysis } from '../engines/daily/windfall-wealth-engine.ts';
import type { LuckyClothingAdvice } from '../engines/daily/lucky-clothing-engine.ts';
import type { WealthDirectionGuide } from '../directions/wealth-direction-navigator.ts';

export interface SocialShareParams {
  profile: BirthProfile;
  dateStr: string;
  dayStemBranch: string;
  motherCode: string;
  score: number;
  windfallAnalysis: WindfallWealthAnalysis;
  clothingAdvice: LuckyClothingAdvice;
  directionGuide?: WealthDirectionGuide;
}

export class SocialShareHelper {
  /**
   * Formats social share text with emojis for WhatsApp, WeChat, or Telegram
   */
  public static generateShareText(params: SocialShareParams): string {
    const {
      profile,
      dateStr,
      dayStemBranch,
      motherCode,
      score,
      windfallAnalysis,
      clothingAdvice,
      directionGuide,
    } = params;

    const luckyColors = clothingAdvice.primaryColors.map((c) => c.name.split(' ')[0]).join(' / ');
    const primaryDir = directionGuide ? directionGuide.primaryNameZh.split(' ')[0] : '正南方';

    return `🎴【紫微时空数字推演 · 今日运势吉报】
📅 推算日期：${dateStr} (${dayStemBranch})
👤 命主：${profile.name} (${profile.gender === 'male' ? '乾造' : '坤造'})
--------------------------------
🎯 今日核心吉数：【 ${motherCode} 】
⭐ 数理契合指数：${score.toFixed(1)} / 100 分
💰 今日偏财运势：${windfallAnalysis.suitabilityZh}
⏰ 纳气最佳吉时：${windfallAnalysis.auspiciousHour}
🧭 财神生旺吉位：${primaryDir}
👕 今日开运穿搭：${luckyColors}
--------------------------------
📜 易经古训：“数往者顺，知来者逆，是故易逆数也。”
⚠️【理性敬告】易学象数推演仅供文化娱乐参考，博彩为独立随机事件，请量力而行，切勿沉迷！`;
  }

  /**
   * Copies social share text to user's clipboard
   */
  public static async copyToClipboard(text: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
