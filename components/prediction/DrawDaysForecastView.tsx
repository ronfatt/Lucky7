// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 7-Day Draw Calendar & Windfall Forecast
// File: components/prediction/DrawDaysForecastView.tsx
// ==========================================================

'use client';

import React from 'react';
import type { DrawDayForecastItem } from '@/lib/engines/daily/windfall-wealth-engine';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Trophy, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DrawDaysForecastViewProps {
  forecast: DrawDayForecastItem[];
}

export function DrawDaysForecastView({ forecast }: DrawDaysForecastViewProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-400" />
          <span className="font-bold text-white tracking-wide">
            未来 7 天 · 新马各大博彩公司开彩日与偏财运势周历
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          高亮标出周三、六、日定期彩与周二特别彩（Special Draw），预告财福气数强弱
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {forecast.map((item, idx) => (
          <div
            key={item.date}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              item.isDrawDay
                ? 'bg-gradient-to-b from-[#111726] to-[#0A0D15] border-gold-500/40 shadow-lg'
                : 'bg-[#070A12]/80 border-slate-800/80 text-slate-400'
            }`}
          >
            {/* Day Header */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white font-mono">
                  {item.date.slice(5)} ({item.dayOfWeekZh})
                </span>
                {item.isDrawDay && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px] px-1.5 py-0">
                    开彩日
                  </Badge>
                )}
              </div>

              {/* Day Stem-Branch */}
              <div className="text-[11px] text-slate-400 font-mono mb-2">{item.dayStemBranch}</div>

              {/* Draw Type Badge */}
              <div className="text-[10px] mb-2.5">
                {item.isDrawDay ? (
                  <span className="text-gold-300 font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-gold-400 shrink-0" />
                    {item.drawTypeZh}
                  </span>
                ) : (
                  <span className="text-slate-500">{item.drawTypeZh}</span>
                )}
              </div>
            </div>

            {/* Score & Advice */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-slate-400">偏财指数</span>
                <span
                  className={`text-lg font-mono font-bold ${
                    item.score >= 70
                      ? 'text-emerald-300'
                      : item.score <= 45
                      ? 'text-rose-400'
                      : 'text-gold-300'
                  }`}
                >
                  {item.score}
                </span>
              </div>

              <div
                className={`px-2 py-0.5 rounded text-[10px] text-center font-semibold ${
                  item.suitability === 'SUITABLE'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : item.suitability === 'STRICTLY_AVOID'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.suitabilityZh}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {item.advice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
