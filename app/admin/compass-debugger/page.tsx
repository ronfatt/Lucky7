'use client';

import React, { useState, useMemo } from 'react';
import type { BirthProfile, DirectionCode } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Compass, Sliders, Bug, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import {
  ALL_DIRECTION_CODES,
  DIRECTION_SECTORS,
  getSectorFromAzimuth,
  normalizeAzimuth,
} from '@/lib/directions/direction-models';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';

export default function CompassDebuggerPage() {
  const [testAzimuth, setTestAzimuth] = useState<number>(135);
  const [simDate, setSimDate] = useState<string>('2026-09-13');
  const [profile] = useState<BirthProfile>({
    name: '李知命 (调试档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  });

  const fourPillars = useMemo(() => FourPillarsEngine.calculateFourPillars(profile), [profile]);
  const ziweiChart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const personalDNA = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);
  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, ziweiChart, personalDNA);
  }, [fourPillars, ziweiChart, personalDNA]);

  const dailySig = useMemo(() => DailyEngine.generateDailySignature(simDate), [simDate]);
  const activePalaces = useMemo(() => DailyEngine.activatePalaces(ziweiChart, dailySig), [ziweiChart, dailySig]);
  const activeNumbers = useMemo(() => DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig), [personalDNA, activePalaces, dailySig]);

  const dailyDirections = useMemo(() => {
    return DailyDirectionEngine.calculateDailyDirections(
      simDate,
      personalDirections,
      dailySig,
      activeNumbers,
      activePalaces
    );
  }, [simDate, personalDirections, dailySig, activeNumbers, activePalaces]);

  const resolvedSector = getSectorFromAzimuth(testAzimuth);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              方位算法与罗盘调试台 (Compass Debugger)
            </h1>
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
              Developer & QA Tool
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            测试方位角解析 (Azimuth Normalization)、边界扇区判定、动态加权比对与相持态触发条件。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <Card className="lg:col-span-5 bg-[#0B0F19]/90 border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gold-400" />
              测试方位角 (Azimuth Slider)
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="-90"
                max="450"
                step="0.5"
                value={testAzimuth}
                onChange={(e) => setTestAzimuth(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
              <span className="font-mono text-gold-300 font-bold text-base w-16 text-right">
                {testAzimuth}°
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-90° (溢出负角)</span>
              <span>0° (北)</span>
              <span>180° (南)</span>
              <span>360°</span>
              <span>450° (超模测试)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-medium">方位角判定结果：</div>
            <div className="flex justify-between">
              <span className="text-slate-500">标准化方位角 (0-360°):</span>
              <span className="font-mono text-white font-bold">{normalizeAzimuth(testAzimuth)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">命中扇区代码:</span>
              <span className="font-mono text-gold-300 font-bold">{resolvedSector.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">扇区名称与八卦:</span>
              <span className="text-white">
                {resolvedSector.nameZh} · {resolvedSector.baguaName}卦 ({resolvedSector.element})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">扇区边界范围:</span>
              <span className="font-mono text-slate-300">
                {resolvedSector.degreeMin}° ~ {resolvedSector.degreeMax}°
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              模拟日期与时空签
            </h3>
            <input
              type="date"
              value={simDate}
              onChange={(e) => setSimDate(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 text-xs text-gold-300 p-2.5 rounded-xl"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
            <div className="text-slate-400 font-medium">相持态检查 (Contested Test):</div>
            <div className="flex justify-between">
              <span className="text-slate-500">是否相持 (分差≤2.0):</span>
              <span
                className={`font-bold ${
                  dailyDirections.isContested ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {dailyDirections.isContested ? 'TRUE (相持并峙)' : 'FALSE (优势明确)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">第一名 vs 第二名分差:</span>
              <span className="font-mono text-white">
                {(
                  dailyDirections.directionScores[dailyDirections.topDirection].score -
                  dailyDirections.directionScores[dailyDirections.secondaryDirection].score
                ).toFixed(2)}{' '}
                分
              </span>
            </div>
          </div>
        </Card>

        {/* 8 Directions Simulation Table */}
        <Card className="lg:col-span-7 bg-[#0B0F19]/90 border-slate-800 p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold text-white">
              8 方位实时综合得分与矩阵 (8 Sectors Live Diagnostics)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Personal (35%) + Element (20%) + Activated Digits (15%) + Palace (15%) + Time (10%) + Star (5%)
            </CardDescription>
          </CardHeader>

          <div className="space-y-3">
            {ALL_DIRECTION_CODES.map((code) => {
              const sec = DIRECTION_SECTORS[code];
              const scoreObj = dailyDirections.directionScores[code];
              const isResolved = resolvedSector.code === code;
              const isTop = dailyDirections.topDirection === code;

              return (
                <div
                  key={code}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isResolved
                      ? 'bg-gold-500/10 border-gold-500/60 ring-1 ring-gold-500/30'
                      : isTop
                      ? 'bg-blue-950/20 border-blue-500/40'
                      : 'bg-[#070A12] border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                        isTop ? 'bg-gold-500 text-obsidian-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{scoreObj.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-sm">{sec.nameZh}</strong>
                        <span className="text-slate-400">({sec.baguaName}卦·{sec.element})</span>
                        {isResolved && (
                          <Badge variant="outline" className="text-[10px] border-gold-500/50 text-gold-300">
                            当前滑动角命中
                          </Badge>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        洛书数 {sec.luoshuNumber} · 扇区 {sec.degreeMin}°~{sec.degreeMax}°
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-gold-300">
                      {scoreObj.score.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      先天气场 {scoreObj.breakdown.personalCompatibility.toFixed(1)}分
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
