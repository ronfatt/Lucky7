// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Lottery Hits Quick Summary Card
// File: components/admin/AdminLotteryHitsSummaryCard.tsx
// Quick-glance winning members bulletin for the Admin Dashboard
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, ChevronRight, User, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface WinningMemberItem {
  userId: string;
  userName: string;
  userEmail: string;
  motherCode: string;
  highestOperatorZh: string;
  highestTierZh: string;
  totalHits: number;
  directHits: number;
  variationHits: number;
  hits: Array<{
    operatorNameZh: string;
    tierZh: string;
    winningNumber: string;
    matchedNumber: string;
    hitSourceZh: string;
    matchTypeZh: string;
  }>;
}

interface AdminLotteryHitsSummaryCardProps {
  onNavigateToPredictions?: () => void;
}

export function AdminLotteryHitsSummaryCard({ onNavigateToPredictions }: AdminLotteryHitsSummaryCardProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayStr);
  const [winningMembers, setWinningMembers] = useState<WinningMemberItem[]>([]);
  const [totalMembersChecked, setTotalMembersChecked] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics/member-predictions?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.predictions) {
          setTotalMembersChecked(data.data.predictions.length);
          const winners: WinningMemberItem[] = data.data.predictions
            .filter((p: any) => p.hasHit && p.hitStatus)
            .map((p: any) => ({
              userId: p.userId,
              userName: p.userName,
              userEmail: p.userEmail,
              motherCode: p.motherCode,
              highestOperatorZh: p.hitStatus.highestOperatorZh,
              highestTierZh: p.hitStatus.highestTierZh,
              totalHits: p.hitStatus.totalHits,
              directHits: p.hitStatus.directHits,
              variationHits: p.hitStatus.variationHits,
              hits: p.hitStatus.hits || [],
            }));
          setWinningMembers(winners);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <Card className="bg-gradient-to-r from-amber-950/40 via-[#0E1528] to-[#0A0F1E] border-2 border-gold-500/50 p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-obsidian-950 shadow-md shadow-gold-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-serif tracking-wide">
                今日官方开彩中奖会员捷报榜
              </h3>
              <Badge variant="gold" className="text-[10px]">
                {date}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              实时核验 7 大博彩平台开彩结果与全站会员推算数字（核心母码 + 12 组变体）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#070A12] border border-slate-800 text-xs text-gold-300 px-2.5 py-1 rounded-xl focus:outline-none focus:border-gold-500/50 font-mono"
          />
          {onNavigateToPredictions && (
            <button
              type="button"
              onClick={onNavigateToPredictions}
              className="px-3 py-1 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>查看全部会员推演表</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-6 text-center text-slate-500 text-xs font-serif space-y-1">
          <div className="w-5 h-5 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
          <span>正在核验各平台开出号码与各会员八字母码...</span>
        </div>
      ) : winningMembers.length === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs font-serif">
          该开彩日暂无会员数字命中，或开彩数据尚未揭晓。
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold-200 font-serif">
              🎉 共有 <strong className="text-amber-400 font-mono text-sm">{winningMembers.length}</strong> 位会员的推算数字在各大彩票中出：
            </span>
            <span className="text-[11px] text-slate-400">
              核对基数: {totalMembersChecked} 位会员
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {winningMembers.map((m) => (
              <div
                key={m.userId}
                className="p-3.5 rounded-xl bg-obsidian-950/90 border border-gold-500/30 hover:border-gold-500/60 transition space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-serif font-bold">
                      {m.userName ? m.userName[0] : '会'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-xs">{m.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">{m.userEmail}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-gold-500/20 border border-gold-500/50 text-gold-300 font-bold text-[10px]">
                    <span>{m.highestOperatorZh}</span>
                    <span>·</span>
                    <span>{m.highestTierZh.split(' ')[0]}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
                  <div className="text-[11px]">
                    <span className="text-slate-400 text-[10px] block font-serif">当日核心母码</span>
                    <span className="font-mono font-black text-gold-300 tracking-wider text-sm">{m.motherCode}</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-slate-400 text-[10px] block">命中奖项</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      共 {m.totalHits} 次 ({m.directHits > 0 ? `直中×${m.directHits}` : `变体×${m.variationHits}`})
                    </span>
                  </div>
                </div>

                {/* Hits List Mini */}
                <div className="space-y-1 pt-1">
                  {m.hits.slice(0, 2).map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[10px]"
                    >
                      <span className="text-slate-300">
                        【{h.operatorNameZh}】{h.tierZh.split(' ')[0]}
                      </span>
                      <span className="font-mono text-gold-300 font-bold">
                        开出 {h.winningNumber}
                      </span>
                    </div>
                  ))}
                  {m.hits.length > 2 && (
                    <div className="text-[9px] text-slate-500 text-right">
                      等共 {m.hits.length} 处中彩...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
