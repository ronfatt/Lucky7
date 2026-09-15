'use client';

import React, { useState, useMemo } from 'react';
import type { BirthProfile } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, CalendarDays, ArrowRight, TrendingUp } from 'lucide-react';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { DIRECTION_SECTORS } from '@/lib/directions/direction-models';
import Link from 'next/link';

export default function CompassHistoryPage() {
  const [profile] = useState<BirthProfile>({
    name: '李知命 (示范档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    birthPlace: '浙江杭州',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  });

  const fourPillars = useMemo(() => FourPillarsEngine.calculateFourPillars(profile), [profile]);
  const ziweiChart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const personalDNA = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);
  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, ziweiChart, personalDNA);
  }, [fourPillars, ziweiChart, personalDNA]);

  // Generate 7-day rolling window of direction scores
  const days = ['2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14'];

  const historyData = useMemo(() => {
    return days.map((dateStr) => {
      const dailySig = DailyEngine.generateDailySignature(dateStr, profile.timezone);
      const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
      const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);
      const result = DailyDirectionEngine.calculateDailyDirections(
        dateStr,
        personalDirections,
        dailySig,
        activeNumbers,
        activePalaces
      );
      return {
        date: dateStr,
        dailySig,
        result,
      };
    });
  }, [days, profile.timezone, ziweiChart, personalDNA, personalDirections]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">时空方位周期历史</h1>
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
              7日滚动趋势
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            追踪每日流日干支与九宫八方气场的流转动态，洞察方位共振规律。
          </p>
        </div>

        <Link
          href="/compass"
          className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          返回今日罗盘
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* History Cards */}
      <div className="space-y-4">
        {historyData.map(({ date, dailySig, result }) => {
          const topSec = DIRECTION_SECTORS[result.topDirection];
          const topScore = result.directionScores[result.topDirection];
          const isToday = date === '2026-09-13';

          return (
            <Card
              key={date}
              className={`p-5 border transition-all ${
                isToday
                  ? 'bg-[#0F172A] border-gold-500/50 shadow-lg shadow-gold-500/5'
                  : 'bg-[#0B0F19]/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center w-16 p-2 rounded-xl bg-[#070A12] border border-slate-800">
                    <div className="text-[10px] text-slate-500">{date.slice(5, 7)}月</div>
                    <div className="text-xl font-bold text-white">{date.slice(8, 10)}</div>
                    {isToday && (
                      <span className="text-[9px] text-gold-400 font-semibold">今日</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {dailySig.yearStemBranch}年 · {dailySig.lunarDate}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                        {dailySig.solarTerm.currentTerm} · {dailySig.dominantElement}
                      </Badge>
                      {result.isContested && (
                        <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                          信号接近
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      首选用方：
                      <strong className="text-gold-300 font-semibold">
                        {topSec.nameZh} ({topSec.baguaName}卦·{topSec.element})
                      </strong>{' '}
                      · 指数{' '}
                      <span className="font-mono text-gold-400 font-bold">
                        {topScore.score.toFixed(1)}分
                      </span>{' '}
                      · 次选【{DIRECTION_SECTORS[result.secondaryDirection].nameZh}】
                    </div>
                  </div>
                </div>

                {/* Resonant numbers pills */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-500">该日方位共振数</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {topScore.resonantDigits.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-300 font-mono text-xs font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/compass`}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <Compass className="w-4 h-4 text-gold-400" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
