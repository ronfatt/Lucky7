'use client';

import React from 'react';
import type { ZiWeiChartData, ZiWeiPalaceInstance } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { ELEMENT_LABELS } from '@/lib/numerology/digit-foundation';

// Traditional 4x4 perimeter positions (clockwise order around the rectangle)
// Row 0 (Top): 巳 (0,0), 午 (0,1), 未 (0,2), 申 (0,3)
// Row 1: 辰 (1,0), [Center], [Center], 酉 (1,3)
// Row 2: 卯 (2,0), [Center], [Center], 戌 (2,3)
// Row 3 (Bottom): 寅 (3,0), 丑 (3,1), 子 (3,2), 亥 (3,3)
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
  if (!chart.isComplete) {
    return (
      <Card className="border-amber-500/30">
        <CardContent className="p-8 text-center space-y-3">
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

  return (
    <Card className="border-gold-500/25">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>
            <Compass className="w-4 h-4 text-gold-champagne" />
            传统十二宫天盘星曜格局 (Zi Wei Natal Chart)
          </CardTitle>
          <CardDescription>
            局数: <strong className="text-gold-champagne">{chart.bureau}</strong> · 
            命宫支: <strong className="text-slate-200">{chart.lifePalaceBranch}</strong> · 
            身宫支: <strong className="text-slate-200">{chart.bodyPalaceBranch}</strong>
          </CardDescription>
        </div>
        <Badge variant="gold">{chart.calculationVersion}</Badge>
      </CardHeader>
      <CardContent>
        {/* 4x4 Grid Board */}
        <div className="grid grid-cols-4 gap-2.5 max-w-4xl mx-auto">
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
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[140px] transition-all relative ${
                  isLife
                    ? 'bg-gradient-to-br from-gold-500/20 via-obsidian-900 to-obsidian-850 border-gold-400 shadow-gold-glow ring-1 ring-gold-400/40'
                    : isBody
                    ? 'bg-obsidian-900/90 border-amber-500/40 shadow-sm'
                    : 'bg-obsidian-950/70 border-white/5 hover:border-slate-700'
                }`}
              >
                {/* Header: Palace Name & Branch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-serif font-bold ${isLife ? 'text-gold-champagne' : 'text-slate-200'}`}>
                      {p.palaceName}
                    </span>
                    {isLife && <Badge variant="gold" className="text-[9px] px-1 py-0">命</Badge>}
                    {isBody && <Badge variant="outline" className="text-[9px] px-1 py-0 text-amber-300 border-amber-500/40">身</Badge>}
                  </div>
                  <span className={`text-[10px] font-mono ${elMeta.text}`}>
                    {p.branch} ({elMeta.zh})
                  </span>
                </div>

                {/* Stars List */}
                <div className="my-2 space-y-1">
                  {p.stars.length > 0 ? (
                    p.stars.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-100 font-serif font-semibold">
                          {s.starName}
                        </span>
                        <span className="text-[9px] text-gold-400/80 font-mono">
                          {s.brightness}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-600 block">无十四主星借星安居</span>
                  )}
                </div>

                {/* Footer: Transformations */}
                <div className="flex flex-wrap gap-1">
                  {p.transformations.map((t, idx) => (
                    <span
                      key={idx}
                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                        t.transformation === 'Lu'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : t.transformation === 'Quan'
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                          : t.transformation === 'Ke'
                          ? 'bg-gold-500/20 text-gold-champagne border border-gold-500/40'
                          : 'bg-red-950 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {t.starName}{t.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Center 2x2 Area */}
          <div
            style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
            className="p-5 rounded-xl bg-obsidian-950/90 border border-gold-500/20 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-champagne shadow-gold-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-slate-100 block">
                天心极局 · 乾坤定位
              </span>
              <span className="text-xs text-gold-champagne font-mono mt-0.5 block">
                {chart.bureau} · {chart.lifePalaceBranch}宫坐命
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              北斗九星统御，南斗六曜辅弼。命身主导本元气度，四化飞星引动机运波澜。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
