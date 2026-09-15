'use client';

import React, { useState, useMemo } from 'react';
import type { MalaysianOperator, NumberPatternAnalysis } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  Search,
  Trophy,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  Compass,
  Award,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';
import { MalaysiaLotteryProvider, MALAYSIAN_OPERATORS } from '@/lib/lottery/malaysia-provider';
import { LotteryPatternEngine } from '@/lib/lottery/lottery-pattern-engine';

interface MalaysianDrawHistoryModalProps {
  initialNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MalaysianDrawHistoryModal({
  initialNumber,
  isOpen,
  onClose,
}: MalaysianDrawHistoryModalProps) {
  const [searchNumber, setSearchNumber] = useState<string>(initialNumber || '5729');
  const [selectedOperator, setSelectedOperator] = useState<MalaysianOperator>('ALL');

  // Keep input synced if initialNumber changes
  React.useEffect(() => {
    if (initialNumber && /^\d{4}$/.test(initialNumber)) {
      setSearchNumber(initialNumber);
    }
  }, [initialNumber]);

  const patternAnalysis: NumberPatternAnalysis = useMemo(() => {
    const valid = /^\d{4}$/.test(searchNumber.trim()) ? searchNumber.trim() : '5729';
    return LotteryPatternEngine.analyzePattern(valid, selectedOperator);
  }, [searchNumber, selectedOperator]);

  const summaryText = useMemo(() => {
    return LotteryPatternEngine.generatePatternSummary(patternAnalysis);
  }, [patternAnalysis]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c1017] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gold-500/20 bg-[#121824] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  大马三大彩 · 历史出彩规律对照
                </h2>
                <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
                  Magnum · DaMaCai · Toto
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                检索推演数字在马来西亚万能 4D、大马彩 1+3D、多多 4D 历史出奖记录与五行数理规律
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          {/* Top Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#131a29] p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-5 flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">查询号码:</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={4}
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="输入4位数字 (如 5729)"
                  className="w-full bg-[#0d131f] border border-gold-500/30 rounded-lg px-3 py-1.5 text-gold-300 font-mono font-bold tracking-widest text-center focus:outline-none focus:border-gold-400 text-base"
                />
              </div>
            </div>

            {/* Operator Filter Tabs */}
            <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-end">
              <button
                onClick={() => setSelectedOperator('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedOperator === 'ALL'
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                三大公司 (全部)
              </button>
              {MALAYSIAN_OPERATORS.filter((o) => o.active).map((op) => (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperator(op.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedOperator === op.id
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {op.nameZh}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">历史开奖总命中</span>
              <span className="text-2xl font-bold text-gold-400 font-mono">
                {patternAnalysis.totalHits}
              </span>
              <span className="text-[10px] text-slate-500 block">
                / {patternAnalysis.totalDrawsScanned} 期扫描
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">首/二/三奖前三命中</span>
              <span className="text-2xl font-bold text-amber-300 font-mono">
                {patternAnalysis.tierHits.first +
                  patternAnalysis.tierHits.second +
                  patternAnalysis.tierHits.third}
              </span>
              <span className="text-[10px] text-slate-500 block">
                首:{patternAnalysis.tierHits.first} 二:{patternAnalysis.tierHits.second} 三:{patternAnalysis.tierHits.third}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">特别奖 / 安慰奖</span>
              <span className="text-2xl font-bold text-sky-400 font-mono">
                {patternAnalysis.tierHits.special + patternAnalysis.tierHits.consolation}
              </span>
              <span className="text-[10px] text-slate-500 block">
                特别:{patternAnalysis.tierHits.special} 安慰:{patternAnalysis.tierHits.consolation}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">冷热周期状态</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {patternAnalysis.hotColdStatus === 'HOT' && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <Flame className="w-3 h-3 mr-1" /> 近期活跃 (HOT)
                  </Badge>
                )}
                {patternAnalysis.hotColdStatus === 'WARM' && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    温和周期 (WARM)
                  </Badge>
                )}
                {patternAnalysis.hotColdStatus === 'COLD' && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    冷门蓄势 (COLD)
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {patternAnalysis.daysSinceLastHit === 'NEVER'
                  ? '未有记录'
                  : `距上次命中 ${patternAnalysis.daysSinceLastHit} 天`}
              </span>
            </div>
          </div>

          {/* Number Metaphysical & Mathematical Law (数理规律透视) */}
          <div className="p-4 rounded-xl bg-[#101624] border border-gold-500/20 space-y-3">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>时空五行与数理规律透视 · Metaphysical Signature</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0c111c] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">五行主属</span>
                <span className="text-sm font-bold text-emerald-400">
                  {patternAnalysis.primaryElement === 'Wood' && '木 (生发)'}
                  {patternAnalysis.primaryElement === 'Fire' && '火 (炎上)'}
                  {patternAnalysis.primaryElement === 'Earth' && '土 (稼穑)'}
                  {patternAnalysis.primaryElement === 'Metal' && '金 (从革)'}
                  {patternAnalysis.primaryElement === 'Water' && '水 (润下)'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0c111c] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">和值 (Sum)</span>
                <span className="text-sm font-bold text-white font-mono">{patternAnalysis.sum}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0c111c] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">九宫合数 (Root)</span>
                <span className="text-sm font-bold text-gold-400 font-mono">
                  {patternAnalysis.digitalRoot} 宫
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0c111c] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">阴阳形态</span>
                <span className="text-sm font-bold text-white font-mono">{patternAnalysis.parityRatio}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0c111c] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">大小形态</span>
                <span className="text-sm font-bold text-white font-mono">{patternAnalysis.sizeRatio}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0c111c]/60 p-3 rounded-lg border border-slate-800/80">
              {summaryText}
            </p>
          </div>

          {/* Historical Hits List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-400" />
                历史开奖明细清单 · Historical Match Details ({patternAnalysis.hitRecords.length} 项)
              </h3>
            </div>

            {patternAnalysis.hitRecords.length === 0 ? (
              <div className="py-8 text-center bg-[#101624] rounded-xl border border-dashed border-slate-800">
                <p className="text-sm text-slate-400">
                  号码 <span className="font-mono text-gold-400">{patternAnalysis.targetNumber}</span>{' '}
                  在当前收录的 {selectedOperator === 'ALL' ? '三大公司' : selectedOperator} 开奖记录中未见出奖。
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  提示：可输入常用号码如 5729、5279、7752、8816、9275 等查看历史多盘口命中验证。
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {patternAnalysis.hitRecords.map((hit, idx) => {
                  const isFirst = hit.tier === 'FIRST';
                  const isTop3 = hit.tier === 'FIRST' || hit.tier === 'SECOND' || hit.tier === 'THIRD';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isFirst
                          ? 'bg-amber-950/20 border-gold-500/40'
                          : isTop3
                          ? 'bg-[#151c2c] border-amber-500/30'
                          : 'bg-[#101624] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isFirst
                              ? 'bg-gold-500 text-obsidian-950 shadow-md'
                              : isTop3
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {hit.tier === 'FIRST' && '首'}
                          {hit.tier === 'SECOND' && '二'}
                          {hit.tier === 'THIRD' && '三'}
                          {hit.tier === 'SPECIAL' && '特'}
                          {hit.tier === 'CONSOLATION' && '安'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-gold-300 font-mono">
                              {hit.number}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                hit.operator === 'MAGNUM'
                                  ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                                  : hit.operator === 'DAMACAI'
                                  ? 'border-red-500/40 text-red-400 bg-red-500/10'
                                  : 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                              }
                            >
                              {hit.operator === 'MAGNUM' && '万能 4D'}
                              {hit.operator === 'DAMACAI' && '大马彩 1+3D'}
                              {hit.operator === 'TOTO' && '多多 4D'}
                            </Badge>
                            <span className="text-xs font-semibold text-slate-200">
                              {hit.tierName}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            期号: {hit.drawNo}
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:text-right w-full sm:w-auto">
                        <span className="text-xs text-slate-300 font-mono block">
                          {hit.drawDate}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {hit.operator} 官方验证录入
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Compliance & Science Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-950/15 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-200/90">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>科学与责任博彩严正声明：</strong>
              本系统所接入之马来西亚万能 4D (Magnum)、大马彩 1+3D (DaMaCai)、多多 4D (Sports Toto) 历史出球数据，仅供传统时空数理推演与历史冷热特征规律对照之用。彩票摇奖系统属于完全独立的随机物理事件，历史出彩规律绝不构成对未来开奖结果的保证或数学概率提升。请保持理性认知。
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gold-500/20 bg-[#121824] flex items-center justify-between">
          <span className="text-xs text-slate-500">
            紫微时空数字预测系统 (ZWTSP) · 大马彩票数据中枢
          </span>
          <Button
            onClick={onClose}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs px-4 py-1.5 rounded-lg"
          >
            完成对照
          </Button>
        </div>
      </div>
    </div>
  );
}
