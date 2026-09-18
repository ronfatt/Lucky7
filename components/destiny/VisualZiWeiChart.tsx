// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Mobile-Optimized Visual Zi Wei Chart
// File: components/destiny/VisualZiWeiChart.tsx
// Supports 3 responsive views:
// 1. Four Pillars Hub (命·财·官·迁) - Perfect for mobile screens
// 2. Full 12 Palaces List - Clean accordion/card view
// 3. Traditional 4x4 Board - Horizontal-scroll protected on mobile
// ==========================================================

'use client';

import React, { useState } from 'react';
import type { ZiWeiChartData, ZiWeiPalaceInstance } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Compass,
  Sparkles,
  AlertCircle,
  LayoutGrid,
  Layers,
  Crown,
  Coins,
  Briefcase,
  Plane,
  ChevronRight,
} from 'lucide-react';
import { ELEMENT_LABELS } from '@/lib/numerology/digit-foundation';

// Traditional 4x4 perimeter positions (clockwise order around the rectangle)
const CHART_GRID_COORDS: Array<{ branch: string; row: number; col: number }> = [
  { branch: '巳', row: 0, col: 0 },
  { branch: '午', row: 0, col: 1 },
  { branch: '未', row: 0, col: 2 },
  { branch: '申', row: 0, col: 3 },
  { branch: '酉', row: 1, col: 3 },
  { branch: '戌', row: 2, col: 3 },
  { branch: '亥', row: 3, col: 3 },
  { branch: '子', row: 3, col: 2 },
  { branch: '丑', row: 3, col: 1 },
  { branch: '寅', row: 3, col: 0 },
  { branch: '卯', row: 2, col: 0 },
  { branch: '辰', row: 1, col: 0 },
];

