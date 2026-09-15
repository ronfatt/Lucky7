// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Betting Strategy & Budget Modal
// File: components/prediction/BettingStrategyModal.tsx
// ==========================================================

'use client';

import React, { useState, useMemo } from 'react';
import {
  BettingStrategyEngine,
  BettingStrategyRecommendation,
} from '@/lib/lottery/betting-strategy-engine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calculator,
  X,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface BettingStrategyModalProps {
  numberStr: string;
  windfallScore?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BettingStrategyModal({
  numberStr,
  windfallScore = 78,
  isOpen,
  onClose,
}: BettingStrategyModalProps) {
  const [customBudget, setCustomBudget] = useState<number>(4);

  const strategy: BettingStrategyRecommendation = useMemo(() => {
    return BettingStrategyEngine.generateStrategy(numberStr, windfallScore);
  }, [numberStr, windfallScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-gold-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0E1322] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                号码【{strategy.targetNumber}】理性下注买法与成本预算器
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                结合今日偏财指数（{strategy.windfallScore}分）与数字形态（{strategy.permutationInfo.patternNameZh}）量身定制
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Advice Status Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
            strategy.suitabilityLevel === 'HIGH'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : strategy.suitabilityLevel === 'DEFENSIVE'
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              : 'bg-gold-500/10 border-gold-500/30 text-gold-200'
          }`}>
            <span className="p-1 rounded-lg bg-black/30 shrink-0 mt-0.5">
              <Coins className="w-4 h-4" />
            </span>
            <div className="space-y-0.5">
              <strong className="block text-white text-xs">{strategy.suitabilityTitle}</strong>
              <p className="opacity-90 leading-relaxed text-[11px]">{strategy.suitabilityAdvice}</p>
            </div>
          </div>

          {/* Package 1: Primary Recommended Strategy */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-[10px]">
                  首选推荐
                </Badge>
                <h4 className="text-xs font-bold text-white">
                  {strategy.primaryPackage.packageName}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">建议总投入</span>
                <span className="text-base font-mono font-black text-gold-300">
                  RM {strategy.primaryPackage.totalBudgetRm.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              {strategy.primaryPackage.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>覆盖效果：{strategy.primaryPackage.expectedCoverageZh}</span>
            </div>
          </div>

          {/* Package 2: Conservative Micro Option */}
          <div className="p-4 rounded-xl bg-[#070A12]/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">
                {strategy.conservativePackage.packageName}
              </span>
              <span className="font-mono font-bold text-slate-200">
                RM {strategy.conservativePackage.totalBudgetRm.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              {strategy.conservativePackage.breakdown.map((item, idx) => (
                <p key={idx}>• {item}</p>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              {strategy.conservativePackage.expectedCoverageZh}
            </p>
          </div>

          {/* Operator Specific Details (Magnum, DaMaCai, Toto) */}
          <div>
            <span className="text-xs font-bold text-white block mb-2">
              各大博彩平台下注代号与最小玩法：
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {strategy.operators.map((op) => (
                <div
                  key={op.operatorId}
                  className="p-3 rounded-xl bg-[#0E1322] border border-slate-800 text-xs space-y-1.5"
                >
                  <strong className="text-gold-300 block text-[11px]">{op.operatorNameZh}</strong>
                  <div className="text-slate-400 text-[10px] space-y-0.5">
                    <p>正字：{op.straightOption}</p>
                    <p>全保：{op.boxOptionName}</p>
                    <p className="text-slate-500 pt-1 border-t border-slate-800">
                      起步最低: RM {op.minBudgetRm.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Budget Estimator */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">快速预算切换分配：</span>
              <span className="text-gold-300 font-mono font-bold">RM {customBudget}.00 预算</span>
            </div>
            <div className="flex items-center gap-2">
              {[2, 4, 6, 10].map((b) => (
                <button
                  key={b}
                  onClick={() => setCustomBudget(b)}
                  className={`flex-1 py-1 rounded-lg text-xs font-mono transition border ${
                    customBudget === b
                      ? 'bg-gold-500/20 text-gold-300 border-gold-500/40 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  RM {b}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              分配建议：RM {Math.max(1, Math.floor(customBudget / 2))} 投正字（1大1小），RM{' '}
              {Math.max(1, Math.ceil(customBudget / 2))} 投 i-Perm 全保或次选号码。
            </p>
          </div>

          {/* Disclaimer */}
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[10px] text-slate-500 leading-relaxed">
            {strategy.responsibleDisclaimer}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0E1322] border-t border-slate-800 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 text-xs rounded-xl"
          >
            知道了
          </Button>
        </div>
      </div>
    </div>
  );
}
