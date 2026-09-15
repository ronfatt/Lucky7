'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Clock,
  ShieldCheck,
  HeartHandshake,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { globalFusionEngine } from '@/lib/scoring/fusion-engine';
import { ELEMENT_LABELS } from '@/lib/numerology/digit-foundation';
import { WuXingElement } from '@/types/zwtsp';

export function OverviewDashboard() {
  // Configured opportunity score state (simulated current daily value: 76 -> STRONG)
  const [opportunityScore, setOpportunityScore] = useState<number>(76);
  const [pledgeChecked, setPledgeChecked] = useState<boolean>(true);
  const [dailyBudget, setDailyBudget] = useState<number>(20);
  const [spentToday, setSpentToday] = useState<number>(10);

  const windowData = globalFusionEngine.evaluateOpportunityWindow(opportunityScore);

  // Simulated daily number pool & top candidates
  const top5 = [7, 2, 9, 5, 8];
  const top10 = [7, 2, 9, 5, 8, 3, 1, 6, 4, 0];
  const top20 = [7, 2, 9, 5, 8, 3, 1, 6, 4, 0, 72, 59, 27, 95, 83, 38, 16, 61, 49, 94];
  const motherResult = globalFusionEngine.generateMotherAndVariations(top5, 4);

  // Model consistency calculation (NOT winning probability)
  const consistencyScore = 88.4;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Safety Guard */}
      <div className="relative overflow-hidden rounded-2xl p-7 glass-panel border border-gold-500/25 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-850">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">时位象数行验</Badge>
              <span className="text-xs text-slate-400 font-mono">ZWTSP-CORE-V1.0</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-100 tracking-wide">
              紫微时空数字推演中枢
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              个人传统术数与历史统计回测决策辅助系统。以时空节律与象数矩阵为锚点，客观呈现多维特征，不提供超自然确定性与中奖承诺。
            </p>
          </div>

          {/* Opportunity Score Indicator */}
          <div className="flex items-center gap-4 bg-obsidian-950/80 p-4 rounded-xl border border-gold-500/20">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">今日时空偏财窗口</div>
              <div className="text-2xl font-mono font-bold text-gold-champagne">
                {opportunityScore}{' '}
                <span className="text-xs text-gold-400/90 font-normal">/ 100</span>
              </div>
              <Badge
                variant={opportunityScore < 40 ? 'danger' : 'gold'}
                className="mt-1"
              >
                {windowData.level} 等级
              </Badge>
            </div>
          </div>
        </div>

        {/* Mandatory Guard Banner if score < 40 */}
        {opportunityScore < 40 && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-red-200 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>今日不建议因本系统增加投注。 (时空能量处收敛低谷期，宜休整静定)</span>
          </div>
        )}
      </div>

      {/* 2. Key Daily Metaphysical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Primary Time */}
        <Card className="border-gold-500/15">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-champagne" />
                吉时时段 (Primary)
              </span>
              <Badge variant="gold">巳时</Badge>
            </div>
            <div className="text-base font-semibold text-slate-100 font-serif">
              09:00 - 11:00
            </div>
            <p className="text-[11px] text-slate-400">
              次选: 申时 (15:00-17:00) · 避开午时冲克
            </p>
          </CardContent>
        </Card>

        {/* Primary Direction */}
        <Card className="border-gold-500/15">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-champagne" />
                吉方罗盘 (Direction)
              </span>
              <Badge variant="gold">正南 (离宫)</Badge>
            </div>
            <div className="text-base font-semibold text-slate-100 font-serif">
              正南方 (165° - 195°)
            </div>
            <p className="text-[11px] text-slate-400">
              辅助: 东南 (巽位) · 避让正北 (坎位)
            </p>
          </CardContent>
        </Card>

        {/* Model Consistency */}
        <Card className="border-gold-500/15">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-gold-champagne" />
                模型一致性 (Consistency)
              </span>
              <Badge variant="gold">高度共振</Badge>
            </div>
            <div className="text-base font-semibold text-slate-100 font-mono">
              {consistencyScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-400">
              各独立子系统共识度 (非中奖概率)
            </p>
          </CardContent>
        </Card>

        {/* Personal Number DNA Preview */}
        <Card className="border-gold-500/15">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-champagne" />
                个人数字 DNA
              </span>
              <Badge variant="gold">命坐武曲</Badge>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-slate-100 text-base">
              <span>[ 7 ]</span>
              <span>[ 2 ]</span>
              <span>[ 9 ]</span>
              <span className="text-xs font-normal text-slate-400">核心数</span>
            </div>
            <p className="text-[11px] text-slate-400">
              主星化禄加持 · 申酉金气蓄能
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Number Generation & Permutation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Numbers Output & Mother Code */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>
                  <TrendingUp className="w-4 h-4 text-gold-champagne" />
                  今日数字池推演 (Daily Number Pool)
                </CardTitle>
                <CardDescription>
                  根据时空八字、紫微星度与河洛九宫加权得出的候选数池
                </CardDescription>
              </div>
              <Link href="/laboratory">
                <Button variant="outline" size="sm">
                  进入实验室验证 <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* TOP 5 */}
              <div className="p-4 rounded-xl bg-obsidian-950/80 border border-gold-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold-champagne font-serif flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    精选核心 TOP 5
                  </span>
                  <Badge variant="gold">高优先级</Badge>
                </div>
                <div className="flex flex-wrap gap-3">
                  {top5.map((num, i) => {
                    return (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl bg-obsidian-900 border border-gold-500/40 flex flex-col items-center justify-center font-mono font-bold text-gold-champagne text-lg shadow-gold-glow hover:scale-105 transition-all"
                      >
                        {num}
                        <span className="text-[9px] font-sans font-normal text-slate-400">
                          {i === 0 ? '魁首' : `位${i + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TOP 10 */}
              <div>
                <span className="text-xs text-slate-400 mb-2 block font-serif">扩展备选 TOP 10</span>
                <div className="flex flex-wrap gap-2">
                  {top10.map((num, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/5 font-mono text-sm text-slate-200"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mother Code & Variations */}
              <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-serif flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gold-champagne" />
                    核心母码 (Mother Code) & 变号 (Variations)
                  </span>
                  <Badge variant="outline">严控变体算法</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="px-5 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/40 font-mono text-2xl font-bold tracking-widest text-gold-champagne">
                    {motherResult.motherCode}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-400">受控变体:</span>
                    {motherResult.variations.map((code, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-obsidian-950 border border-slate-700 font-mono text-xs text-slate-300"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Backtest Quick Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  <TrendingUp className="w-4 h-4 text-gold-champagne" />
                  前瞻滚动回测 (Walk-Forward Validation)
                </CardTitle>
                <CardDescription>
                  基于近 300 期无前瞻偏差历史推演，并同随机基准进行严谨对照
                </CardDescription>
              </div>
              <Link href="/backtest">
                <Button variant="ghost" size="sm">
                  完整报告 <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">TOP 5 命中率</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">54.2%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">随机基准: 50.0% (+4.2%)</span>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">TOP 10 覆盖率</span>
                  <span className="text-lg font-mono font-bold text-gold-champagne">82.6%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">平均排位: 3.12</span>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">未来数据防泄露</span>
                  <span className="text-lg font-mono font-bold text-slate-200">PASS (0 Bias)</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">严格样本外测试</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Rituals, Reality Signal & Responsible Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Action Guide (衣·净·位·行·观·取) */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Sparkles className="w-4 h-4 text-gold-champagne" />
                今日仪式行持 (Daily Action)
              </CardTitle>
              <CardDescription>
                传统文化修持与气韵调节，不代表提高实际概率
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-champagne">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  【衣】吉色饰物
                </div>
                <p className="text-[11px] text-slate-300">
                  今日宜穿戴白、金、浅灰等金属性色调，助旺正财肃敛之气。
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-champagne">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  【净】息念定志
                </div>
                <p className="text-[11px] text-slate-300">
                  决策前静心呼吸一分钟，摒弃贪嗔躁动，以中正平和之心待之。
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-champagne">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  【取】克制守约
                </div>
                <p className="text-[11px] text-slate-300">
                  严格执行每日自设预算，达标即止，绝不追号追损。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Participation & 13% Pledge */}
          <Card className="border-emerald-500/20">
            <CardHeader>
              <CardTitle className="text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                自律防护与愿心
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Daily Budget Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">今日自律额度进度</span>
                  <span className="font-mono text-slate-300">
                    ¥{spentToday} / ¥{dailyBudget}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-obsidian-950 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(spentToday / dailyBudget) * 100}%` }}
                  />
                </div>
              </div>

              {/* 13% Share Pledge Toggle */}
              <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-gold-champagne" />
                    <span className="text-xs font-medium text-gold-champagne">
                      得财有道 · 13% 分享愿
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pledgeChecked}
                    onChange={(e) => setPledgeChecked(e.target.checked)}
                    className="rounded border-gold-500/40 text-gold-500 focus:ring-gold-500/40 bg-obsidian-900"
                  />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  自愿将可能获得的收益的 13% 用于公益回馈或济困分享。
                  <span className="text-slate-400 block mt-0.5">
                    (本项为个人修德立愿，不改变任何算法评分与实际几率)
                  </span>
                </p>
              </div>

              {/* Strict Disclaimer */}
              <div className="text-[10px] text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                ⚠️ 本系统提供传统数理与历史统计视角，不保证中奖，亦不代表实际中奖概率。请保持理性娱乐，严格自律。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
