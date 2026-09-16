// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 会员每日推演数字通用运算引擎
// File: lib/prediction/member-daily-calculator.ts
// Computes or retrieves deterministic 4-digit mother code & predictions for any member & date
// ==========================================================

import type { BirthProfile } from '@/types/zwtsp';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { RealitySignalStore } from '@/lib/signals/reality-signal-store';
import { DigitFeatureVectorEngine } from '@/lib/synthesis/digit-feature-vector-engine';
import { CandidateGenerationEngine } from '@/lib/synthesis/candidate-generation-engine';
import { MotherCodeEngine } from '@/lib/synthesis/mother-code-engine';
import { VariationCodeEngine } from '@/lib/synthesis/variation-code-engine';
import { WindfallWealthEngine } from '@/lib/engines/daily/windfall-wealth-engine';
import { LuckyClothingEngine } from '@/lib/engines/daily/lucky-clothing-engine';
import { WealthDirectionNavigator } from '@/lib/directions/wealth-direction-navigator';
import { LotteryHitEngine, type DailyDrawHitReport } from '@/lib/lottery/lottery-hit-engine';

export interface MemberDailyPrediction {
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  dayStemBranch: string;
  lunarDateStr: string;
  motherCode: string;
  confidence: string;
  score: number;
  windfallScore: number;
  windfallSuitability: string;
  auspiciousHour: string;
  wealthDirection: string;
  luckyColor: string;
  colorReason: string;
  variations: string[];
  isSaved?: boolean;
  hasHit?: boolean;
  hitStatus?: DailyDrawHitReport;
  viewCount?: number;
}

export class MemberDailyCalculator {
  /**
   * Calculate deterministic prediction for a user profile on a given date
   */
  public static calculate(
    profile: {
      id?: string;
      email?: string;
      name?: string;
      gender?: string;
      birth_date?: string;
      birth_time?: string;
      timezone?: string;
    },
    dateStr: string
  ): MemberDailyPrediction {
    const birthProfile: BirthProfile = {
      name: profile.name || '命主',
      gender: (profile.gender as any) === 'female' ? 'female' : 'male',
      birthDate: profile.birth_date || '1990-05-18',
      birthTime: profile.birth_time || '09:30:00',
      birthTimePrecision: 'EXACT',
      timezone: profile.timezone || 'Asia/Kuala_Lumpur',
      calendarType: 'gregorian',
    };

    // 1. Calculate Base Astrological & Numerological Parameters
    const fourPillars = FourPillarsEngine.calculateFourPillars(birthProfile);
    const ziweiChart = ZiWeiEngine.generateChart(birthProfile);
    const personalDNA = PersonalNumberDNAEngine.generateDNA(birthProfile);

    // 2. Daily Signature & Activation
    const dailySig = DailyEngine.generateDailySignature(dateStr, birthProfile.timezone);
    const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
    const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);

    // 3. Directions
    const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
      fourPillars,
      ziweiChart,
      personalDNA
    );
    const dailyDirection = DailyDirectionEngine.calculateDailyDirections(
      dateStr,
      personalDirections,
      dailySig,
      activeNumbers,
      activePalaces
    );

    // 4. Reality Signals & Synthesis (Scoped to member's own observations)
    const realitySignals = profile.id ? RealitySignalStore.getSignals(dateStr, profile.id) : [];
    const vectors = DigitFeatureVectorEngine.computeVectors(
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      dailySig.dominantElement
    );

    const candidates = CandidateGenerationEngine.generateCandidates(
      vectors,
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      20,
      fourPillars,
      birthProfile.birthDate
    );

    const motherCodeObj = MotherCodeEngine.extractMotherCode(candidates);
    const variations = VariationCodeEngine.generateVariations(
      motherCodeObj.motherCode,
      motherCodeObj.score,
      12
    );

    // 5. Windfall & Clothing advice
    const windfallAnalysis = WindfallWealthEngine.evaluateWindfall(
      ziweiChart,
      dailySig
    );

    const clothingAdvice = LuckyClothingEngine.calculateLuckyClothing(
      birthProfile,
      dailySig,
      ziweiChart
    );

    const wealthGuide = WealthDirectionNavigator.calculateGuide(
      dailyDirection,
      personalDirections,
      windfallAnalysis.auspiciousHour,
      windfallAnalysis.avoidHour
    );

    // 6. Cross-platform Lottery Hit Check
    const hitReport = LotteryHitEngine.checkHitsForDate(
      dateStr,
      motherCodeObj.motherCode,
      variations.map((v) => v.resultNumber)
    );

    return {
      userId: profile.id || '',
      userEmail: profile.email || '',
      userName: profile.name || '命主',
      date: dateStr,
      dayStemBranch: dailySig.dayStemBranch,
      lunarDateStr: `${dailySig.dayStemBranch}日`,
      motherCode: motherCodeObj.motherCode,
      confidence: motherCodeObj.confidence,
      score: Number(motherCodeObj.score.toFixed(1)),
      windfallScore: windfallAnalysis.score,
      windfallSuitability: windfallAnalysis.suitabilityZh,
      auspiciousHour: windfallAnalysis.auspiciousHour,
      wealthDirection: wealthGuide.primaryNameZh,
      luckyColor: clothingAdvice.primaryColors?.[0]?.name || '金色',
      colorReason: clothingAdvice.overallAdviceZh,
      variations: variations.map((v) => v.resultNumber),
      hasHit: hitReport.hasHit,
      hitStatus: hitReport,
    };
  }
}
