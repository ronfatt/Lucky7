// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Wealth Direction Compass Card
// File: components/compass/WealthDirectionCompassCard.tsx
// ==========================================================

'use client';

import React from 'react';
import { WealthDirectionGuide } from '@/lib/directions/wealth-direction-navigator';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, Navigation, Clock, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface WealthDirectionCompassCardProps {
  guide: WealthDirectionGuide;
}

export function WealthDirectionCompassCard({ guide }: WealthDirectionCompassCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#0F1422] via-[#0B0F19] to-[#070A12] border-gold-500/30 p-6 flex flex-col justify-between shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              今日财神吉位 · 实景罗盘导航
            </h3>
          </div>
          <Badge variant="outline" className="text-xs border-gold-500/40 text-gold-300">
            {guide.primaryNameZh.split(' ')[0]}
          </Badge>
        </div>

        {/* Compass Visual + Primary Info */}
        <div className="py-4 flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Compass Dial */}
          <div className="relative w-32 h-32 rounded-full border-2 border-slate-700/80 bg-[#070A12] flex items-center justify-center shadow-inner shrink-0">
            {/* Cardinal Marks */}
            <span className="absolute top-1 text-[9px] font-mono text-slate-500">北 N</span>
            <span className="absolute bottom-1 text-[9px] font-mono text-gold-400 font-bold">南 S</span>
            <span className="absolute left-1.5 text-[9px] font-mono text-slate-500">西 W</span>
            <span className="absolute right-1.5 text-[9px] font-mono text-slate-500">东 E</span>

            {/* Inner Ring */}
            <div className="w-20 h-20 rounded-full border border-dashed border-gold-500/25 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(234,179,8,0.8)] z-10" />
            </div>

            {/* Rotating Golden Pointer Needle */}
            <div
              className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${guide.primaryDegree}deg)` }}
            >
              {/* Arrow Head pointing to degree */}
              <div className="absolute top-3 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gold-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.9)]" />
              {/* Tail */}
              <div className="absolute bottom-3 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[14px] border-t-slate-600" />
            </div>
          </div>

          {/* Directional Summary Details */}
          <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                今日最旺纳气方位 (Primary Azimuth)
              </span>
              <strong className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-200 block mt-0.5">
                {guide.primaryNameZh} · {guide.primaryDegree}°
              </strong>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                次吉位：{guide.secondaryNameZh.split(' ')[0]} ({guide.secondaryDegree}°)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300">
                冲克避向：{guide.avoidNameZh.split(' ')[0]}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              {guide.tripAdviceZh}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Outing Time Tip */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-gold-300">
          <Clock className="w-3.5 h-3.5" />
          <span>出行买彩最佳时机：{guide.auspiciousHourWindow}</span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">九宫飞星生合算法</span>
      </div>
    </Card>
  );
}
