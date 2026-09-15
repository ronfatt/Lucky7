'use client';

import React, { useState, useMemo } from 'react';
import type { BirthProfile } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, Sparkles, Shield, ArrowRight, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DIRECTION_SECTORS, ALL_DIRECTION_CODES } from '@/lib/directions/direction-models';
import Link from 'next/link';

export default function MyDirectionsPage() {
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

  const sortedDirections = useMemo(() => {
    return Object.values(personalDirections.directionScores).sort((a, b) => b.score - a.score);
  }, [personalDirections]);

  const bestSec = DIRECTION_SECTORS[personalDirections.bestDirection];
  const secondSec = DIRECTION_SECTORS[personalDirections.secondaryDirection];
  const weakSec = DIRECTION_SECTORS[personalDirections.weakDirection];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">先天本命方位档案</h1>
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
              静态本命气场
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            由个人出生盘（四柱八字 · 紫微命盘 · 数理DNA）决定之先天八方契合度，终生恒定。
          </p>
        </div>

        <Link
          href="/compass"
          className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          查看今日时空罗盘
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Highlights 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-950/20 border-emerald-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              先天第一吉方
            </span>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs">
              首选用位
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white my-1">
            {bestSec.nameZh} ({bestSec.nameEn})
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {bestSec.baguaName}卦 · {bestSec.element} · 洛书{bestSec.luoshuNumber}宫
          </div>
          <div className="text-xs text-emerald-300/90 font-mono">
            指数：{personalDirections.directionScores[personalDirections.bestDirection].score.toFixed(1)} 分
          </div>
        </Card>

        <Card className="bg-blue-950/20 border-blue-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              先天次吉方位
            </span>
            <Badge variant="outline" className="border-blue-500/40 text-blue-300 text-xs">
              次选辅助
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white my-1">
            {secondSec.nameZh} ({secondSec.nameEn})
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {secondSec.baguaName}卦 · {secondSec.element} · 洛书{secondSec.luoshuNumber}宫
          </div>
          <div className="text-xs text-blue-300/90 font-mono">
            指数：{personalDirections.directionScores[personalDirections.secondaryDirection].score.toFixed(1)} 分
          </div>
        </Card>

        <Card className="bg-rose-950/20 border-rose-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              先天相克/慎用方
            </span>
            <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-xs">
              宜避开
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white my-1">
            {weakSec.nameZh} ({weakSec.nameEn})
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {weakSec.baguaName}卦 · {weakSec.element} · 洛书{weakSec.luoshuNumber}宫
          </div>
          <div className="text-xs text-rose-300/90 font-mono">
            指数：{personalDirections.directionScores[personalDirections.weakDirection].score.toFixed(1)} 分
          </div>
        </Card>
      </div>

      {/* 8 Directions Ranked Table */}
      <Card className="bg-[#0B0F19]/90 border-slate-800 p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-400" />
            先天八方数理兼容性排序 (1 ~ 8 排位)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            综合考虑日主五行 (30%)、数理DNA (20%)、命宫 (15%)、身宫 (10%)、洛书 (10%)、八卦 (10%) 与局象 (5%)
          </CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070A12] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">排位</th>
                <th className="p-3">方位名称</th>
                <th className="p-3">后天八卦</th>
                <th className="p-3">洛书九宫</th>
                <th className="p-3">方位角</th>
                <th className="p-3 text-right">综合指数</th>
                <th className="p-3 text-right">五行契合</th>
                <th className="p-3 text-right">数理DNA</th>
                <th className="p-3 text-right">命身宫位</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedDirections.map((item) => {
                const sec = DIRECTION_SECTORS[item.direction];
                const isTop = item.rank === 1;
                return (
                  <tr
                    key={item.direction}
                    className={`hover:bg-slate-800/30 transition ${
                      isTop ? 'bg-gold-500/5 font-medium' : ''
                    }`}
                  >
                    <td className="p-3 font-mono">
                      <span
                        className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[11px] font-bold ${
                          isTop
                            ? 'bg-gold-500 text-obsidian-950'
                            : item.rank === 2
                            ? 'bg-blue-500/30 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="p-3">
                      <strong className="text-white text-sm">{sec.nameZh}</strong>
                      <span className="text-slate-500 ml-1.5 font-normal">({sec.nameEn})</span>
                    </td>
                    <td className="p-3">
                      {sec.baguaName}卦 · {sec.element}
                    </td>
                    <td className="p-3 text-gold-300">{sec.luoshuNumber} 宫</td>
                    <td className="p-3 font-mono text-slate-400">
                      {sec.degreeMin}° ~ {sec.degreeMax}°
                    </td>
                    <td className="p-3 text-right font-bold font-mono text-gold-300 text-sm">
                      {item.score.toFixed(1)}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">
                      {item.elementScore.toFixed(1)}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">
                      {item.numberDnaScore.toFixed(1)}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">
                      {((item.lifePalaceScore * 0.15 + item.bodyPalaceScore * 0.1) / 0.25).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
