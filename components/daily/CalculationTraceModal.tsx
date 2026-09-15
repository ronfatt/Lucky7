'use client';

import React from 'react';
import type { CalculationTrace } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { ELEMENT_LABELS } from '@/lib/numerology/digit-foundation';

export function CalculationTraceModal({
  trace,
  onClose,
}: {
  trace: CalculationTrace;
  onClose: () => void;
}) {
  const elMeta = ELEMENT_LABELS[trace.element];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-gold-500/30 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-champagne font-mono font-bold text-lg flex items-center justify-center border border-gold-500/40">
              {trace.digit}
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-100 flex items-center gap-2">
                数理推演溯源清单 (Calculation Trace)
                <Badge variant={trace.element.toLowerCase() as any}>
                  {elMeta.zh} · {trace.polarity === 'Yang' ? '阳' : '阴'}
                </Badge>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                最终评分: <strong className="text-emerald-400">{trace.finalScore} 分</strong> ({trace.classification})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="text-xs text-slate-400 mb-2">
            每一项得分均来自版本化规则库与客观模型加权，杜绝任何黑盒幻觉与随机造数：
          </div>

          {trace.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-serif font-semibold text-slate-200 block">
                  {step.factor}
                </span>
                <span className="text-[11px] text-slate-400">
                  {step.description}
                </span>
              </div>
              <span
                className={`font-mono font-bold text-sm shrink-0 ${
                  step.points > 0
                    ? 'text-emerald-400'
                    : step.points < 0
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                {step.points > 0 ? `+${step.points}` : step.points}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-obsidian-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% 确定性算法闭环</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            关闭溯源
          </Button>
        </div>
      </div>
    </div>
  );
}
