'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type {
  BirthProfile,
  DailyNumberActivation,
  DailyPalaceActivation,
  DailyTimeSignature,
} from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CalendarDays,
  Clock,
  Compass,
  Sparkles,
  AlertTriangle,
  Flame,
  Layers,
  FileText,
  Lock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Edit3,
  User,
} from 'lucide-react';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { DIRECTION_SECTORS } from '@/lib/directions/direction-models';
import { ELEMENT_LABELS, getDigitElement } from '@/lib/numerology/digit-foundation';
import { CalculationTraceModal } from './CalculationTraceModal';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import { WindfallWealthEngine } from '@/lib/engines/daily/windfall-wealth-engine';
import { WindfallWealthCard } from '@/components/prediction/WindfallWealthCard';
import { getRealtimeDate } from '@/lib/utils/date-utils';

export function DailyDashboardView({ profile: propProfile }: { profile: BirthProfile }) {
  const { profile: storedProfile, updateProfile } = useUserProfile();
  const profile = storedProfile || propProfile;

  const [selectedDate, setSelectedDate] = useState<string>(() => getRealtimeDate(profile?.timezone));
  const [selectedTrace, setSelectedTrace] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Static Four Pillars
  const fourPillars = useMemo(() => {
    return FourPillarsEngine.calculateFourPillars(profile);
  }, [profile]);

  // Static Personal DNA
  const dna = useMemo(() => {
    return PersonalNumberDNAEngine.generateDNA(profile);
  }, [profile]);

  // Static Natal Zi Wei Chart
  const chart = useMemo(() => {
    return ZiWeiEngine.generateChart(profile);
  }, [profile]);

  // Static Personal Direction Profile
  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, chart, dna);
  }, [fourPillars, chart, dna]);

  // Dynamic Daily Time Signature
  const dailySig = useMemo(() => {
    return DailyEngine.generateDailySignature(selectedDate, profile.timezone);
  }, [selectedDate, profile.timezone]);

  // Dynamic Daily Palaces Activation
  const activePalaces = useMemo(() => {
    return DailyEngine.activatePalaces(chart, dailySig);
  }, [chart, dailySig]);

  // Dynamic Daily Numbers Activation (Personal DNA × Daily Time Signature)
  const activatedNumbers = useMemo(() => {
    return DailyEngine.activateNumbers(dna, activePalaces, dailySig);
  }, [dna, activePalaces, dailySig]);

  // Dynamic Daily Direction Result
  const dailyDirections = useMemo(() => {
    return DailyDirectionEngine.calculateDailyDirections(
      selectedDate,
      personalDirections,
      dailySig,
      activatedNumbers,
      activePalaces
    );
  }, [selectedDate, personalDirections, dailySig, activatedNumbers, activePalaces]);

  const top3Numbers = activatedNumbers.slice(0, 3);
  const next3Numbers = activatedNumbers.slice(3, 6);
  const top3Palaces = activePalaces.slice(0, 3);

  // Dynamic Opportunity Score calculation
  const topAvg = top3Numbers.reduce((a, b) => a + b.activationScore, 0) / 3;
  const oppCalc = DailyEngine.calculateOpportunityScore(topAvg, dailySig.opportunityScore, activePalaces);

  // Purple Star Windfall Wealth Analysis
  const windfallAnalysis = useMemo(() => {
    return WindfallWealthEngine.evaluateWindfall(chart, dailySig);
  }, [chart, dailySig]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshCount((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 450);
  };

  return (
    <div className="space-y-8">
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onSave={(updated) => updateProfile(updated)}
      />

      {/* 1. Header Banner & Opportunity Status */}
      <div className="p-7 rounded-2xl glass-panel border border-gold-500/25 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-850">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="gold">Phase 3 · 时空动态激活中枢</Badge>
              <span className="text-xs text-slate-400 font-mono">
                {dailySig.calculationVersion} · {dailySig.timezone}
              </span>
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
            <h2 className="text-2xl font-serif font-bold text-slate-100 tracking-wide">
              今日紫微时空动态推演
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              个人数字 DNA（静态本命）与当日节气干支（动态时空）矩阵融合激活。
              <span className="text-slate-400 block mt-0.5">
                历元: {dailySig.gregorianDate} · {dailySig.lunarDate} · {dailySig.solarTerm.currentTerm} ({dailySig.solarTerm.seasonZh})
              </span>
            </p>
          </div>

          {/* Model Opportunity Score Badge & Refresh Button */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/20 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? '正在重新推演...' : '点击刷新今日契合数字'}</span>
            </Button>

            <div className="bg-obsidian-950/80 p-4 rounded-xl border border-gold-500/20 text-right shrink-0 w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 font-medium block">
                当日模型偏财时空指数 (Opportunity Score)
              </span>
              <div className="text-3xl font-mono font-bold text-gold-champagne my-0.5">
                {oppCalc.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <Badge variant={oppCalc.score < 40 ? 'danger' : 'gold'}>
                {oppCalc.level} 活跃等级
              </Badge>
            </div>
          </div>
        </div>

        {/* Mandatory Responsible Warning if < 40 */}
        {oppCalc.score < 40 && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-red-200 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>今日模型状态偏低，建议保持观察，不因系统增加投注。</span>
          </div>
        )}
      </div>

      {/* Windfall Wealth Index Block (偏财运指数的高低区块与投注宜忌) */}
      <WindfallWealthCard analysis={windfallAnalysis} dateStr={selectedDate} />

      {/* 2. Three Primary Sections: Time Windows, Activated Numbers, Five Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Time Windows & Activated Numbers */}
        <div className="lg:col-span-8 space-y-6">
          {/* Time Windows Card */}
          <Card className="border-gold-500/20">
            <CardHeader className="pb-3">
              <CardTitle>
                <Clock className="w-4 h-4 text-gold-champagne" />
                今日主要时段分布 (Daily Time Windows)
              </CardTitle>
              <CardDescription>
                依据当日地支五行与日主生克计算出的择机时段，不使用固定虚构时辰
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-obsidian-900 border border-emerald-500/30 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-serif font-bold text-emerald-400">主吉时 (Primary)</span>
                    <Badge variant="success">优先</Badge>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100 block">
                    {dailySig.primaryWindow}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-obsidian-900 border border-gold-500/20 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-serif font-bold text-gold-champagne">次选时 (Secondary)</span>
                    <Badge variant="gold">次优</Badge>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100 block">
                    {dailySig.secondaryWindow}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-obsidian-900 border border-red-500/30 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-serif font-bold text-red-400">避让时 (Avoid)</span>
                    <Badge variant="danger">规避</Badge>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100 block">
                    {dailySig.avoidWindow}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activated Numbers Card */}
          <Card className="border-gold-500/20">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  <Sparkles className="w-4 h-4 text-gold-champagne" />
                  今日个人激活数字 (Activated Numbers)
                </CardTitle>
                <CardDescription>
                  静态本命 DNA 经当日时空签名调谐后的活跃序列
                </CardDescription>
              </div>
              <Link href="/laboratory">
                <Button variant="outline" size="sm">
                  验象实验室 <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Active Numbers */}
              <div className="p-4 rounded-xl bg-obsidian-950/80 border border-gold-500/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-serif font-bold text-gold-champagne flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-400" />
                    首选激活数字 (Primary Top 3)
                  </span>
                  <Badge variant="gold">强共振</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {top3Numbers.map((act) => {
                    const el = getDigitElement(act.digit);
                    const meta = ELEMENT_LABELS[el];
                    return (
                      <div
                        key={act.digit}
                        className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/40 shadow-gold-glow flex flex-col items-center justify-between group cursor-pointer hover:border-gold-300"
                        onClick={() => setSelectedTrace({
                          digit: act.digit,
                          element: el,
                          polarity: 'Yang',
                          steps: act.trace,
                          finalScore: act.activationScore,
                          classification: act.classification,
                        })}
                      >
                        <span className="text-3xl font-mono font-bold text-gold-champagne group-hover:scale-110 transition-transform">
                          {act.digit}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5 text-xs">
                          <span className={meta.text}>{meta.zh}</span>
                          <span className="text-emerald-400 font-mono font-semibold">
                            {act.activationScore}分
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-0.5">
                          <FileText className="w-2.5 h-2.5" /> 溯源
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Numbers */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-serif">次选协同数字 (Secondary)</span>
                <div className="flex gap-2 font-mono text-sm">
                  {next3Numbers.map(act => (
                    <span
                      key={act.digit}
                      className="px-2.5 py-1 bg-obsidian-950 rounded border border-slate-700 text-slate-200"
                    >
                      {act.digit} ({act.activationScore}分)
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full 0-9 Digits Breakdown Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>0-9 全数字多维激活矩阵 (Full 0-9 Activation)</CardTitle>
              <CardDescription>
                严格保留 0-9 全部数字的基准分与激活分，杜绝遗漏，随时可查溯源细节
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="py-2.5 px-3">数字</th>
                      <th className="py-2.5 px-3">五行</th>
                      <th className="py-2.5 px-3">本命基因分</th>
                      <th className="py-2.5 px-3">今日时空分</th>
                      <th className="py-2.5 px-3">最终激活度</th>
                      <th className="py-2.5 px-3">状态</th>
                      <th className="py-2.5 px-3">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {activatedNumbers.map((act) => {
                      const el = getDigitElement(act.digit);
                      const meta = ELEMENT_LABELS[el];
                      return (
                        <tr key={act.digit} className="hover:bg-white/5">
                          <td className="py-2.5 px-3 text-base font-bold text-slate-100">{act.digit}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className={meta.text}>{meta.zh} ({el})</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{act.personalBaseScore}</td>
                          <td className="py-2.5 px-3 text-slate-300">{act.timeScore}</td>
                          <td className="py-2.5 px-3 font-bold text-gold-champagne">{act.activationScore}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <Badge variant={act.classification === 'Primary' ? 'gold' : act.classification === 'Secondary' ? 'default' : 'outline'}>
                              {act.classification === 'Primary' ? '首选' : act.classification === 'Secondary' ? '次选' : '弱势'}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => setSelectedTrace({
                                digit: act.digit,
                                element: el,
                                polarity: 'Yang',
                                steps: act.trace,
                                finalScore: act.activationScore,
                                classification: act.classification,
                              })}
                              className="text-gold-400/80 hover:text-gold-300 text-[11px] font-sans flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> 溯源
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Direction Compass, Active Palaces & Five Elements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Direction Compass Card (Phase 4) */}
          <Card className="border-gold-500/30 bg-gradient-to-br from-obsidian-900 to-obsidian-950 shadow-gold-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-gold-400 animate-spin-slow" />
                  今日时空吉方 (Spatial Compass)
                </CardTitle>
                <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-[10px]">
                  Phase 4 · 位
                </Badge>
              </div>
              <CardDescription className="text-xs">
                先天本命气场与今日流日时空方位融合之首利用位
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-gold-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">首选时空方位</span>
                  <span className="text-xl font-bold text-white">
                    {DIRECTION_SECTORS[dailyDirections.topDirection].nameZh}
                  </span>
                  <span className="text-xs text-gold-300 ml-1.5 font-medium">
                    ({DIRECTION_SECTORS[dailyDirections.topDirection].baguaName}卦 · {DIRECTION_SECTORS[dailyDirections.topDirection].element})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-gold-400">
                    {dailyDirections.directionScores[dailyDirections.topDirection].score.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">综合指数分</span>
                </div>
              </div>

              {dailyDirections.isContested && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>与【{DIRECTION_SECTORS[dailyDirections.secondaryDirection].nameZh}】信号接近并峙</span>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-obsidian-950 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">方位数理共振:</span>
                <div className="flex gap-1.5 font-mono font-bold">
                  {dailyDirections.directionScores[dailyDirections.topDirection].resonantDigits.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-300"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/compass"
                className="w-full py-2.5 px-3 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition mt-2"
              >
                <span>打开完整个人时空罗盘</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Today's Number Synthesis Card (Phase 6) */}
          <Card className="border-gold-500/30 bg-[#0F1420] shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  今日数字模型 · 母码候选
                </CardTitle>
                <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-[10px]">
                  Phase 6 · 数
                </Badge>
              </div>
              <CardDescription className="text-xs">
                先天DNA + 流日激活 + 空间方位 + 现实信号多维合成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">本期模型母码:</span>
                <span className="font-mono font-black text-xl text-gold-300 tracking-wider">5729</span>
              </div>
              <Link
                href="/dashboard/prediction"
                className="w-full py-2.5 px-3 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>进入完整数字合成工作台</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Active Palaces Card */}
          <Card className="border-gold-500/20">
            <CardHeader className="pb-3">
              <CardTitle>
                <Compass className="w-4 h-4 text-gold-champagne" />
                今日活跃宫位 (Active Palaces)
              </CardTitle>
              <CardDescription>
                重点关注财帛、迁移、福德等宫位时空场能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {top3Palaces.map((p, idx) => (
                <div
                  key={p.palaceName}
                  className="p-3 rounded-xl bg-obsidian-900 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-serif font-bold text-slate-100 text-sm block">
                      {p.palaceName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      活跃得分: <strong className="text-gold-champagne">{p.activationScore}</strong>
                    </span>
                  </div>
                  <Badge variant={p.status === 'STRONG' || p.status === 'VERY STRONG' ? 'gold' : 'default'}>
                    {p.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Five Element Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <Layers className="w-4 h-4 text-gold-champagne" />
                今日五行场能 (Daily Five Elements)
              </CardTitle>
              <CardDescription>
                主导行: <strong className="text-gold-champagne">{ELEMENT_LABELS[dailySig.dominantElement].zh} ({dailySig.dominantElement})</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const).map((el) => {
                const score = dailySig[`${el.toLowerCase()}Score` as keyof DailyTimeSignature] as number;
                const meta = ELEMENT_LABELS[el];

                return (
                  <div key={el} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        {meta.zh}行
                      </span>
                      <span className="font-mono text-slate-400">{score} 分</span>
                    </div>
                    <div className="h-2 rounded-full bg-obsidian-950 overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${score}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Today's Interpretation */}
          <Card className="border-gold-500/20">
            <CardHeader className="pb-3">
              <CardTitle>今日时空易象通解</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs leading-relaxed text-slate-300">
              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <span className="font-semibold text-gold-champagne block">【今日主题】</span>
                <p>节气交接，金气肃敛主导，利守中正之道，忌贪多冒进。</p>
              </div>
              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <span className="font-semibold text-gold-champagne block">【主要宫位】</span>
                <p>财帛与迁移宫互为表里，利外部沟通与秩序建立。</p>
              </div>
              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <span className="font-semibold text-gold-champagne block">【数字特征】</span>
                <p>首选数字以 {top3Numbers.map(n => n.digit).join('、')} 呈现较强气场共振。</p>
              </div>
            </CardContent>
          </Card>

          {/* Strictly Labeled Phase Placeholders per Section 36-39 */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-obsidian-950/60 border border-dashed border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>今日行动 (Daily Action)</span>
              <span className="text-gold-400/80 font-mono">Phase 5 开启</span>
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/60 border border-dashed border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>今日观象取数 (Reality Signal)</span>
              <span className="text-gold-400/80 font-mono">Phase 5 开启</span>
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/60 border border-dashed border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>个人财位罗盘 (Luck Compass)</span>
              <span className="text-gold-400/80 font-mono">Phase 4 开启</span>
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/60 border border-dashed border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>彩票组合推演 (Prediction Pools)</span>
              <span className="text-gold-400/80 font-mono">Phase 6 开启</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trace Modal */}
      {selectedTrace && (
        <CalculationTraceModal
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
        />
      )}
    </div>
  );
}