export function VisualZiWeiChart({ chart }: { chart: ZiWeiChartData }) {
  const [activeTab, setActiveTab] = useState<'KEY_FOUR' | 'ALL_LIST' | 'TRADITIONAL_GRID'>('KEY_FOUR');
  const [selectedPalaceBranch, setSelectedPalaceBranch] = useState<string | null>(null);

  if (!chart.isComplete) {
    return (
      <Card className="border-amber-500/30">
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-serif font-bold text-slate-100">
            {chart.missingDataReason || '出生时间未知，部分命盘功能无法计算。'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            紫微斗数安星与命宫排定严格依凭生辰时柱。系统绝不擅自虚构默认时辰，保持学术真实与严谨。
          </p>
        </CardContent>
      </Card>
    );
  }

  // Create lookup by branch
  const palaceMap = new Map<string, ZiWeiPalaceInstance>();
  for (const p of chart.palaces) {
    palaceMap.set(p.branch, p);
  }

  // Identify Three Directions and Four Squares (三方四正: 命宫, 财帛宫, 官禄宫, 迁移宫)
  const keyPalaces = chart.palaces.filter(
    (p) =>
      p.isLifePalace ||
      p.palaceName === '财帛宫' ||
      p.palaceName === '官禄宫' ||
      p.palaceName === '事业宫' ||
      p.palaceName === '迁移宫' ||
      p.isBodyPalace
  );

  const getPalaceIcon = (name: string, isLife: boolean) => {
    if (isLife) return <Crown className="w-4 h-4 text-gold-400" />;
    if (name.includes('财帛')) return <Coins className="w-4 h-4 text-amber-400" />;
    if (name.includes('官禄') || name.includes('事业')) return <Briefcase className="w-4 h-4 text-sky-400" />;
    if (name.includes('迁移')) return <Plane className="w-4 h-4 text-emerald-400" />;
    return <Sparkles className="w-4 h-4 text-slate-400" />;
  };

  return (
    <Card className="border-gold-500/25 bg-obsidian-950/80">
      <CardHeader className="pb-3 border-b border-gold-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-champagne" />
              <span>紫微斗数天盘星曜格局</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              五行局: <strong className="text-gold-champagne">{chart.bureau}</strong> · 
              命宫落支: <strong className="text-slate-200">{chart.lifePalaceStemBranch || `${chart.lifePalaceBranch}位`}</strong> · 
              身宫落支: <strong className="text-slate-200">{chart.bodyPalaceStemBranch || `${chart.bodyPalaceBranch}位`}</strong>
            </CardDescription>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-obsidian-900 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('KEY_FOUR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'KEY_FOUR'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>核心四枢</span>
            </button>
            <button
              onClick={() => setActiveTab('ALL_LIST')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'ALL_LIST'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>十二宫详列</span>
            </button>
            <button
              onClick={() => setActiveTab('TRADITIONAL_GRID')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'TRADITIONAL_GRID'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>全景天盘</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* VIEW 1: KEY FOUR PALACES (Mobile-First Default) */}
        {activeTab === 'KEY_FOUR' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>三方四正枢纽宫位（命宫、财帛、官禄、迁移及身宫）</span>
              <span className="text-[11px] text-gold-400/80">影响个人财运与数字气机</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {keyPalaces.map((p) => {
                const elMeta = ELEMENT_LABELS[p.element];
                const isLife = p.isLifePalace;
                const isBody = p.isBodyPalace;

                return (
                  <div
                    key={p.branch}
                    className={`p-4 rounded-2xl border transition-all ${
                      isLife
                        ? 'bg-gradient-to-br from-gold-500/15 via-obsidian-900 to-obsidian-950 border-gold-400/50 shadow-gold-glow'
                        : 'bg-obsidian-900/90 border-slate-800 hover:border-gold-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        {getPalaceIcon(p.palaceName, isLife)}
                        <span className={`font-serif font-bold text-sm ${isLife ? 'text-gold-200' : 'text-slate-100'}`}>
                          {p.palaceName}
                        </span>
                        {isLife && (
                          <Badge variant="gold" className="text-[9px] px-1.5 py-0">
                            命主本命
                          </Badge>
                        )}
                        {isBody && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-amber-300 border-amber-500/40">
                            身宫
                          </Badge>
                        )}
                      </div>
                      <span className={`text-xs font-mono font-bold ${elMeta.text}`}>
                        {p.stemBranch || p.branch}位 · {elMeta.zh}
                      </span>
                    </div>

                    {/* Stars in this Palace */}
                    <div className="py-3">
                      <div className="text-[11px] text-slate-400 mb-1.5">坐守星曜：</div>
                      {p.stars.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {p.stars.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-gold-500/30 text-xs font-serif font-bold text-gold-100 flex items-center gap-1 shadow-sm"
                            >
                              <span>{s.starName}</span>
                              {s.brightness && (
                                <span className="text-[10px] text-gold-400 font-mono">
                                  [{s.brightness}]
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">借对宫主星引动气场</span>
                      )}
                    </div>

                    {/* Transformations (四化) */}
                    {p.transformations.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">飞星化曜:</span>
                        {p.transformations.map((t, idx) => (
                          <Badge
                            key={idx}
                            variant={
                              t.transformation === 'Lu'
                                ? 'gold'
                                : t.transformation === 'Quan'
                                ? 'fire'
                                : t.transformation === 'Ke'
                                ? 'water'
                                : 'danger'
                            }
                            className="text-[10px]"
                          >
                            {t.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: ALL 12 PALACES LIST VIEW */}
        {activeTab === 'ALL_LIST' && (
          <div className="space-y-2.5">
            <div className="text-xs text-slate-400">十二宫位全景明细列表（按顺时针支位排定）</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {chart.palaces.map((p) => {
                const elMeta = ELEMENT_LABELS[p.element];
                const isLife = p.isLifePalace;

                return (
                  <div
                    key={p.branch}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isLife
                        ? 'bg-gold-500/10 border-gold-500/40 text-gold-200'
                        : 'bg-obsidian-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-serif font-bold">
                        <span>{p.palaceName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({p.stemBranch || p.branch})</span>
                        {isLife && <Badge variant="gold" className="text-[8px] px-1 py-0">命</Badge>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {p.stars.length > 0
                          ? p.stars.map((s) => s.starName).join(' · ')
                          : '借对宫星耀'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-mono ${elMeta.text}`}>{elMeta.zh}</span>
                      {p.transformations.length > 0 && (
                        <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                          {p.transformations.map((t) => t.label).join(' ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: TRADITIONAL 4x4 BOARD (Horizontal Scroll Protected) */}
        {activeTab === 'TRADITIONAL_GRID' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>传统 4x4 天盘方正全图（手机端支持左右横向平移浏览）</span>
              <span className="text-[10px] text-gold-400 hidden sm:inline">标准紫微天心方位</span>
            </div>

            <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid grid-cols-4 gap-2 min-w-[560px] max-w-4xl mx-auto">
                {CHART_GRID_COORDS.map((cell) => {
                  const p = palaceMap.get(cell.branch);
                  if (!p) return null;

                  const elMeta = ELEMENT_LABELS[p.element];
                  const isLife = p.isLifePalace;
                  const isBody = p.isBodyPalace;

                  return (
                    <div
                      key={cell.branch}
                      style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between min-h-[135px] transition-all relative ${
                        isLife
                          ? 'bg-gradient-to-br from-gold-500/20 via-obsidian-900 to-obsidian-850 border-gold-400 shadow-gold-glow ring-1 ring-gold-400/40'
                          : isBody
                          ? 'bg-obsidian-900/90 border-amber-500/40 shadow-sm'
                          : 'bg-obsidian-950/70 border-white/5 hover:border-slate-700'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-serif font-bold ${isLife ? 'text-gold-champagne' : 'text-slate-200'}`}>
                            {p.palaceName}
                          </span>
                          {isLife && <Badge variant="gold" className="text-[8px] px-1 py-0">命</Badge>}
                          {isBody && <Badge variant="outline" className="text-[8px] px-1 py-0 text-amber-300 border-amber-500/40">身</Badge>}
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${elMeta.text}`}>
                          {p.stemBranch || p.branch}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="my-1.5 space-y-0.5">
                        {p.stars.length > 0 ? (
                          p.stars.map((s, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-100 font-serif font-semibold">
                                {s.starName}
                              </span>
                              {s.brightness && (
                                <span className="text-[9px] text-gold-400 font-mono">
                                  {s.brightness}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-600 block">借星安居</span>
                        )}
                      </div>

                      {/* Transformations */}
                      <div className="flex flex-wrap gap-1">
                        {p.transformations.map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                              t.transformation === 'Lu'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : t.transformation === 'Quan'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : t.transformation === 'Ke'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Traditional 2x2 Center Hall (中宫 / 命盘中堂) */}
                <div
                  style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }}
                  className="rounded-xl border border-gold-500/25 bg-gradient-to-b from-obsidian-900/95 to-obsidian-950/95 p-4 flex flex-col justify-between items-center text-center shadow-inner"
                >
                  <div className="w-full">
                    <div className="text-[10px] tracking-widest text-gold-400 font-serif font-bold uppercase flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-champagne" />
                      <span>紫微天盘中堂</span>
                      <Sparkles className="w-3 h-3 text-gold-champagne" />
                    </div>
                    <div className="mt-2 py-1 px-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-200 text-xs font-serif font-bold inline-block">
                      {chart.bureau}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full text-left bg-obsidian-950/70 p-2 rounded-lg border border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">命宫干支</span>
                      <span className="font-serif font-bold text-gold-200">
                        {chart.lifePalaceStemBranch || `${chart.lifePalaceBranch}位`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">身宫干支</span>
                      <span className="font-serif font-bold text-amber-200">
                        {chart.bodyPalaceStemBranch || `${chart.bodyPalaceBranch}位`}
                      </span>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-500 font-mono tracking-tight">
                    正统五虎遁元 · 纳音六十甲子定局
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
