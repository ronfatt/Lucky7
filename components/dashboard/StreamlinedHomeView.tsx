// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Streamlined Home View
// File: components/dashboard/StreamlinedHomeView.tsx
// Direct, uncluttered, focused on 5 essential daily elements
// ==========================================================

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Coins,
  Shirt,
  Trophy,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
  Star,
  RefreshCw,
  Edit3,
  User,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Compass,
  Calendar,
  Layers,
  Moon,
  Share2,
  Calculator,
  History,
  MessageSquareShare,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import { useUserProfile } from '@/lib/profile/user-profile-store';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { WealthDirectionNavigator } from '@/lib/directions/wealth-direction-navigator';
import { RealitySignalStore } from '@/lib/signals/reality-signal-store';
import { DigitFeatureVectorEngine } from '@/lib/synthesis/digit-feature-vector-engine';
import { CandidateGenerationEngine } from '@/lib/synthesis/candidate-generation-engine';
import { MotherCodeEngine } from '@/lib/synthesis/mother-code-engine';
import { VariationCodeEngine } from '@/lib/synthesis/variation-code-engine';
import { WindfallWealthEngine } from '@/lib/engines/daily/windfall-wealth-engine';
import { LuckyClothingEngine } from '@/lib/engines/daily/lucky-clothing-engine';
import { MalaysiaLotteryProvider } from '@/lib/lottery/malaysia-provider';
import { LotteryPatternEngine } from '@/lib/lottery/lottery-pattern-engine';
import { SavedPredictionsStore } from '@/lib/prediction/saved-predictions-store';
import { SocialShareHelper } from '@/lib/prediction/social-share-helper';

import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import { MalaysianDrawHistoryModal } from '@/components/lottery/MalaysianDrawHistoryModal';
import { SavedPredictionsModal } from '@/components/prediction/SavedPredictionsModal';
import { DreamImageryDivinationModal } from '@/components/prediction/DreamImageryDivinationModal';
import { MetaphysicalPosterModal } from '@/components/prediction/MetaphysicalPosterModal';
import { DrawCountdownBanner } from '@/components/dashboard/DrawCountdownBanner';
import { WealthDirectionCompassCard } from '@/components/compass/WealthDirectionCompassCard';
import { BettingStrategyModal } from '@/components/prediction/BettingStrategyModal';
import { PredictionLedgerModal } from '@/components/prediction/PredictionLedgerModal';

