// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 24-Hour / 12 Double-Hours Windfall Curve
// File: components/prediction/HourlyWindfallCurveView.tsx
// ==========================================================

'use client';

import React, { useState } from 'react';
import type { HourlyWindfallPoint } from '@/lib/engines/daily/windfall-wealth-engine';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface HourlyWindfallCurveViewProps {
  points: HourlyWindfallPoint[];
}

export function HourlyWindfallCurveView({ points }: HourlyWindfallPointProps) {
  const [selectedPoint, setSelectedPoint] = useState<HourlyWindfallPoint>(
    points.find((p) => p.isBest) || points[8] || points[0]
  );

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold-400" />
          <span className="font-bold text-white tracking-wide">
            今日 24 小时 · 十二时辰偏财气脉流转曲线
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            偏财纳气吉时 (≥70)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            平顺循常 (46-69)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            大忌耗煞 (≤45)
          </span>
        </div>
      </div>

      {/* Visual Step/Bar Curve */}
      <div className="bg-[#070A12] p-4 rounded-xl border border-slate-800/80">
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {points.map((pt) => {
            const isSelected = selectedPoint.branch === pt.branch;
            return (
              <button
                key={pt.branch}
                onClick={() => setSelectedPoint(pt)}
                className={`relative flex flex-col items-center justify-end h-32 p-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-gold-400 bg-gold-500/15 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Best Badge */}
                {pt.isBest && (
                  <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-gold-500 text-obsidian-950 text-[9px] font-bold shadow">
                    最佳
                  </span>
                )}
                {/* Worst Badge */}
                {pt.isWorst && (
                  <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold shadow">
                    避煞
                  </span>
                )}

                {/* Score label */}
                <span
                  className={`text-[11px] font-mono font-bold mb-1 ${
                    pt.score >= 70
                      ? 'text-emerald-300'
                      : pt.score <= 45
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  {pt.score}
                </span>

                {/* Bar height proportion */}
                <div className="w-full bg-slate-800/70 rounded-sm overflow-hidden flex items-end h-16">
                  <div
                    className={`w-full rounded-sm transition-all duration-300 ${
                      pt.status === 'AUSPICIOUS'
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : pt.status === 'AVOID'
                        ? 'bg-gradient-to-t from-rose-700 to-rose-500'
                        : 'bg-gradient-to-t from-blue-700 to-blue-400'
                    }`}
                    style={{ height: `${Math.max(15, (pt.score / 100) * 100)}%` }}
                  />
                </div>

                {/* Branch name & Stem */}
                <span className="text-xs font-bold text-white mt-1.5">{pt.nameZh}</span>
                <span className="text-[10px] text-slate-500 font-mono scale-90">{pt.hourStemBranch}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Detail Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{selectedPoint.title}</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                selectedPoint.status === 'AUSPICIOUS'
                  ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                  : selectedPoint.status === 'AVOID'
                  ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                  : 'border-blue-500/40 text-blue-300 bg-blue-500/10'
              }`}
            >
              {selectedPoint.timeRange}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">{selectedPoint.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">流时指数</span>
            <span className="text-2xl font-mono font-black text-gold-300">{selectedPoint.score}</span>
          </div>
          {selectedPoint.status === 'AUSPICIOUS' ? (
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
          ) : selectedPoint.status === 'AVOID' ? (
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
type HourlyWindfallPointProps = HourlyWindfallCurveViewProps;
