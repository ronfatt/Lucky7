// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 官方全平台开彩出奖大厅
// File: app/draws/page.tsx
// Displays multi-platform lottery draw results with automatic highlighting of member predicted numbers
// ==========================================================

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Award,
  Filter,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import { useUserProfile } from '@/lib/profile/user-profile-store';
import { MemberDailyCalculator } from '@/lib/prediction/member-daily-calculator';
import { MalaysiaLotteryProvider, MALAYSIAN_OPERATORS } from '@/lib/lottery/malaysia-provider';
import { LotteryHitEngine, type DailyDrawHitReport } from '@/lib/lottery/lottery-hit-engine';
import type { MalaysianOperator } from '@/types/zwtsp';

export default function LotteryDrawsPage() {
  const { profile } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState('2026-09-16');
  const [activeRegion, setActiveRegion] = useState<'ALL' | 'WEST' | 'EAST' | 'SG'>('ALL');

  // Compute member's motherCode and variations for selectedDate via MemberDailyCalculator
  const memberPrediction = useMemo(() => {
    try {
      const res = MemberDailyCalculator.calculate(
        {
          id: profile.id,
          email: (profile as any).email,
          name: profile.name,
          gender: profile.gender,
          birth_date: profile.birthDate,
          birth_time: profile.birthTime,
          timezone: profile.timezone,
        },
        selectedDate
      );
      return {
        motherCode: res.motherCode,
        variations: res.variations || [],
      };
    } catch {
      return {
        motherCode: '4729',
        variations: ['7429', '4497', '3168', '2412'],
      };
    }
  }, [profile, selectedDate]);

  // Compute Hit Report
  const hitReport: DailyDrawHitReport = useMemo(() => {
    return LotteryHitEngine.checkHitsForDate(
      selectedDate,
      memberPrediction.motherCode,
      memberPrediction.variations
    );
  }, [selectedDate, memberPrediction]);

  // Get all draws for selectedDate
  const allDraws = useMemo(() => {
    return MalaysiaLotteryProvider.getDrawsByDate(selectedDate);
  }, [selectedDate]);

  // Filter draws by region
  const filteredDraws = useMemo(() => {
    return allDraws.filter((draw) => {
      if (activeRegion === 'ALL') return true;
      if (activeRegion === 'WEST') {
        return ['MAGNUM', 'DAMACAI', 'TOTO'].includes(draw.operator);
      }
      if (activeRegion === 'EAST') {
        return ['CASHSWEEP', 'SABAH88', 'STC'].includes(draw.operator);
      }
      if (activeRegion === 'SG') {
        return draw.operator === 'SINGAPORE';
      }
      return true;
    });
  }, [allDraws, activeRegion]);

  // Fast set of user numbers for highlight
  const userNumbersSet = useMemo(() => {
    const set = new Set<string>();
    if (memberPrediction.motherCode) set.add(memberPrediction.motherCode);
    memberPrediction.variations.forEach((v) => set.add(v));
    return set;
  }, [memberPrediction]);

  const isUserMatch = (num: string | undefined) => {
    if (!num) return false;
    return userNumbersSet.has(num.trim());
  };

  const isUserMotherMatch = (num: string | undefined) => {
    if (!num) return false;
    return num.trim() === memberPrediction.motherCode;
  };

  const opMetaMap = useMemo(() => {
    const map = new Map<string, (typeof MALAYSIAN_OPERATORS)[0]>();
    for (const op of MALAYSIAN_OPERATORS) {
      map.set(op.id, op);
    }
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-obsidian-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white font-serif tracking-wide">
                  官方全平台开彩大厅
                </h1>
                <Badge variant="gold" className="text-[10px]">
                  新马 7 大博彩联动
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                每晚 19:30 自动与命主当日 4 位核心推演母码及 12 组同频变体进行智能对奖
              </p>
            </div>
          </div>

          {/* Date Selector & Regions */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#060810] border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-gold-200 focus:outline-none font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#060810] border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveRegion('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeRegion === 'ALL'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                全部
              </button>
              <button
                type="button"
                onClick={() => setActiveRegion('WEST')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeRegion === 'WEST'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                西马三大彩
              </button>
              <button
                type="button"
                onClick={() => setActiveRegion('EAST')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeRegion === 'EAST'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                东马三大彩
              </button>
              <button
                type="button"
                onClick={() => setActiveRegion('SG')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeRegion === 'SG'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                新加坡
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* User's Prediction Cross-Reference Bar */}
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-[#0d1322] via-[#090e18] to-[#0d1322] border-gold-500/30 rounded-2xl shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-serif">
                  命主【{profile.name}】当日核对号码池 ({selectedDate})
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gold-champagne font-serif">核心母码:</span>
                  <span className="font-mono font-black text-gold-300 text-lg tracking-wider bg-gold-500/10 px-2 py-0.5 rounded-lg border border-gold-500/40">
                    {memberPrediction.motherCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Hit Badge Outcome */}
            {hitReport.hasHit ? (
              <div className="p-2.5 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-gold-500/20 to-amber-500/20 border border-gold-500/60 flex items-center gap-2.5 shadow-md shadow-gold-500/10">
                <Trophy className="w-5 h-5 text-gold-400 animate-bounce" />
                <div>
                  <div className="text-xs font-bold text-gold-200">
                    🎉 今日已中出【{hitReport.highestOperatorZh} · {hitReport.highestTierZh.split(' ')[0]}】等 {hitReport.totalHits} 次奖项！
                  </div>
                  <div className="text-[10px] text-amber-300/80">
                    下方开彩板中，金色发光高亮者即为您命中的开出号码。
                  </div>
                </div>
              </div>
            ) : hitReport.drawsAvailable ? (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>今日官方开彩已全部揭晓，暂无命中</span>
              </div>
            ) : (
              <div className="text-xs text-amber-400/80 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>开彩进行中或待揭晓（每日 19:00 - 19:30 揭晓）</span>
              </div>
            )}
          </div>

          {/* 12 Variations Strip */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
              <span>纳入全自动对奖之 12 组同频变体：</span>
              <span className="text-[10px] text-slate-500">（凡符合开出数字者自动镀金高亮）</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {memberPrediction.variations.map((vNum, vIdx) => {
                const isHit = hitReport.hits.some((h) => h.matchedNumber === vNum);
                return (
                  <span
                    key={vIdx}
                    className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition ${
                      isHit
                        ? 'bg-gold-500 text-obsidian-950 border-amber-300 shadow-sm shadow-gold-500/30'
                        : 'bg-obsidian-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    {vNum}
                  </span>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Multi-Platform Draw Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDraws.map((draw) => {
            const opInfo = opMetaMap.get(draw.operator);
            const drawHit = hitReport.hits.find((h) => h.operator === draw.operator);

            return (
              <Card
                key={draw.id}
                className={`rounded-2xl overflow-hidden border transition-all ${
                  drawHit
                    ? 'border-gold-500/80 bg-gradient-to-b from-[#141b2e] to-[#0b101c] shadow-[0_0_25px_rgba(234,179,8,0.2)]'
                    : 'border-slate-800/80 bg-obsidian-950/80 hover:border-slate-700'
                }`}
              >
                {/* Operator Card Header */}
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        opInfo?.badgeColor || 'bg-slate-800 text-white'
                      }`}
                    >
                      {draw.operator}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-serif">
                        {opInfo?.nameZh || draw.operator}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        期号: {draw.drawNo} · {draw.drawDate}
                      </p>
                    </div>
                  </div>

                  {drawHit && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 font-black text-[10px] uppercase shadow-sm">
                      🎉 中出 {drawHit.tierZh.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Prizes Grid */}
                <div className="p-4 space-y-4">
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* First Prize */}
                    <div className="p-2.5 rounded-xl bg-[#090D18] border border-gold-500/30 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold block font-serif">
                        🥇 头奖
                      </span>
                      <div
                        className={`font-mono text-base font-black tracking-wider ${
                          isUserMatch(draw.firstPrize)
                            ? 'text-obsidian-950 bg-gold-400 px-1 rounded shadow-md animate-pulse'
                            : 'text-gold-200'
                        }`}
                      >
                        {draw.firstPrize}
                      </div>
                      {isUserMatch(draw.firstPrize) && (
                        <span className="text-[9px] text-gold-300 font-bold block">
                          {isUserMotherMatch(draw.firstPrize) ? '★ 核心命中' : '变体命中'}
                        </span>
                      )}
                    </div>

                    {/* Second Prize */}
                    <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block font-serif">
                        🥈 二奖
                      </span>
                      <div
                        className={`font-mono text-base font-black tracking-wider ${
                          isUserMatch(draw.secondPrize)
                            ? 'text-obsidian-950 bg-gold-400 px-1 rounded shadow-md animate-pulse'
                            : 'text-slate-200'
                        }`}
                      >
                        {draw.secondPrize}
                      </div>
                      {isUserMatch(draw.secondPrize) && (
                        <span className="text-[9px] text-gold-300 font-bold block">
                          {isUserMotherMatch(draw.secondPrize) ? '★ 核心命中' : '变体命中'}
                        </span>
                      )}
                    </div>

                    {/* Third Prize */}
                    <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-amber-600 font-bold block font-serif">
                        🥉 三奖
                      </span>
                      <div
                        className={`font-mono text-base font-black tracking-wider ${
                          isUserMatch(draw.thirdPrize)
                            ? 'text-obsidian-950 bg-gold-400 px-1 rounded shadow-md animate-pulse'
                            : 'text-slate-200'
                        }`}
                      >
                        {draw.thirdPrize}
                      </div>
                      {isUserMatch(draw.thirdPrize) && (
                        <span className="text-[9px] text-gold-300 font-bold block">
                          {isUserMotherMatch(draw.thirdPrize) ? '★ 核心命中' : '变体命中'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Special Prizes (10) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 font-serif block">
                      特别奖 (Special)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                      {draw.specialPrizes?.map((num, idx) => {
                        const hit = isUserMatch(num);
                        return (
                          <div
                            key={idx}
                            className={`p-1 rounded-lg border transition ${
                              hit
                                ? 'bg-gold-500 text-obsidian-950 font-black border-amber-300 shadow-md animate-pulse'
                                : 'bg-[#080B14] text-slate-300 border-slate-800/80'
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consolation Prizes (10) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 font-serif block">
                      安慰奖 (Consolation)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                      {draw.consolationPrizes?.map((num, idx) => {
                        const hit = isUserMatch(num);
                        return (
                          <div
                            key={idx}
                            className={`p-1 rounded-lg border transition ${
                              hit
                                ? 'bg-gold-500 text-obsidian-950 font-black border-amber-300 shadow-md animate-pulse'
                                : 'bg-[#080B14] text-slate-400 border-slate-800/80'
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
