// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Live Draw Hit Celebration Banner
// File: components/lottery/LiveDrawHitBanner.tsx
// Displays celebratory gold banner on member frontend when today's numbers hit lottery draws
// ==========================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Award,
} from 'lucide-react';
import type { DailyDrawHitReport } from '@/lib/lottery/lottery-hit-engine';

interface LiveDrawHitBannerProps {
  report: DailyDrawHitReport;
  dateStr: string;
}

export function LiveDrawHitBanner({ report, dateStr }: LiveDrawHitBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!report.hasHit) return null;

  const handleCopyCelebration = () => {
    const hitsText = report.hits
      .map(
        (h) =>
          `• 【${h.operatorNameZh}】${h.tierZh} 开出 [${h.winningNumber}]，与您推演之 ${h.hitSourceZh} [${h.matchedNumber}] 吻合 (${h.matchTypeZh})`
      )
      .join('\n');

    const text = `🎉【紫微时空数字预测 · 今日开彩大捷】🎉
📅 开彩日期：${dateStr}
🏆 出奖大捷：${report.highestOperatorZh} · ${report.highestTierZh}
✨ 累计中出：${report.totalHits} 次奖项！
---------------------------
${hitsText}
---------------------------
紫微时空，天地同频，喜气连绵！`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-gold-950/80 to-amber-900/60 border-2 border-gold-500/80 shadow-[0_0_35px_rgba(234,179,8,0.35)] animate-pulse-subtle">
      {/* Background radial glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Banner Bar */}
      <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Trophy icon & Headline */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-obsidian-950 shadow-lg shadow-gold-500/40 shrink-0 transform hover:rotate-6 transition">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 font-black text-xs uppercase tracking-wider shadow">
                🎉 今日官方开彩揭晓 · 喜报
              </span>
              <span className="text-xs font-mono text-gold-300">
                {dateStr}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white font-serif tracking-wide mt-1 drop-shadow-sm flex items-center gap-1.5">
              <span>恭喜命主！今日推算数字已中出</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-yellow-400 underline decoration-gold-400 decoration-2">
                【{report.highestOperatorZh} · {report.highestTierZh.split(' ')[0]}】
              </span>
            </h2>

            <p className="text-xs text-amber-200/90 mt-0.5">
              全盘核对：共中出 <span className="font-bold text-white font-mono text-sm">{report.totalHits}</span> 个奖项（直落直中 {report.directHits} 组，同频变体 {report.variationHits} 组）！
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleCopyCelebration}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-gold-500/40 text-gold-300 text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">已复制喜报</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>复制喜报</span>
              </>
            )}
          </button>

          <Link
            href="/draws"
            className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-black transition flex items-center gap-1 shadow-md shadow-gold-500/30"
          >
            <span>开彩全景</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs transition flex items-center gap-0.5"
          >
            <span>明细</span>
            {showDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Hit Breakdown Cards */}
      {showDetails && (
        <div className="border-t border-gold-500/30 bg-black/40 p-4 sm:p-5 space-y-3">
          <div className="text-xs font-bold text-gold-300 font-serif flex items-center gap-2">
            <Award className="w-4 h-4 text-gold-400" />
            <span>今日推演数字在各大博彩平台命中核对详情：</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {report.hits.map((hit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-obsidian-950/90 border border-gold-500/30 space-y-1.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {hit.operatorNameZh}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[10px] font-bold">
                    {hit.tierZh.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">开出号码</span>
                    <span className="font-mono text-base font-black text-white">
                      {hit.winningNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">推算命中</span>
                    <span className="font-mono text-base font-black text-gold-300">
                      {hit.matchedNumber}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400 font-serif flex items-center justify-between pt-0.5">
                  <span>来源: {hit.hitSourceZh}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    {hit.matchTypeZh}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
