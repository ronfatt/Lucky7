// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Prediction Dashboard View
// File: components/prediction/PredictionDashboardView.tsx
// ==========================================================

'use client';

import React, { useState, useMemo } from 'react';
import type {
  BirthProfile,
  DailyDirectionResult,
  DailyNumberActivation,
  DailyTimeSignature,
  DigitFeatureVector,
  MotherCodeResult,
  PersonalNumberDNA,
  PredictionCandidate,
  RealitySignalRecord,
  VariationCodeRecord,
} from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Layers,
  Clock,
  Compass,
  FileText,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Hash,
  ShieldAlert,
  Trophy,
  BookMarked,
  Edit3,
  User,
} from 'lucide-react';
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
import { PredictionDataQualityEngine } from '@/lib/synthesis/prediction-quality-engine';
import { ModelConsistencyEngine } from '@/lib/synthesis/model-consistency-engine';
import { NumberExplanationEngine } from '@/lib/synthesis/number-explanation-engine';
import { MalaysianDrawHistoryModal } from '@/components/lottery/MalaysianDrawHistoryModal';
import { CitationEngine } from '@/lib/literature/citation-engine';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import {
  WindfallWealthEngine,
  HourlyWindfallPoint,
  DrawDayForecastItem,
} from '@/lib/engines/daily/windfall-wealth-engine';
import { WindfallWealthCard } from '@/components/prediction/WindfallWealthCard';
import { RecentDrawMatchesTable } from '@/components/prediction/RecentDrawMatchesTable';
import { SavedPredictionsStore } from '@/lib/prediction/saved-predictions-store';
import { SavedPredictionsModal } from '@/components/prediction/SavedPredictionsModal';
import { DreamImageryDivinationModal } from '@/components/prediction/DreamImageryDivinationModal';
import { MetaphysicalPosterModal } from '@/components/prediction/MetaphysicalPosterModal';
import {
  Star,
  Moon,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { getRealtimeDate } from '@/lib/utils/date-utils';

interface PredictionDashboardViewProps {
  profile: BirthProfile;
  initialDate?: string;
}

export function PredictionDashboardView({
  profile: propProfile,
  initialDate,
}: PredictionDashboardViewProps) {
  const { profile: storedProfile, updateProfile } = useUserProfile();
  const profile = storedProfile || propProfile;

  const activeInitial = initialDate || getRealtimeDate(profile?.timezone);
  const [selectedDate, setSelectedDate] = useState<string>(activeInitial);
  const [topLimit, setTopLimit] = useState<number>(10);
  const [selectedCandidate, setSelectedCandidate] = useState<PredictionCandidate | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [historyQueryNumber, setHistoryQueryNumber] = useState<string>('5729');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // New Optimization Modals State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isDreamModalOpen, setIsDreamModalOpen] = useState<boolean>(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false);
  const [savedSuccessNum, setSavedSuccessNum] = useState<string | null>(null);

  // 1. Static Personal Pipeline
  const fourPillars = useMemo(() => FourPillarsEngine.calculateFourPillars(profile), [profile]);
  const ziweiChart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const personalDNA = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);
  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, ziweiChart, personalDNA);
  }, [fourPillars, ziweiChart, personalDNA]);

  // 2. Dynamic Daily Pipeline
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

  // 3. Purple Star Windfall Wealth Analysis (偏财运指数与投注宜忌)
  const windfallAnalysis = useMemo(() => {
    return WindfallWealthEngine.evaluateWindfall(ziweiChart, dailySig);
  }, [ziweiChart, dailySig]);

  // 3.1 Hourly Windfall Fluctuation Curve (24小时12时辰)
  const hourlyPoints: HourlyWindfallPoint[] = useMemo(() => {
    return WindfallWealthEngine.calculate24HourCurve(ziweiChart, dailySig);
  }, [ziweiChart, dailySig]);

  // 3.2 7-Day Draw Calendar & Windfall Forecast (未来7天开彩周报)
  const weeklyForecast: DrawDayForecastItem[] = useMemo(() => {
    return WindfallWealthEngine.calculate7DayDrawForecast(ziweiChart, selectedDate);
  }, [ziweiChart, selectedDate]);

  // Helper to save favorite number
  const handleSaveFavorite = (num: string, title: string, score: number, notes?: string) => {
    SavedPredictionsStore.save({
      number: num,
      sourceType: num === motherCode?.motherCode ? 'MOTHER_CODE' : 'CANDIDATE',
      sourceTitleZh: title,
      date: selectedDate,
      score,
      notes: notes || `日干支【${dailySig.dayStemBranch}】推演契合号码`,
    });
    setSavedSuccessNum(num);
    setTimeout(() => setSavedSuccessNum(null), 2500);
  };

  // 4. Reality Signals (User Observations)
  const realitySignals = useMemo(() => {
    return RealitySignalStore.getSignals();
  }, [refreshCount]);

  // 5. Digit Feature Vector Matrix (0-9)
  const vectors: DigitFeatureVector[] = useMemo(() => {
    return DigitFeatureVectorEngine.computeVectors(
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      dailySig.dominantElement
    );
  }, [personalDNA, activeNumbers, dailyDirection, realitySignals, dailySig.dominantElement]);

  // 6. Synthesis: Candidate Generation & Mother Code
  const candidates: PredictionCandidate[] = useMemo(() => {
    return CandidateGenerationEngine.generateCandidates(
      vectors,
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      50
    );
  }, [vectors, personalDNA, activeNumbers, dailyDirection, realitySignals]);

  const motherCode: MotherCodeResult = useMemo(() => {
    return MotherCodeEngine.extractMotherCode(candidates);
  }, [candidates]);

  const variations: VariationCodeRecord[] = useMemo(() => {
    return VariationCodeEngine.generateVariations(motherCode.motherCode, motherCode.score, 24);
  }, [motherCode]);

  const quality = useMemo(() => {
    return PredictionDataQualityEngine.evaluateDataQuality(
      personalDNA,
      dailySig,
      dailyDirection,
      realitySignals
    );
  }, [personalDNA, dailySig, dailyDirection, realitySignals]);

  const consistency = useMemo(() => {
    return ModelConsistencyEngine.evaluateConsistency(
      vectors,
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals
    );
  }, [vectors, personalDNA, activeNumbers, dailyDirection, realitySignals]);

  const motherCodeCitations = useMemo(() => {
    return CitationEngine.matchCitationsForNumber(
      motherCode.motherCode,
      dailySig.dominantElement
    );
  }, [motherCode.motherCode, dailySig.dominantElement]);

  const displayedCandidates = candidates.slice(0, topLimit);

  const handleRefreshCalculation = () => {
    setIsRefreshing(true);
    setRefreshCount((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const activeQueryNumber = selectedCandidate?.number || motherCode.motherCode;

  return (
    <div className="space-y-8">
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onSave={(updated) => updateProfile(updated)}
      />

      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              今日数字模型 · Number Synthesis
            </h1>
            <Badge variant="outline" className="text-xs border-gold-500/40 text-gold-300">
              Phase 6 · 数
            </Badge>
            <div className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>{profile.name} ({profile.gender === 'male' ? '乾造·男' : '坤造·女'})</span>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-gold-400 hover:text-gold-300 ml-1 text-[11px] underline flex items-center gap-0.5"
              >
                <Edit3 className="w-3 h-3" />
                修改命盘
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            融合个人先天气象 (DNA) + 流日干支激活 + 八方九宫方位 + 现实信号观察 + 易理典籍优先，确定性综合推演。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Action: Favorites / Auto Checker */}
          <Button
            onClick={() => setIsSavedModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>我的心水收藏</span>
          </Button>

          {/* Quick Action: Dream / Imagery Divination */}
          <Button
            onClick={() => setIsDreamModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>梦境物象起卦</span>
          </Button>

          {/* Quick Action: Metaphysical Poster Export */}
          <Button
            onClick={() => setIsPosterModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/40 text-gold-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-gold-400" />
            <span>导出运势海报</span>
          </Button>

          {/* One-click Refresh / Recalculate Button */}
          <Button
            onClick={handleRefreshCalculation}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? '推演中...' : '刷新契合'}</span>
          </Button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#070A12] border border-slate-800 text-xs text-gold-300 px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50"
          />

          <Link
            href="/dashboard/prediction/history"
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition"
          >
            历史推演对比
          </Link>
        </div>
      </div>

      {/* Low Signal Warning if Data Quality is Poor */}
      {quality.isLowSignalCondition && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block text-sm">模型输入完整度提示</span>
            <p className="mt-0.5 opacity-90">{quality.warningNotice}</p>
          </div>
        </div>
      )}

      {/* Windfall Wealth Index Block (今日紫微偏财运指数、24小时流时曲线与7天开彩周历) */}
      <WindfallWealthCard
        analysis={windfallAnalysis}
        dateStr={selectedDate}
        hourlyPoints={hourlyPoints}
        weeklyForecast={weeklyForecast}
      />

      {/* Main Grid: Mother Code Hero Card & Top Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Mother Code Hero Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-br from-[#0E1322] via-[#0B0F19] to-[#070A12] border-gold-500/40 p-6 relative overflow-hidden shadow-gold-glow">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gold-500/50 text-gold-300 text-xs font-bold uppercase tracking-wider">
                  MOTHER CODE · 本期母码
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">模型一致性:</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    consistency === 'HIGH'
                      ? 'border-emerald-500/40 text-emerald-300'
                      : consistency === 'NORMAL'
                      ? 'border-blue-500/40 text-blue-300'
                      : 'border-amber-500/40 text-amber-300'
                  }`}
                >
                  {consistency}
                </Badge>
              </div>
            </div>

            {/* Giant Mother Code Display */}
            <div className="py-8 text-center">
              <span className="text-[11px] text-slate-500 tracking-widest uppercase block mb-1">
                Synthesized Primary Sequence
              </span>
              <div className="text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200 tracking-widest drop-shadow-lg">
                {motherCode.motherCode}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-400">综合模型指数:</span>
                <strong className="text-gold-300 font-mono text-base">{motherCode.score.toFixed(1)}</strong>
                <span className="text-slate-500">/ 100</span>
                <Badge variant="outline" className="border-gold-500/30 text-gold-300 text-[10px] ml-1">
                  {motherCode.confidence}
                </Badge>
              </div>
            </div>

            {/* Feature Breakdown Progress Bars */}
            <div className="space-y-2.5 text-xs bg-[#070A12]/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  单字综合实力 (25%)
                </span>
                <span className="font-mono text-gold-300 font-semibold">{motherCode.breakdown.digitStrength}分</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gold-400 h-full rounded-full" style={{ width: `${motherCode.breakdown.digitStrength}%` }} />
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  易理典籍优先 (15%) · {motherCode.breakdown.bodyUseRelation || '体用兼备'}
                </span>
                <span className="font-mono text-amber-300 font-semibold">{motherCode.breakdown.canonScore}分</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${motherCode.breakdown.canonScore}%` }} />
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  先天DNA重叠 (15%)
                </span>
                <span className="font-mono text-blue-300 font-semibold">{motherCode.breakdown.dnaScore}分</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${motherCode.breakdown.dnaScore}%` }} />
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  流日干支激活 (15%)
                </span>
                <span className="font-mono text-emerald-300 font-semibold">{motherCode.breakdown.dailyScore}分</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${motherCode.breakdown.dailyScore}%` }} />
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  空间方位共振 (10%)
                </span>
                <span className="font-mono text-purple-300 font-semibold">{motherCode.breakdown.directionScore}分</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${motherCode.breakdown.directionScore}%` }} />
              </div>
            </div>

            {/* Mother Code Summary */}
            <p className="text-xs text-slate-400 mt-4 leading-relaxed bg-[#070A12]/40 p-3 rounded-xl border border-slate-800/50">
              {motherCode.summary}
            </p>

            {/* Canonical Metaphysics Citation */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#070A12]/80 border border-gold-500/25 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gold-400 flex items-center gap-1.5 text-[11px]">
                  <BookMarked className="w-3.5 h-3.5" />
                  原典古训引征 · Canonical Citation
                </span>
                <Link
                  href="/literature"
                  className="text-[10px] text-slate-500 hover:text-gold-300 flex items-center gap-0.5 transition"
                >
                  <span>查阅典籍库</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-[11px] text-slate-300 italic leading-relaxed border-l-2 border-gold-500/60 pl-2.5 my-1">
                “{motherCodeCitations.primaryMetaphysicalCitation.originalQuote}”
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span>出处：《{motherCodeCitations.primaryMetaphysicalCitation.sourceTitle}》</span>
                <span>著者：{motherCodeCitations.primaryMetaphysicalCitation.author}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-gold-300 font-medium">梅花易数体用：</span>
                {motherCodeCitations.plumBlossomCitation}
              </div>
            </div>

            {/* Action Buttons: Favorite Mother Code & Historical Cross-Check */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <Button
                onClick={() =>
                  handleSaveFavorite(
                    motherCode.motherCode,
                    '本期推演核心母码',
                    motherCode.score,
                    '本期综合模型置信度最高之首位序列'
                  )
                }
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {savedSuccessNum === motherCode.motherCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已收藏</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>⭐ 收藏本期母码</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  setHistoryQueryNumber(motherCode.motherCode);
                  setIsHistoryModalOpen(true);
                }}
                className="px-3 py-1.5 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5 text-gold-400" />
                深入出彩规律
              </Button>
            </div>
          </Card>

          {/* Top 0-9 Digit Strength Breakdown */}
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-6">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-gold-400" />
                0-9 单字综合实力排行榜
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {vectors.map((v) => (
                <div
                  key={v.digit}
                  className="p-2.5 rounded-xl bg-[#070A12] border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                        v.rank <= 4
                          ? 'bg-gold-500 text-obsidian-950'
                          : v.rank <= 7
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{v.rank}
                    </span>
                    <strong className="text-white text-sm font-mono">{v.digit}</strong>
                    <span className="text-[10px] text-slate-500">
                      DNA {v.personalDnaScore} · 流日 {v.dailyActivationScore}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-gold-300 text-xs">
                    {v.overallDigitScore.toFixed(1)} 分
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 7 Cols: Top Candidates & Variations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Model Candidates */}
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold-400" />
                  Top 模型候选组合 (Ranked Candidates)
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  严禁称为中奖号码，此为综合气场模型在 0000-9999 空间中提取之高共振候选
                </CardDescription>
              </div>

              {/* Top Selector Toggle */}
              <div className="flex bg-[#070A12] p-0.5 rounded-xl border border-slate-800 text-xs">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTopLimit(num)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      topLimit === num
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Top {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidates List */}
            <div className="divide-y divide-slate-800/60 mt-2">
              {displayedCandidates.map((c) => (
                <div
                  key={c.number}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-xl transition cursor-pointer"
                  onClick={() => setSelectedCandidate(c)}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        c.rank === 1
                          ? 'bg-gold-500 text-obsidian-950 ring-2 ring-gold-400/40'
                          : c.rank <= 5
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-lg font-mono tracking-wider">{c.number}</strong>
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                          {c.generationMethod === 'PRIMARY_PERMUTATION'
                            ? '主字排列'
                            : c.generationMethod === 'REPEATED_COMBO'
                            ? '重叠对子'
                            : '次选置换'}
                        </Badge>
                        {c.breakdown.bodyUseRelation && (
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              c.breakdown.bodyUseRelation === '用生体'
                                ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10'
                                : c.breakdown.bodyUseRelation === '体用比和'
                                ? 'border-blue-500/50 text-blue-300 bg-blue-500/10'
                                : c.breakdown.bodyUseRelation === '体克用'
                                ? 'border-amber-500/50 text-amber-300 bg-amber-500/10'
                                : 'border-rose-500/50 text-rose-300 bg-rose-500/10'
                            }`}
                          >
                            {c.breakdown.bodyUseRelation}
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        易理 {c.breakdown.canonScore} · 字实力 {c.breakdown.digitStrength} · DNA {c.breakdown.dnaScore} · 和值 {c.breakdown.sum} (根 {c.breakdown.digitalRoot})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveFavorite(c.number, `Top ${c.rank} 候选号码`, c.score);
                      }}
                      title="加入我的心水收藏"
                      className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-medium flex items-center gap-1 transition"
                    >
                      {savedSuccessNum === c.number ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">已藏</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3 text-amber-400" />
                          <span>收藏</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHistoryQueryNumber(c.number);
                        setIsHistoryModalOpen(true);
                      }}
                      title="在大马与新加坡各大博彩中检索本号码出彩规律"
                      className="px-2 py-1 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-[10px] text-gold-300 font-medium flex items-center gap-1 transition"
                    >
                      <Trophy className="w-3 h-3 text-gold-400" />
                      出彩规律
                    </button>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-gold-300">{c.score.toFixed(1)}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                        <span>推演详情</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Variations Panel */}
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-6">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold-400" />
                母码拓扑变体码 (Variation Codes)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                由母码【{motherCode.motherCode}】通过逆序、轮转、对调与河图五行换气等规则衍生的代表变体（上限 24 组）
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-2">
              {variations.slice(0, 16).map((v) => (
                <div
                  key={v.resultNumber}
                  className="p-2.5 rounded-xl bg-[#070A12] border border-slate-800/80 hover:border-gold-500/40 transition text-center"
                >
                  <div className="font-mono text-base font-bold text-white">{v.resultNumber}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{v.variationType}</div>
                  <div className="text-[11px] font-mono font-semibold text-gold-400 mt-1">
                    {v.variationScore.toFixed(1)}分
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Real-time Nearest 20 Historical Draws Table for Active Number */}
      <RecentDrawMatchesTable targetNumber={activeQueryNumber} />

      {/* Candidate Trace Modal if Clicked */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0F1420] border-gold-500/40 max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold-400" />
                  候选组合【{selectedCandidate.number}】计算存证
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">全流程数学加权及特征溯源记录</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {NumberExplanationEngine.explainCandidate(selectedCandidate, vectors, personalDNA)}
            </div>

            <div className="space-y-2 text-xs">
              {selectedCandidate.trace.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#070A12] border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-gold-400">{step.factor}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{step.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-emerald-400 font-semibold">+{step.points}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setHistoryQueryNumber(selectedCandidate.number);
                  setIsHistoryModalOpen(true);
                }}
                className="flex-1 bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-gold-400" />
                在各大博彩平台中深入规律分析
              </Button>
              <Button
                onClick={() => setSelectedCandidate(null)}
                className="sm:w-24 bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded-xl"
              >
                关闭
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Malaysian Draw History Modal */}
      <MalaysianDrawHistoryModal
        initialNumber={historyQueryNumber}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Saved Favorites & Auto Draw Checker Modal */}
      <SavedPredictionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onInspectNumber={(num) => {
          setHistoryQueryNumber(num);
          setIsHistoryModalOpen(true);
        }}
      />

      {/* Dream & Imagery Divination Modal */}
      <DreamImageryDivinationModal
        isOpen={isDreamModalOpen}
        onClose={() => setIsDreamModalOpen(false)}
        onSelectNumber={(num) => {
          setHistoryQueryNumber(num);
          setIsHistoryModalOpen(true);
        }}
      />

      {/* Metaphysical Poster Export Modal */}
      <MetaphysicalPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        profile={profile}
        dateStr={selectedDate}
        motherCode={motherCode}
        variations={variations}
        windfallAnalysis={windfallAnalysis}
      />

      {/* Mandatory Responsible Model Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-[11px] text-slate-500 leading-relaxed">
        <strong>⚠️ 郑重提示与防沉迷声明：</strong>
        本系统输出之母码与候选组合均为基于传统易学象数模型与历史统计加权产生之决策辅助数据，
        <strong>绝非任何形式的中奖保证或购买承诺</strong>。数字彩票具有完全客观的独立随机性，历史表现不代表未来，
        严禁采用加注或追号等激进投注策略。请保持理智，切勿沉迷。
      </div>
    </div>
  );
}
