// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Draw Countdown Banner
// File: components/dashboard/DrawCountdownBanner.tsx
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Trophy, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DrawCountdownBannerProps {
  dateStr?: string;
}

export function DrawCountdownBanner({ dateStr = '2026-09-13' }: DrawCountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    hours: 1,
    minutes: 42,
    seconds: 30,
    isPast: false,
  });

  // Determine if date is draw day (Wed=3, Sat=6, Sun=0, Tue=2 Special)
  const drawDate = new Date(dateStr);
  const dayOfWeek = drawDate.getDay();
  const isRegularDraw = dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 6;
  const isSpecialDraw = dayOfWeek === 2;
  const isDrawDay = isRegularDraw || isSpecialDraw;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target today 19:00:00 (7:00 PM)
      const target = new Date(now);
      target.setHours(19, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all ${
      isDrawDay
        ? 'bg-gradient-to-r from-amber-950/40 via-[#0E1424] to-[#0A0E1A] border-gold-500/40 shadow-lg shadow-gold-500/5'
        : 'bg-[#070A12]/90 border-slate-800 text-slate-400'
    }`}>
      {/* Left: Status and Badges */}
      <div className="flex items-center gap-2.5">
        <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
          <Trophy className="w-4 h-4" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-white text-xs">
              {isDrawDay
                ? isSpecialDraw
                  ? '新马各大博彩 · 周二特别开彩日 (Special Draw)'
                  : '新马各大博彩 · 今日官方开彩日'
                : '今日为非开彩日 (修养蓄力)'}
            </strong>
            {isDrawDay && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                万能 / 大马彩 / 多多 19:00 开彩
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            涵盖西马三大彩、东马三大彩（砂拉越、沙巴、山打根）及新加坡博彩
          </p>
        </div>
      </div>

      {/* Right: Live Countdown Display */}
      {isDrawDay ? (
        <div className="flex items-center gap-2 font-mono shrink-0">
          {!timeLeft.isPast ? (
            <>
              <Clock className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="text-slate-400 text-[11px]">距离开奖仅剩:</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-gold-300 font-bold text-xs">
                  {formatDigits(timeLeft.hours)}
                </span>
                <span className="text-slate-500">:</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-gold-300 font-bold text-xs">
                  {formatDigits(timeLeft.minutes)}
                </span>
                <span className="text-slate-500">:</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-gold-300 font-bold text-xs">
                  {formatDigits(timeLeft.seconds)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-emerald-400 font-sans text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>今日开彩已揭晓</span>
              </div>
              <Link
                href="/draws"
                className="px-2 py-0.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 font-bold text-[11px] transition"
              >
                查看各平台中奖出彩 &rarr;
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] text-slate-500">
          下次常规定期开彩：星期三 / 星期六 / 星期日
        </div>
      )}
    </div>
  );
}