export function StreamlinedHomeView() {
  const { profile, updateProfile } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-13');
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isReportCopied, setIsReportCopied] = useState<boolean>(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isDreamModalOpen, setIsDreamModalOpen] = useState<boolean>(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState<boolean>(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);

  // 1. Core Numerology & Astrology Pipeline
  const fourPillars = useMemo(() => FourPillarsEngine.calculateFourPillars(profile), [profile]);
  const ziweiChart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const personalDNA = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);
  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, ziweiChart, personalDNA);
  }, [fourPillars, ziweiChart, personalDNA]);

  const dailySig = useMemo(() => {
    return DailyEngine.generateDailySignature(selectedDate, profile.timezone);
  }, [selectedDate, profile.timezone, refreshCount]);

  const activePalaces = useMemo(() => {
    return DailyEngine.activatePalaces(ziweiChart, dailySig);
  }, [ziweiChart, dailySig]);

  const activeNumbers = useMemo(() => {
    return DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);
  }, [personalDNA, activePalaces, dailySig]);

  const dailyDirection = useMemo(() => {
    return DailyDirectionEngine.calculateDailyDirections(
      selectedDate,
      personalDirections,
      dailySig,
      activeNumbers,
      activePalaces
    );
  }, [selectedDate, personalDirections, dailySig, activeNumbers, activePalaces]);

  // 2. Windfall Wealth Assessment
  const windfallAnalysis = useMemo(() => {
    return WindfallWealthEngine.evaluateWindfall(ziweiChart, dailySig);
  }, [ziweiChart, dailySig]);

  // 3. Lucky Clothing Advice
  const clothingAdvice = useMemo(() => {
    return LuckyClothingEngine.calculateLuckyClothing(profile, dailySig, ziweiChart);
  }, [profile, dailySig, ziweiChart]);

  // 4. Mother Code Calculation (4-digit core number)
  const realitySignals = useMemo(() => RealitySignalStore.getSignals(), [refreshCount]);
  const vectors = useMemo(() => {
    return DigitFeatureVectorEngine.computeVectors(
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      dailySig.dominantElement
    );
  }, [personalDNA, activeNumbers, dailyDirection, realitySignals, dailySig.dominantElement]);

  const candidates = useMemo(() => {
    return CandidateGenerationEngine.generateCandidates(
      vectors,
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      20
    );
  }, [vectors, personalDNA, activeNumbers, dailyDirection, realitySignals]);

  const motherCode = useMemo(() => {
    return MotherCodeEngine.extractMotherCode(candidates);
  }, [candidates]);

  const variations = useMemo(() => {
    return VariationCodeEngine.generateVariations(motherCode.motherCode, motherCode.score, 12);
  }, [motherCode]);

  // 5. Historical Draw Records for this Mother Code
  const patternAnalysis = useMemo(() => {
    return LotteryPatternEngine.analyzePattern(motherCode.motherCode, 'ALL');
  }, [motherCode.motherCode]);

  const recentDrawMatches = useMemo(() => {
    return MalaysiaLotteryProvider.getRecentMatchesForNumber(motherCode.motherCode, 5, 'ALL');
  }, [motherCode.motherCode]);

  // 6. Wealth Direction & Outing Navigator
  const wealthGuide = useMemo(() => {
    return WealthDirectionNavigator.calculateGuide(
      dailyDirection,
      personalDirections,
      windfallAnalysis.auspiciousHour,
      windfallAnalysis.avoidHour
    );
  }, [dailyDirection, personalDirections, windfallAnalysis.auspiciousHour, windfallAnalysis.avoidHour]);

  // Actions
  const handleCopy = () => {
    navigator.clipboard.writeText(motherCode.motherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    SavedPredictionsStore.save({
      number: motherCode.motherCode,
      sourceType: 'MOTHER_CODE',
      sourceTitleZh: '主页当日核心母码',
      date: selectedDate,
      score: motherCode.score,
      notes: `干支【${dailySig.dayStemBranch}】推算，偏财指数 ${windfallAnalysis.score} 分`,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleShareReport = async () => {
    const text = SocialShareHelper.generateShareText({
      profile,
      dateStr: selectedDate,
      dayStemBranch: dailySig.dayStemBranch,
      motherCode: motherCode.motherCode,
      score: motherCode.score,
      windfallAnalysis,
      clothingAdvice,
      directionGuide: wealthGuide,
    });
    const success = await SocialShareHelper.copyToClipboard(text);
    if (success) {
      setIsReportCopied(true);
      setTimeout(() => setIsReportCopied(false), 2500);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshCount((prev) => prev + 1);
      setIsRefreshing(false);
    }, 400);
  };

  const isAvoidBetting =
    windfallAnalysis.suitability === 'STRICTLY_AVOID' ||
    windfallAnalysis.suitability === 'UNSUITABLE';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 19:00 Live Draw Countdown Banner */}
      <DrawCountdownBanner dateStr={selectedDate} />

      {/* 0. Top Navigation & User Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F1420]/90 border border-gold-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide">
                紫微时空数字预测 · 今日简报
              </h1>
              <Badge variant="outline" className="text-[10px] border-gold-500/40 text-gold-300">
                {dailySig.dayStemBranch}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <User className="w-3 h-3 text-gold-400" />
              <span>命主：{profile.name} ({profile.gender === 'male' ? '乾造' : '坤造'} · {clothingAdvice.userBureauZh})</span>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-gold-400 hover:text-gold-300 underline flex items-center gap-0.5 text-[11px]"
              >
                <Edit3 className="w-3 h-3" /> 修改命盘
              </button>
            </div>
          </div>
        </div>

        {/* Date Selector & Quick Feature Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#070A12] border border-slate-800 text-xs text-gold-300 px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50"
          />

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </Button>

          <Button
            onClick={() => setIsLedgerModalOpen(true)}
            variant="outline"
            className="px-2.5 py-1.5 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>灵验复盘</span>
          </Button>

          <Button
            onClick={() => setIsSavedModalOpen(true)}
            variant="outline"
            className="px-2.5 py-1.5 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>收藏夹</span>
          </Button>

          <Button
            onClick={() => setIsDreamModalOpen(true)}
            variant="outline"
            className="px-2.5 py-1.5 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>梦境起卦</span>
          </Button>

          <Button
            onClick={() => setIsPosterModalOpen(true)}
            variant="outline"
            className="px-2.5 py-1.5 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5 text-gold-400" />
            <span>运势海报</span>
          </Button>

          <Link
            href="/dashboard/prediction"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
          >
            <span>深度中枢</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 1. Core Focus: Giant 4-Digit Daily Number Card */}
      <Card className="bg-gradient-to-br from-[#101626] via-[#0C101A] to-[#070A12] border-gold-500/50 p-8 text-center relative overflow-hidden shadow-gold-glow">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>今日主打推算数字 · 核心母码 (4D)</span>
        </div>

        {/* The 4 Digits in Giant Luxury Font */}
        <div className="py-4">
          <div className="text-7xl sm:text-8xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-200 drop-shadow-[0_0_25px_rgba(234,179,8,0.35)] select-all">
            {motherCode.motherCode}
          </div>
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>综合气场契合度: <strong className="text-gold-300 font-mono text-base">{motherCode.score.toFixed(1)}</strong> 分</span>
            <span>·</span>
            <Badge variant="outline" className="border-gold-500/30 text-gold-300 text-[10px]">
              置信评级: {motherCode.confidence}
            </Badge>
          </div>
        </div>

        {/* Action Buttons for Number */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={handleCopy}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已复制号码</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制号码</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => setIsBettingModalOpen(true)}
            variant="outline"
            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>买法推荐 (RM2-RM10)</span>
          </Button>

          <Button
            onClick={handleShareReport}
            variant="outline"
            className="border-sky-500/40 text-sky-300 hover:bg-sky-500/10 text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            {isReportCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已复制吉报</span>
              </>
            ) : (
              <>
                <MessageSquareShare className="w-3.5 h-3.5" />
                <span>复制今日吉报</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleSave}
            variant="outline"
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已入收藏夹</span>
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>收藏心水</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 2, 3 & 4: Windfall Wealth, Lucky Clothing Colors & Wealth Compass (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. 当天的偏财运 */}
        <Card className={`p-6 border flex flex-col justify-between ${
          isAvoidBetting
            ? 'bg-gradient-to-br from-[#1A0F14] to-[#0A0709] border-rose-500/40'
            : 'bg-gradient-to-br from-[#0F1626] to-[#080D17] border-gold-500/30'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg border ${
                  isAvoidBetting
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-gold-500/20 text-gold-400 border-gold-500/40'
                }`}>
                  <Coins className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  今日偏财运势与投注宜忌
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${windfallAnalysis.suitabilityColor}`}>
                {windfallAnalysis.suitabilityZh}
              </span>
            </div>

            {/* Score & Verdict */}
            <div className="py-4 flex items-baseline gap-3">
              <div className="text-4xl font-mono font-black text-white">
                {windfallAnalysis.score}{' '}
                <span className="text-xs text-slate-500 font-normal">/ 100 分</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {windfallAnalysis.verdictAdvice}
              </p>
            </div>

            {/* Auspicious & Avoid Times */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#070A12]/80 border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">今日最佳吉时 (偏财纳气)</span>
                <strong className="text-emerald-300 font-mono text-xs mt-0.5 block">
                  {windfallAnalysis.auspiciousHour}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#070A12]/80 border border-rose-500/30">
                <span className="text-[10px] text-slate-400 block">忌动时段 (煞星冲耗)</span>
                <strong className="text-rose-300 font-mono text-xs mt-0.5 block">
                  {windfallAnalysis.avoidHour}
                </strong>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{windfallAnalysis.wealthPalaceSummary}</span>
            <Link
              href="/dashboard/prediction"
              className="text-gold-400 hover:text-gold-300 flex items-center gap-0.5"
            >
              <span>查看12时辰走势</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* 3. 适合穿什么颜色衣服 */}
        <Card className="bg-gradient-to-br from-[#101422] via-[#0B0F19] to-[#070A12] border-gold-500/30 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Shirt className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  今日开运穿衣与吉色搭配
                </h3>
              </div>
              <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-300">
                五行生旺：{clothingAdvice.dailyElementZh}气生发
              </Badge>
            </div>

            <p className="text-xs text-slate-300 py-3 leading-relaxed">
              {clothingAdvice.overallAdviceZh}
            </p>

            {/* Visual Color Chips */}
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">今日首选聚财色：</span>
                <div className="flex flex-wrap gap-2">
                  {clothingAdvice.primaryColors.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070A12] border border-slate-800"
                    >
                      <span className={`w-3.5 h-3.5 rounded-full shadow ${c.bgStyle}`} />
                      <span className="text-xs font-semibold text-white">{c.name}</span>
                      <span className="text-[10px] text-gold-300">({c.elementZh})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 mr-1">次选辅色:</span>
                  <span className="text-slate-300 font-medium">
                    {clothingAdvice.secondaryColors.map((c) => c.name).join('、')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-400/80 mr-1">今日忌穿:</span>
                  <span className="text-rose-300 font-medium">
                    {clothingAdvice.avoidColors.map((c) => c.name).join('、')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>饰品建议：{clothingAdvice.accessoryAdvice}</span>
          </div>
        </Card>

        {/* 4. 今日财位罗盘与出行吉时 */}
        <WealthDirectionCompassCard guide={wealthGuide} />
      </div>

      {/* 4. 该号码的过去中奖记录 (Lottery Winning Records) */}
      <Card className="bg-[#0B0F19]/95 border-gold-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                号码【{motherCode.motherCode}】历史中奖记录 (新马各大博彩公司)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                实时比对万能、大马彩、多多、砂拉越、沙巴、山打根、新加坡 7 大博彩真实开奖
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs font-mono">
              历史累计中出: {patternAnalysis.totalHits} 次
            </Badge>
            <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs font-mono">
              头二三等大奖: {patternAnalysis.top3Hits || 0} 次
            </Badge>
            <Badge variant="outline" className="border-blue-500/40 text-blue-300 text-xs font-mono">
              当前遗漏: {patternAnalysis.omissionStats?.currentOmission ?? 0} 期
            </Badge>
          </div>
        </div>

        {/* Compact Table of Nearest Hits */}
        {recentDrawMatches.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#070A12]/80">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-[#0c1017]">
                  <th className="py-2.5 px-3 font-semibold">开奖日期</th>
                  <th className="py-2.5 px-3 font-semibold">博彩平台</th>
                  <th className="py-2.5 px-3 font-semibold">命中奖项</th>
                  <th className="py-2.5 px-3 font-semibold">期号</th>
                  <th className="py-2.5 px-3 font-semibold text-right">出彩形态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentDrawMatches.map((m, idx) => (
                  <tr key={`${m.operator}-${m.drawDate}-${idx}`} className="hover:bg-slate-800/30 text-slate-300">
                    <td className="py-2 px-3">
                      <span className="text-white font-semibold">{m.drawDate}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5">({m.daysAgo}天前)</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold border ${m.badgeColor}`}>
                        {m.operatorNameZh}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans">
                      <span className={`font-semibold ${
                        m.tier === 'FIRST' ? 'text-amber-300' : m.tier === 'SECOND' ? 'text-blue-300' : 'text-emerald-300'
                      }`}>
                        {m.tierName}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">#{m.drawNo}</td>
                    <td className="py-2 px-3 text-right font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.matchType === 'DIRECT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {m.matchTypeZh}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#070A12]/40 border border-slate-800 text-center text-xs text-slate-500">
            该号码在当前统计窗口内暂无出彩记录，属于深冷储备组合。
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>{patternAnalysis.sameStemBranchStats?.summary || '与今日流日干支气场相合'}</span>
          <Button
            onClick={() => setIsHistoryModalOpen(true)}
            variant="outline"
            className="text-gold-300 border-gold-500/30 hover:bg-gold-500/10 text-xs py-1 px-3"
          >
            查看完整 100 条历史记录
          </Button>
        </div>
      </Card>

      {/* 5. 简单的分析这组号码是怎么推演的 (Simple Plain-Language Explanation) */}
      <Card className="bg-[#0B0F19]/95 border-gold-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <HelpCircle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              通俗解析 · 号码【{motherCode.motherCode}】是如何推演出来的？
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              摒弃复杂技术代码，用简单易懂的语言为您拆解这 4 个数字的生成逻辑
            </p>
          </div>
        </div>

        {/* 4 Plain-Language Explanation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Step 1: Natal DNA */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-gold-400 font-bold">
              <span>① 命盘基因 (DNA)</span>
              <span className="text-[10px] text-slate-500">占 25%</span>
            </div>
            <strong className="text-white block text-xs">从您的生辰八字取数</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              分析您紫微命盘【财帛宫】与【命宫】的吉祥主星，提取命中与您最具缘分的核心基底数字。
            </p>
          </div>

          {/* Step 2: Daily Transit */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>② 今日时空流日</span>
              <span className="text-[10px] text-slate-500">占 25%</span>
            </div>
            <strong className="text-white block text-xs">今日【{dailySig.dayStemBranch}】干支共振</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              根据今日天干地支运转，今日流日五行催生财星，激活当天感应最活跃的时空密码。
            </p>
          </div>

          {/* Step 3: Direction Resonance */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-purple-400 font-bold">
              <span>③ 九宫八方空间</span>
              <span className="text-[10px] text-slate-500">占 25%</span>
            </div>
            <strong className="text-white block text-xs">财神吉位：正南与西南</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              融合洛书九宫与八卦方位，将今日最佳纳气方向的吉祥数位注入组合之中。
            </p>
          </div>

          {/* Step 4: Plum Blossom Hexagram */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>④ 易经周易成卦</span>
              <span className="text-[10px] text-slate-500">占 25%</span>
            </div>
            <strong className="text-white block text-xs">《梅花易数》体用比和</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              遵循《易经》古训“数往者顺，知来者逆”，校准四位顺序，最终凝聚成今日核心吉数【{motherCode.motherCode}】。
            </p>
          </div>
        </div>

        {/* Classical Quote Banner */}
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 flex items-center justify-between">
          <span>“天下之事，皆有象数。见其象，则知其数；得其数，则决其吉凶。” —— 宋·邵康节《梅花易数》</span>
          <Link
            href="/dashboard/prediction"
            className="text-gold-400 hover:text-gold-300 underline shrink-0 ml-2"
          >
            探索完整推演模型
          </Link>
        </div>
      </Card>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onSave={(up) => updateProfile(up)}
      />

      <MalaysianDrawHistoryModal
        initialNumber={motherCode.motherCode}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <SavedPredictionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onInspectNumber={(num) => {
          // Open draw modal with selected
          setIsHistoryModalOpen(true);
        }}
      />

      <DreamImageryDivinationModal
        isOpen={isDreamModalOpen}
        onClose={() => setIsDreamModalOpen(false)}
      />

      <MetaphysicalPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        profile={profile}
        dateStr={selectedDate}
        motherCode={motherCode}
        variations={variations}
        windfallAnalysis={windfallAnalysis}
      />

      <BettingStrategyModal
        isOpen={isBettingModalOpen}
        onClose={() => setIsBettingModalOpen(false)}
        numberStr={motherCode.motherCode}
        windfallScore={windfallAnalysis.score}
      />

      <PredictionLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
      />

      {/* Safety Guard & Anti-Gambling Warning */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-[11px] text-slate-500 leading-relaxed">
        <strong>⚠️ 理性敬告：</strong>
        传统易理数理推演乃中华传统文化哲理模型，任何博彩开奖均为物理独立随机事件，无任何预测能保证中奖。
        请保持平常心态，量力而行，切勿沉迷赌博。
      </div>
    </div>
  );
}
