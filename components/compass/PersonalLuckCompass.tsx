'use client';

import React, { useState, useMemo } from 'react';
import type {
  BirthProfile,
  DailyDirectionResult,
  DailyDirectionSectorScore,
  DirectionCode,
  PersonalDirectionProfile,
  PersonalDirectionScore,
} from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Sparkles,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Lock,
  ChevronRight,
  ShieldAlert,
  Info,
  RotateCcw,
} from 'lucide-react';
import {
  ALL_DIRECTION_CODES,
  DIRECTION_SECTORS,
  normalizeAzimuth,
} from '@/lib/directions/direction-models';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { SpatialNumberMatrix } from '@/lib/directions/spatial-number-matrix';

interface PersonalLuckCompassProps {
  profile: BirthProfile;
  initialDate?: string;
  defaultMode?: 'daily' | 'personal';
}

export function PersonalLuckCompass({
  profile,
  initialDate = '2026-09-13',
  defaultMode = 'daily',
}: PersonalLuckCompassProps) {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [viewMode, setViewMode] = useState<'daily' | 'personal'>(defaultMode);
  const [selectedDirection, setSelectedDirection] = useState<DirectionCode>('S');

  // 1. Static Profile Computations
  const fourPillars = useMemo(() => {
    return FourPillarsEngine.calculateFourPillars(profile);
  }, [profile]);

  const ziweiChart = useMemo(() => {
    return ZiWeiEngine.generateChart(profile);
  }, [profile]);

  const personalDNA = useMemo(() => {
    return PersonalNumberDNAEngine.generateDNA(profile);
  }, [profile]);

  const personalDirections: PersonalDirectionProfile = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(
      fourPillars,
      ziweiChart,
      personalDNA
    );
  }, [fourPillars, ziweiChart, personalDNA]);

  // 2. Dynamic Daily Computations
  const dailySig = useMemo(() => {
    return DailyEngine.generateDailySignature(selectedDate, profile.timezone);
  }, [selectedDate, profile.timezone]);

  const activePalaces = useMemo(() => {
    return DailyEngine.activatePalaces(ziweiChart, dailySig);
  }, [ziweiChart, dailySig]);

  const activeNumbers = useMemo(() => {
    return DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);
  }, [personalDNA, activePalaces, dailySig]);

  const dailyDirections: DailyDirectionResult = useMemo(() => {
    return DailyDirectionEngine.calculateDailyDirections(
      selectedDate,
      personalDirections,
      dailySig,
      activeNumbers,
      activePalaces
    );
  }, [selectedDate, personalDirections, dailySig, activeNumbers, activePalaces]);

  // Set default selected direction to top direction if daily
  const topDailyDir = dailyDirections.topDirection;
  const currentSelected = selectedDirection || topDailyDir;

  const currentSector = DIRECTION_SECTORS[currentSelected];
  const currentDailyScore = dailyDirections.directionScores[currentSelected];
  const currentPersonalScore = personalDirections.directionScores[currentSelected];

  // Colors based on score/tier
  const getSectorColor = (code: DirectionCode) => {
    const score =
      viewMode === 'daily'
        ? dailyDirections.directionScores[code].score
        : personalDirections.directionScores[code].score;

    const isSelected = code === currentSelected;
    const isTop =
      viewMode === 'daily'
        ? code === dailyDirections.topDirection
        : code === personalDirections.bestDirection;

    if (isSelected) {
      return {
        fill: 'rgba(212, 175, 55, 0.45)', // Gold glowing
        stroke: '#D4AF37',
        strokeWidth: 3,
      };
    }

    if (isTop) {
      return {
        fill: 'rgba(212, 175, 55, 0.25)',
        stroke: '#D4AF37',
        strokeWidth: 2,
      };
    }

    if (score >= 80) {
      return { fill: 'rgba(59, 130, 246, 0.22)', stroke: 'rgba(59, 130, 246, 0.5)', strokeWidth: 1 };
    }
    if (score >= 65) {
      return { fill: 'rgba(16, 185, 129, 0.15)', stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 1 };
    }
    if (score >= 50) {
      return { fill: 'rgba(148, 163, 184, 0.10)', stroke: 'rgba(148, 163, 184, 0.3)', strokeWidth: 1 };
    }
    return { fill: 'rgba(239, 68, 68, 0.12)', stroke: 'rgba(239, 68, 68, 0.35)', strokeWidth: 1 };
  };

  // Helper to draw SVG sector slice
  // Center is (cx, cy), R_in is inner radius, R_out is outer radius
  // Angles: 0deg is 12 o'clock (North), angles increase clockwise
  const describeArcSlice = (
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    startDeg: number,
    endDeg: number
  ) => {
    // Convert degrees to math radians (where 0 is 3 o'clock counter-clockwise)
    // To have 0deg at 12 o'clock clockwise: rad = (deg - 90) * (PI / 180)
    const rad1 = ((startDeg - 90) * Math.PI) / 180;
    const rad2 = ((endDeg - 90) * Math.PI) / 180;

    const x1Out = cx + rOut * Math.cos(rad1);
    const y1Out = cy + rOut * Math.sin(rad1);
    const x2Out = cx + rOut * Math.cos(rad2);
    const y2Out = cy + rOut * Math.sin(rad2);

    const x1In = cx + rIn * Math.cos(rad1);
    const y1In = cy + rIn * Math.sin(rad1);
    const x2In = cx + rIn * Math.cos(rad2);
    const y2In = cy + rIn * Math.sin(rad2);

    return [
      `M ${x1In} ${y1In}`,
      `L ${x1Out} ${y1Out}`,
      `A ${rOut} ${rOut} 0 0 1 ${x2Out} ${y2Out}`,
      `L ${x2In} ${y2In}`,
      `A ${rIn} ${rIn} 0 0 0 ${x1In} ${y1In}`,
      'Z',
    ].join(' ');
  };

  const cx = 210;
  const cy = 210;
  const rOuter = 190;
  const rInner = 85;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F1420]/80 border border-gold-500/20 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-gold-400 animate-spin-slow" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              {viewMode === 'daily' ? '今日时空罗盘' : '先天本命方位'}
            </h1>
            <Badge variant="outline" className="text-xs border-gold-500/40 text-gold-300">
              {viewMode === 'daily' ? 'Dynamic Time-Space' : 'Static Natal'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            正北朝上固定视图 (North-up) · 八方九宫数理共振 · 时空与先天气场加权
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-[#070A12] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'daily'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              今日时空 (动态)
            </button>
            <button
              onClick={() => setViewMode('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'personal'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              先天本命 (静态)
            </button>
          </div>

          {/* Date Picker (only in daily mode) */}
          {viewMode === 'daily' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#070A12] border border-slate-800 text-xs text-gold-300 px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50"
            />
          )}
        </div>
      </div>

      {/* Contested Direction Warning Notice */}
      {viewMode === 'daily' && dailyDirections.isContested && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-300 text-sm mb-0.5">
              今日时空方位并峙信号 (Direction Contested)
            </div>
            <p className="leading-relaxed opacity-90">{dailyDirections.contestedReason}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Compass Visual & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Circular Compass */}
        <Card className="lg:col-span-7 bg-[#0B0F19]/90 border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Degree Indicator Bar */}
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-4 mb-2 z-10">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              正北 0° (固定朝上)
            </span>
            <span>
              当前查看：
              <strong className="text-gold-300 font-medium">
                {currentSector.nameZh} ({currentSector.degreeMin}° - {currentSector.degreeMax}°)
              </strong>
            </span>
            <span className="text-slate-500">点击扇区切换查看</span>
          </div>

          {/* SVG Compass Container */}
          <div className="relative p-2 flex items-center justify-center">
            <svg
              width="420"
              height="420"
              viewBox="0 0 420 420"
              className="select-none filter drop-shadow-2xl"
            >
              <defs>
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0B0F19" />
                </radialGradient>
              </defs>

              {/* Outer Dial Dial Scale & Markings */}
              <circle
                cx={cx}
                cy={cy}
                r={rOuter + 8}
                fill="none"
                stroke="#1E293B"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={cy}
                r={rOuter}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* 360 Degree Ticks */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isMajor = deg % 45 === 0;
                const isMedium = deg % 15 === 0;
                const tickLen = isMajor ? 10 : isMedium ? 6 : 3;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = cx + (rOuter + 4) * Math.cos(rad);
                const y1 = cy + (rOuter + 4) * Math.sin(rad);
                const x2 = cx + (rOuter + 4 + tickLen) * Math.cos(rad);
                const y2 = cy + (rOuter + 4 + tickLen) * Math.sin(rad);

                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#D4AF37' : isMedium ? '#64748B' : '#334155'}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}

              {/* 8 Direction Sectors */}
              {ALL_DIRECTION_CODES.map((code) => {
                const sec = DIRECTION_SECTORS[code];
                const startDeg = sec.code === 'N' ? -22.5 : sec.degreeMin;
                const endDeg = sec.code === 'N' ? 22.5 : sec.degreeMax;
                const dPath = describeArcSlice(cx, cy, rInner, rOuter, startDeg, endDeg);
                const style = getSectorColor(code);

                // Label Position (Center radius between rInner and rOuter)
                const midRad = ((sec.degreeCenter - 90) * Math.PI) / 180;
                const labelR = (rInner + rOuter) / 2;
                const labelX = cx + labelR * Math.cos(midRad);
                const labelY = cy + labelR * Math.sin(midRad);

                const score =
                  viewMode === 'daily'
                    ? dailyDirections.directionScores[code].score
                    : personalDirections.directionScores[code].score;

                return (
                  <g
                    key={code}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    onClick={() => setSelectedDirection(code)}
                  >
                    <path
                      d={dPath}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                    />

                    {/* Sector Text Labels */}
                    <text
                      x={labelX}
                      y={labelY - 14}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow"
                    >
                      {sec.nameZh}
                    </text>
                    <text
                      x={labelX}
                      y={labelY + 2}
                      textAnchor="middle"
                      fill="#C5A059"
                      fontSize="11"
                      className="pointer-events-none"
                    >
                      {sec.baguaName}卦 · {sec.baguaTrigram}
                    </text>
                    <text
                      x={labelX}
                      y={labelY + 18}
                      textAnchor="middle"
                      fill={score >= 70 ? '#38BDF8' : '#94A3B8'}
                      fontSize="11"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {score.toFixed(1)}分
                    </text>
                  </g>
                );
              })}

              {/* Crosshair (天心十道) */}
              <line
                x1={cx}
                y1={cy - rOuter}
                x2={cx}
                y2={cy + rOuter}
                stroke="rgba(212, 175, 55, 0.2)"
                strokeDasharray="2,4"
              />
              <line
                x1={cx - rOuter}
                y1={cy}
                x2={cx + rOuter}
                y2={cy}
                stroke="rgba(212, 175, 55, 0.2)"
                strokeDasharray="2,4"
              />

              {/* Central Pivot & Taiji Center Hub */}
              <circle
                cx={cx}
                cy={cy}
                r={rInner - 4}
                fill="url(#centerGradient)"
                stroke="#D4AF37"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={cy}
                r={rInner - 12}
                fill="none"
                stroke="rgba(212, 175, 55, 0.3)"
                strokeWidth="1"
              />

              {/* Center Info Text */}
              <text
                x={cx}
                y={cy - 24}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                letterSpacing="1"
              >
                {viewMode === 'daily' ? '今日时空首选' : '先天本命首利'}
              </text>
              <text
                x={cx}
                y={cy + 2}
                textAnchor="middle"
                fill="#D4AF37"
                fontSize="22"
                fontWeight="bold"
              >
                {viewMode === 'daily'
                  ? DIRECTION_SECTORS[dailyDirections.topDirection].nameZh
                  : DIRECTION_SECTORS[personalDirections.bestDirection].nameZh}
              </text>
              <text
                x={cx}
                y={cy + 20}
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="11"
                fontWeight="500"
              >
                指数：
                {viewMode === 'daily'
                  ? dailyDirections.directionScores[dailyDirections.topDirection].score.toFixed(1)
                  : personalDirections.directionScores[personalDirections.bestDirection].score.toFixed(1)}{' '}
                分
              </text>
              <text
                x={cx}
                y={cy + 36}
                textAnchor="middle"
                fill="#64748B"
                fontSize="9"
              >
                信赖度：{dailyDirections.confidenceScore}%
              </text>
            </svg>
          </div>

          {/* Compass Footer Status Bar */}
          <div className="w-full mt-4 p-3 bg-[#070A12]/60 rounded-xl border border-slate-800/80 flex items-center justify-around text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">方位一致性</div>
              <div className="text-gold-400 font-bold">{dailyDirections.consistencyScore}%</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-[10px]">模型信赖度</div>
              <div className="text-emerald-400 font-bold">{dailyDirections.confidenceScore}%</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-[10px]">次选吉方</div>
              <div className="text-blue-300 font-bold">
                {viewMode === 'daily'
                  ? DIRECTION_SECTORS[dailyDirections.secondaryDirection].nameZh
                  : DIRECTION_SECTORS[personalDirections.secondaryDirection].nameZh}
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-[10px]">慎用方位</div>
              <div className="text-rose-400 font-bold">
                {viewMode === 'daily'
                  ? DIRECTION_SECTORS[dailyDirections.leastDirection].nameZh
                  : DIRECTION_SECTORS[personalDirections.weakDirection].nameZh}
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Direction Inspector & Resonance Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-5">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-300 text-xl font-bold">
                  {currentSector.baguaTrigram}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {currentSector.nameZh} ({currentSector.nameEn})
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        (viewMode === 'daily' ? currentDailyScore.score : currentPersonalScore.score) >=
                        75
                          ? 'border-emerald-500/40 text-emerald-300'
                          : 'border-slate-700 text-slate-300'
                      }`}
                    >
                      {viewMode === 'daily' ? currentDailyScore.tier : `Rank #${currentPersonalScore.rank}`}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    方位角：{currentSector.degreeMin}° ~ {currentSector.degreeMax}° (中心 {currentSector.degreeCenter}°)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-gold-400">
                  {viewMode === 'daily'
                    ? currentDailyScore.score.toFixed(1)
                    : currentPersonalScore.score.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-500">综合指数分</div>
              </div>
            </div>

            {/* Metaphysical Attributes Grid */}
            <div className="grid grid-cols-3 gap-2 my-4 text-xs">
              <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">后天八卦</div>
                <div className="text-white font-medium mt-0.5">
                  {currentSector.baguaName}卦 · {currentSector.element}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">洛书九宫数</div>
                <div className="text-gold-300 font-bold mt-0.5">
                  {currentSector.luoshuNumber} 号宫
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070A12] border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">对应地支</div>
                <div className="text-blue-300 font-medium mt-0.5">
                  {currentSector.earthlyBranches.join('、')}
                </div>
              </div>
            </div>

            {/* Resonant Numbers for this Direction */}
            {viewMode === 'daily' && (
              <div className="p-3.5 rounded-xl bg-gold-500/5 border border-gold-500/20 mb-4">
                <div className="text-xs font-semibold text-gold-300 flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    该方位时空共振数字 (Spatial Resonant Digits)
                  </span>
                  <span className="text-[10px] text-gold-400/70">8×10数理矩阵映射</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentDailyScore.resonantDigits.map((digit) => (
                    <div
                      key={digit}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#070A12] border border-gold-500/30 text-center"
                    >
                      <div className="text-lg font-bold text-white">{digit}</div>
                      <div className="text-[10px] text-slate-400">
                        共振 {dailyDirections.spatialNumberMatrix[currentSelected][digit]}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auspicious Time Windows for this Direction */}
            {viewMode === 'daily' && (
              <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 mb-4">
                <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  方位对应吉时窗口 (Auspicious Time Windows)
                </div>
                <div className="space-y-1.5 text-xs">
                  {currentDailyScore.auspiciousHours.map((hour, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-slate-400 px-2 py-1 rounded bg-slate-900/50"
                    >
                      <span>{hour}</span>
                      <span className="text-emerald-400 text-[11px]">气场顺遂</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Weights Breakdown (Daily Mode) */}
            {viewMode === 'daily' && (
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-slate-400 mb-1">
                  今日时空加权细分 (Weights Breakdown)
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>先天个人方位兼容性 (35%)</span>
                    <span className="font-mono text-gold-300">
                      {currentDailyScore.breakdown.personalCompatibility.toFixed(1)}分
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gold-400 h-full rounded-full"
                      style={{ width: `${currentDailyScore.breakdown.personalCompatibility}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1">
                    <span>日干五行生克感应 (20%)</span>
                    <span className="font-mono text-blue-300">
                      {currentDailyScore.breakdown.elementInteraction.toFixed(1)}分
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${currentDailyScore.breakdown.elementInteraction}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1">
                    <span>激活数字数理共振 (15%)</span>
                    <span className="font-mono text-emerald-300">
                      {currentDailyScore.breakdown.activatedDigitsScore.toFixed(1)}分
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${currentDailyScore.breakdown.activatedDigitsScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Static Weights Breakdown (Personal Mode) */}
            {viewMode === 'personal' && (
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-slate-400 mb-1">
                  先天个人本命 7 重权重细分
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>日主五行生克 (30%)</span>
                    <span className="text-gold-300">{currentPersonalScore.elementScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>数理DNA共振 (20%)</span>
                    <span className="text-gold-300">{currentPersonalScore.numberDnaScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>紫微命宫地支映射 (15%)</span>
                    <span className="text-gold-300">{currentPersonalScore.lifePalaceScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>紫微身宫地支映射 (10%)</span>
                    <span className="text-gold-300">{currentPersonalScore.bodyPalaceScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>洛书核心契合 (10%)</span>
                    <span className="text-gold-300">{currentPersonalScore.luoshuScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                    <span>八卦阴阳合德 (10%)</span>
                    <span className="text-gold-300">{currentPersonalScore.baguaScore.toFixed(1)}分</span>
                  </div>
                  <div className="flex justify-between text-slate-300 py-1">
                    <span>五行局象加成 (5%)</span>
                    <span className="text-gold-300">{currentPersonalScore.bureauScore.toFixed(1)}分</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button: Disabled Phase 5 Hook */}
            <div className="pt-2">
              <Button
                disabled
                className="w-full bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                寻找此方向附近地点 (即将在 Phase 5 开启)
              </Button>
              <div className="text-[10px] text-slate-600 text-center mt-2">
                🔒 Phase 4 严禁接入物理地理地图与商户网点搜索
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Trace Explanation Card */}
      <Card className="bg-[#0B0F19]/90 border-slate-800 p-5">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-gold-400" />
            时空方位推演逻辑存证 (Traceability Log)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            透明公开系统方位得分与生克算法全流程，绝无不可解释黑箱
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="space-y-2 text-xs">
            {viewMode === 'daily' ? (
              dailyDirections.calculationTrace.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#070A12] border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-gold-400">{step.factor}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      +{step.points}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              currentPersonalScore.trace.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#070A12] border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-gold-400">{step.factor}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      +{step.points}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Legal & Metaphysical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-[11px] text-slate-500 leading-relaxed">
        <strong>⚠️ 郑重提示与免责声明：</strong>
        紫微时空数字预测系统（ZWTSP）基于传统易学、洛书九宫、紫微斗数与空间天体方位模型。
        本系统提供的方位与数理分析仅作为个人日常生活规划、传统文化研究及决策参考，
        <strong>绝不构成任何形式的彩票中奖保证、投资承诺或物理导航指引</strong>。请保持理智，切勿迷信或过度投注。
      </div>
    </div>
  );
}
