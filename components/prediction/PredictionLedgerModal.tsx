// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Prediction Ledger & Metaphysical Backtest Modal
// File: components/prediction/PredictionLedgerModal.tsx
// ==========================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PredictionLedgerStore,
  PredictionLedgerEntry,
  LedgerMetrics,
} from '@/lib/prediction/prediction-ledger-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  X,
  Trophy,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
} from 'lucide-react';

interface PredictionLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PredictionLedgerModal({ isOpen, onClose }: PredictionLedgerModalProps) {
  const [entries, setEntries] = useState<PredictionLedgerEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEntries(PredictionLedgerStore.getAll());
    }
  }, [isOpen]);

  const metrics: LedgerMetrics = useMemo(() => {
    return PredictionLedgerStore.getMetrics();
  }, [entries]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-gold-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0E1322] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                个人推演复盘账本 · 灵验规律历史复盘
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                记录您过往每次推演的号码表现，统计真实开奖命中率与个人天干财运密码
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
          {/* Top 4 Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">累计记录推演</span>
              <div className="text-xl font-mono font-bold text-white">
                {metrics.totalLogged} <span className="text-[10px] text-slate-500">期</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 block">命中开彩记录</span>
              <div className="text-xl font-mono font-bold text-emerald-300">
                {metrics.totalHits} <span className="text-[10px] text-slate-500">次中彩</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 block">斩获头/二/三奖</span>
              <div className="text-xl font-mono font-bold text-amber-300">
                {metrics.top3PrizeHits} <span className="text-[10px] text-slate-500">次大奖</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070A12] border border-gold-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 block">综合出彩共鸣率</span>
              <div className="text-xl font-mono font-bold text-gold-300">
                {metrics.hitRatePercent}%
              </div>
            </div>
          </div>

          {/* Metaphysical Law Insight Callout Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-gold-950/40 via-[#0F1626] to-[#0A0E1A] border border-gold-500/30 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-gold-300 font-bold">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>个人紫微易数大数据复盘规律：</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px] opacity-95">
              {metrics.metaphysicalInsightZh}
            </p>
          </div>

          {/* Historical Log Table */}
          <div>
            <span className="text-xs font-bold text-white block mb-2">
              过往推演与开彩比对记录明细：
            </span>
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#070A12]/80">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-[#0c1017]">
                    <th className="py-2.5 px-3 font-semibold">推演日期</th>
                    <th className="py-2.5 px-3 font-semibold">日干支</th>
                    <th className="py-2.5 px-3 font-semibold">推算母码</th>
                    <th className="py-2.5 px-3 font-semibold">偏财指数</th>
                    <th className="py-2.5 px-3 font-semibold">对奖状态</th>
                    <th className="py-2.5 px-3 font-semibold text-right">中出平台/奖项</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/30 text-slate-300">
                      <td className="py-2 px-3 text-white font-semibold">{entry.date}</td>
                      <td className="py-2 px-3 text-gold-300">{entry.dayStemBranch}</td>
                      <td className="py-2 px-3 text-white font-bold text-sm tracking-wider">
                        {entry.motherCode}
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-slate-300 font-bold">{entry.windfallScore}</span>
                        <span className="text-[10px] text-slate-500 ml-1">({entry.windfallSuitability})</span>
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.hasHit
                              ? entry.hitType === 'DIRECT'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {entry.hasHit
                            ? entry.hitType === 'DIRECT'
                              ? '正字直落'
                              : '全保组选'
                            : '未中奖'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-sans">
                        {entry.hasHit ? (
                          <div className="space-y-0.5">
                            <span className="text-gold-300 font-semibold block text-xs">
                              {entry.hitTier}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {entry.hitOperator} · {entry.hitDate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0E1322] border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>历史验证有助于掌握自身天干偏财节律 · 理性参考切勿沉迷</span>
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 text-xs rounded-xl"
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
