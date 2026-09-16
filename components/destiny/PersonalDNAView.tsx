'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { PersonalNumberDNA } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Layers, ArrowUpRight, Search, FileText } from 'lucide-react';
import { ELEMENT_LABELS, getDigitElement, getDigitPolarity } from '@/lib/numerology/digit-foundation';
import { CalculationTraceModal } from '../daily/CalculationTraceModal';

export function PersonalDNAView({ dna }: { dna: PersonalNumberDNA }) {
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border-gold-500/25">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>
              <Sparkles className="w-4 h-4 text-gold-champagne" />
              我的数字 DNA · Personal Number DNA
            </CardTitle>
            <CardDescription>
              基于八字日主、五行蓄能、紫微命身与生年四化融合生成的本命数理基因
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="gold">{dna.algorithmVersion}</Badge>
            <span className="text-xs text-slate-400 font-mono">
              DNA指数: <strong className="text-gold-champagne">{dna.dnaScore}</strong>
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Numbers Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-850 border border-gold-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif font-bold text-gold-champagne flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                核心本命数 (Core Numbers) · TOP 4
              </span>
              <span className="text-[11px] text-slate-400">点击数字进入实验室深度检验</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dna.coreNumbers.map((d, i) => {
                const el = getDigitElement(d);
                const pol = getDigitPolarity(d);
                const score = dna.scoresByDigit[d];
                const meta = ELEMENT_LABELS[el];

                return (
                  <div
                    key={d}
                    className="p-3.5 sm:p-4 rounded-xl bg-obsidian-900/90 border border-gold-500/40 shadow-gold-glow flex flex-col justify-between hover:border-gold-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-mono font-bold text-gold-champagne group-hover:scale-110 transition-transform">
                        {d}
                      </span>
                      <Badge variant={el.toLowerCase() as any} className="text-[10px]">
                        {meta.zh} · {pol === 'Yang' ? '阳' : '阴'}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">亲和度</span>
                      <span className="font-mono font-bold text-emerald-400">{score} 分</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-white/5">
                      <button
                        onClick={() => setSelectedDigit(d)}
                        className="text-[10px] text-gold-400/90 hover:text-gold-300 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> 溯源
                      </button>
                      <Link
                        href={`/laboratory?input=${d}`}
                        className="text-[10px] text-slate-400 hover:text-slate-200 ml-auto flex items-center gap-0.5"
                      >
                        验象 <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support and Weak Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-2">
              <span className="text-xs font-serif font-semibold text-slate-300">
                辅助吉数 (Support Numbers)
              </span>
              <div className="flex flex-wrap gap-2">
                {dna.supportNumbers.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDigit(d)}
                    className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-slate-700/80 font-mono text-sm text-slate-200 hover:border-gold-500/40"
                  >
                    {d} <span className="text-[10px] text-slate-400">({dna.scoresByDigit[d]}分)</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-2">
              <span className="text-xs font-serif font-semibold text-slate-400">
                待润数 (Weak Numbers)
              </span>
              <div className="flex flex-wrap gap-2">
                {dna.weakNumbers.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDigit(d)}
                    className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-slate-800 font-mono text-sm text-slate-400 hover:border-slate-700"
                  >
                    {d} <span className="text-[10px] text-slate-400">({dna.scoresByDigit[d]}分)</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Five Elements Balance in DNA */}
          <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold-champagne" />
                本命五行配比 (Elemental Base)
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                主导行: <strong className="text-gold-champagne">{ELEMENT_LABELS[dna.dominantElement].zh} ({dna.dominantElement})</strong> · 
                弱势行: <span className="text-slate-400">{ELEMENT_LABELS[dna.weakestElement].zh} ({dna.weakestElement})</span>
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(dna.elementDistribution).map(([el, pct]) => {
                const meta = ELEMENT_LABELS[el as keyof typeof ELEMENT_LABELS];
                return (
                  <div key={el} className="p-2.5 rounded-lg bg-obsidian-950 text-center border border-white/5">
                    <span className="text-[11px] font-medium text-slate-300 block">{meta.zh} ({el})</span>
                    <span className="text-base font-mono font-bold text-slate-100">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Trace Modal */}
      {selectedDigit !== null && (
        <CalculationTraceModal
          trace={dna.tracesByDigit[selectedDigit]}
          onClose={() => setSelectedDigit(null)}
        />
      )}
    </div>
  );
}
