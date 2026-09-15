// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Windfall Wealth Card Component
// File: components/prediction/WindfallWealthCard.tsx
// ==========================================================

import React, { useState } from 'react';
import type {
  WindfallWealthAnalysis,
  HourlyWindfallPoint,
  DrawDayForecastItem,
} from '@/lib/engines/daily/windfall-wealth-engine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { HourlyWindfallCurveView } from './HourlyWindfallCurveView';
import { DrawDaysForecastView } from './DrawDaysForecastView';

interface WindfallWealthCardProps {
  analysis: WindfallWealthAnalysis;
  dateStr: string;
  hourlyPoints?: HourlyWindfallPoint[];
  weeklyForecast?: DrawDayForecastItem[];
}

export function WindfallWealthCard({
  analysis,
  dateStr,
  hourlyPoints = [],
  weeklyForecast = [],
}: WindfallWealthCardProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOURLY' | 'WEEKLY'>('OVERVIEW');
  const isAvoid = analysis.suitability === 'STRICTLY_AVOID' || analysis.suitability === 'UNSUITABLE';
  const isHigh = analysis.suitability === 'SUITABLE';

  return (
    <Card className="bg-gradient-to-br from-[#0D121F] via-[#0B0F19] to-[#070A12] border-gold-500/30 p-6 relative overflow-hidden shadow-xl">
      {/* Background glow ambient */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isAvoid
            ? 'bg-rose-500/10'
            : isHigh
            ? 'bg-emerald-500/10'
            : 'bg-gold-500/10'
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isAvoid
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-gold-500/20 text-gold-400 border-gold-500/40'
            }`}
          >
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                今日紫微偏财运指数与投注宜忌
              </h3>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                流日财福气数
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              基于生辰紫微命盘财帛宫、福德宫与今日流日干支四化冲合综合推演
            </p>
          </div>
        </div>

        {/* Big Verdict Badge */}
        <div>
          <span
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md ${analysis.suitabilityColor}`}
          >
            {isAvoid ? (
              <AlertOctagon className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {analysis.suitabilityZh}
          </span>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 pt-3 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-2 px-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-gold-400 text-gold-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          今日偏财总评
        </button>
        <button
          onClick={() => setActiveTab('HOURLY')}
          className={`pb-2 px-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'HOURLY'
              ? 'border-gold-400 text-gold-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          24小时十二时辰走势
          {hourlyPoints.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300">
              12时辰
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('WEEKLY')}
          className={`pb-2 px-1 font-bold flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'WEEKLY'
              ? 'border-gold-400 text-gold-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          未来7天开彩日周历
          {weeklyForecast.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              7天
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <>
          {/* Score & Main Verdict Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-5">
            {/* Left 4 Cols: Index Meter */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-[#070A12]/80 border border-slate-800/80 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] text-slate-400 tracking-wider uppercase mb-1">
                今日偏财运指数 · Windfall Index
              </span>
              <div className="flex items-baseline gap-1 my-2">
                <span
                  className={`text-6xl font-mono font-black tracking-tight ${
                    isAvoid
                      ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  }`}
                >
                  {analysis.score}
                </span>
                <span className="text-slate-500 font-mono text-sm">/ 100</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1 mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAvoid
                      ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                      : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 w-full text-left pt-2 border-t border-slate-800/80">
                <div className="truncate">{analysis.wealthPalaceSummary}</div>
                <div className="truncate">{analysis.fortunePalaceSummary}</div>
              </div>
            </div>

            {/* Right 8 Cols: Verdict Details & Rationale */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-3">
              <div
                className={`p-4 rounded-xl border ${
                  isAvoid
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : 'bg-gold-500/10 border-gold-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  {isAvoid ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  )}
                  <span>{analysis.verdictTitle}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{analysis.verdictAdvice}</p>
              </div>

              {/* Windows (Auspicious / Avoid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#070A12]/60 border border-emerald-500/25 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">气运通达时辰 (吉时)</span>
                    <strong className="text-emerald-300 font-mono text-xs block mt-0.5">
                      {analysis.auspiciousHour}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070A12]/60 border border-rose-500/25 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">煞星冲射时辰 (忌动)</span>
                    <strong className="text-rose-300 font-mono text-xs block mt-0.5">
                      {analysis.avoidHour}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Influences Accordion/List */}
          <div className="p-3.5 rounded-xl bg-[#070A12]/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gold-400" />
              今日流日影响偏财星曜与四化明细：
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {analysis.keyInfluences.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800/80 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <strong className="text-white font-mono">{item.star}</strong>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 ${
                        item.scoreEffect > 0
                          ? 'border-emerald-500/40 text-emerald-300'
                          : item.scoreEffect < 0
                          ? 'border-rose-500/40 text-rose-300'
                          : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      {item.scoreEffect > 0 ? `+${item.scoreEffect}` : item.scoreEffect} 分
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Hourly Curve */}
      {activeTab === 'HOURLY' && <HourlyWindfallCurveView points={hourlyPoints} />}

      {/* Tab 3: Weekly Forecast */}
      {activeTab === 'WEEKLY' && <DrawDaysForecastView forecast={weeklyForecast} />}

      {/* Safety & Anti-Gambling Warning */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[10px] text-slate-500 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
        <span>{analysis.antiGamblingWarning}</span>
      </div>
    </Card>
  );
}
