// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Recent Draw Matches Table
// File: components/prediction/RecentDrawMatchesTable.tsx
// Displays nearest historical winning records across Malaysian & Regional lotteries (up to 100 records)
// ==========================================================

import React, { useState, useMemo } from 'react';
import type { MalaysianOperator } from '@/types/zwtsp';
import {
  MalaysiaLotteryProvider,
  MALAYSIAN_OPERATORS,
  LotteryHitMatchItem,
} from '@/lib/lottery/malaysia-provider';
import { LotteryPatternEngine } from '@/lib/lottery/lottery-pattern-engine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Trophy,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Clock,
  Filter,
  Flame,
  Snowflake,
  Activity,
  Award,
} from 'lucide-react';

interface RecentDrawMatchesTableProps {
  targetNumber: string;
  onSelectNumber?: (num: string) => void;
}

export function RecentDrawMatchesTable({
  targetNumber,
  onSelectNumber,
}: RecentDrawMatchesTableProps) {
  const [selectedOp, setSelectedOp] = useState<MalaysianOperator>('ALL');
  const [maxLimit, setMaxLimit] = useState<number>(100);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOP3_ONLY'>('ALL');

  // Compute deep historical pattern & omission analysis
  const patternAnalysis = useMemo(() => {
    return LotteryPatternEngine.analyzePattern(targetNumber, selectedOp);
  }, [targetNumber, selectedOp]);

  const rawMatches = useMemo(() => {
    return MalaysiaLotteryProvider.getRecentMatchesForNumber(
      targetNumber,
      maxLimit,
      selectedOp
    );
  }, [targetNumber, maxLimit, selectedOp]);

  const matches = useMemo(() => {
    if (tierFilter === 'TOP3_ONLY') {
      return rawMatches.filter(
        (m) => m.tier === 'FIRST' || m.tier === 'SECOND' || m.tier === 'THIRD'
      );
    }
    return rawMatches;
  }, [rawMatches, tierFilter]);

  const directHitsCount = matches.filter((m) => m.matchType === 'DIRECT').length;
  const permHitsCount = matches.filter((m) => m.matchType === 'PERMUTATION').length;
  const top3HitsCount = rawMatches.filter(
    (m) => m.tier === 'FIRST' || m.tier === 'SECOND' || m.tier === 'THIRD'
  ).length;

  const omission = patternAnalysis.omissionStats;

  return (
    <Card className="bg-[#0B0F19]/95 border-gold-500/30 p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-wide">
              本期推演号码 · 各大博彩平台历史出奖规律与遗漏深度分析
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            实时检索当前号码【<strong className="text-gold-300 font-mono text-sm">{targetNumber}</strong>】在新马七大彩（万能、大马彩、多多、砂拉越、沙巴、山打根、新加坡）的历史出彩与冷热遗漏周期
          </p>
        </div>

        {/* Stats Summary Badges & Limit Selector */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Top 3 Prize Toggle Button */}
          <button
            onClick={() => setTierFilter(tierFilter === 'ALL' ? 'TOP3_ONLY' : 'ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              tierFilter === 'TOP3_ONLY'
                ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-amber-500/20'
                : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>仅看大奖 (头/二/三奖)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              {top3HitsCount}
            </span>
          </button>

          {/* Limit Toggle */}
          <div className="flex bg-[#070A12] p-0.5 rounded-xl border border-slate-800 text-xs">
            {[20, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => setMaxLimit(num)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  maxLimit === num
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {num} 条
              </button>
            ))}
          </div>

          <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs font-mono">
            已查得: {matches.length} 条
          </Badge>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs font-mono">
            正字直落: {directHitsCount}
          </Badge>
          <Badge variant="outline" className="border-blue-500/40 text-blue-300 text-xs font-mono">
            全打组选: {permHitsCount}
          </Badge>
        </div>
      </div>

      {/* Deep Analytics & Omission Cycle Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070A12]/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
        {/* Metric 1: Current Omission */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>当前遗漏期数</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-white">
              {omission?.currentOmission ?? 0}
            </span>
            <span className="text-[10px] text-slate-500">期未开出</span>
          </div>
        </div>

        {/* Metric 2: Average Cycle */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>平均出彩间隔</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-blue-300">
              {omission?.averageOmission ?? 0}
            </span>
            <span className="text-[10px] text-slate-500">期 / 次</span>
          </div>
        </div>

        {/* Metric 3: Max Cold Gap */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>历史最大冷态期</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-cyan-300">
              {omission?.maxOmission ?? 0}
            </span>
            <span className="text-[10px] text-slate-500">期极冷纪录</span>
          </div>
        </div>

        {/* Metric 4: Status Indicator */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>当前冷热态势</span>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                omission?.omissionStatus === 'HOT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : omission?.omissionStatus === 'WARM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : omission?.omissionStatus === 'COLD'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              }`}
            >
              {omission?.omissionStatus === 'HOT'
                ? '🔥 热态活跃期'
                : omission?.omissionStatus === 'WARM'
                ? '⚡ 温态蓄力期'
                : omission?.omissionStatus === 'COLD'
                ? '❄️ 冷态沉淀期'
                : '🧊 极限深冷期'}
            </span>
          </div>
        </div>
      </div>

      {/* Stem-Branch Historical Summary Alert */}
      {patternAnalysis.sameStemBranchStats && (
        <div className="px-3.5 py-2 rounded-lg bg-gold-950/20 border border-gold-500/20 text-xs text-gold-300/90 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>{patternAnalysis.sameStemBranchStats.summary}</span>
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 hidden md:inline">
            紫微日柱时空共振算法
          </span>
        </div>
      )}

      {/* Operator Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          平台过滤:
        </span>
        <button
          onClick={() => setSelectedOp('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            selectedOp === 'ALL'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
              : 'bg-[#070A12] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          全部平台 (7大彩)
        </button>
        {MALAYSIAN_OPERATORS.map((op) => (
          <button
            key={op.id}
            onClick={() => setSelectedOp(op.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedOp === op.id
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                : 'bg-[#070A12] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {op.nameZh}
          </button>
        ))}
      </div>

      {/* Table Content with Sticky Header & Scrollable 100 rows */}
      {matches.length > 0 ? (
        <div className="overflow-x-auto max-h-[580px] overflow-y-auto rounded-xl border border-slate-800/80 bg-[#070A12]/80 mt-2 custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#0c1017] z-10 shadow-sm">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3 font-semibold w-12 text-center">序号</th>
                <th className="py-2.5 px-3 font-semibold">开奖日期</th>
                <th className="py-2.5 px-3 font-semibold">博彩机构</th>
                <th className="py-2.5 px-3 font-semibold">命中奖项</th>
                <th className="py-2.5 px-3 font-semibold">开奖期号</th>
                <th className="py-2.5 px-3 font-semibold">开出号码</th>
                <th className="py-2.5 px-3 font-semibold text-right">出彩类型</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {matches.map((m, idx) => (
                <tr
                  key={`${m.operator}-${m.drawDate}-${m.winningNumber}-${idx}`}
                  className="hover:bg-slate-800/30 transition text-slate-300"
                >
                  {/* Row index */}
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[10px]">
                    #{idx + 1}
                  </td>

                  {/* Date & Days ago */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span className="font-semibold text-white">{m.drawDate}</span>
                      <span className="text-[10px] text-slate-500">({m.daysAgo}天前)</span>
                    </div>
                  </td>

                  {/* Operator */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-bold border ${m.badgeColor}`}
                    >
                      {m.operatorNameZh}
                    </span>
                  </td>

                  {/* Prize Tier */}
                  <td className="py-2.5 px-3 font-sans">
                    <span
                      className={`font-semibold ${
                        m.tier === 'FIRST'
                          ? 'text-amber-300 font-bold'
                          : m.tier === 'SECOND'
                          ? 'text-blue-300 font-bold'
                          : m.tier === 'THIRD'
                          ? 'text-emerald-300 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.tierName}
                    </span>
                  </td>

                  {/* Draw No */}
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    #{m.drawNo}
                  </td>

                  {/* Winning Number */}
                  <td className="py-2.5 px-3">
                    <strong className="text-white text-sm tracking-wider font-bold">
                      {m.winningNumber}
                    </strong>
                  </td>

                  {/* Match Type */}
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        m.matchType === 'DIRECT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {m.matchTypeZh}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-[#070A12]/40 border border-slate-800/60 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">
            在所选博彩机构的历史记录中，号码【{targetNumber}】未见近期出彩记录。
          </p>
          <span className="text-xs text-slate-500 block">
            说明该号码当前处于冷态沉淀期，或属崭新组合形态。
          </span>
        </div>
      )}
    </Card>
  );
}
