// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin User Detail Drawer
// File: components/admin/UserDetailDrawer.tsx
// Displays comprehensive user persona, habit tags, saved numbers & timeline
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  User,
  Mail,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Smartphone,
  Bookmark,
  Activity,
  History,
  ShieldCheck,
  Zap,
  Sparkles,
  Compass,
} from 'lucide-react';

interface UserDetailDrawerProps {
  userId: string | null;
  userEmail: string | null;
  onClose: () => void;
}

export function UserDetailDrawer({ userId, userEmail, onClose }: UserDetailDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'saves' | 'predictions'>('timeline');
  const [predictionsList, setPredictionsList] = useState<any[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  useEffect(() => {
    setPredictionsList([]);
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'predictions' && userId && predictionsList.length === 0) {
      setPredictionsLoading(true);
      fetch(`/api/admin/analytics/member-predictions?userId=${userId}&days=14`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data?.predictions) {
            setPredictionsList(res.data.predictions);
          }
        })
        .catch(console.error)
        .finally(() => setPredictionsLoading(false));
    }
  }, [activeTab, userId, predictionsList.length]);

  useEffect(() => {
    if (!userId && !userEmail) return;
    setLoading(true);
    const param = userId ? `userId=${userId}` : `email=${encodeURIComponent(userEmail || '')}`;
    fetch(`/api/admin/analytics/user-detail?${param}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, userEmail]);

  if (!userId && !userEmail) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl h-full bg-[#090D18] border-l border-gold-500/30 flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-obsidian-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
              {data?.profile?.name ? data.profile.name[0] : '命'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif">
                  {data?.profile?.name || userEmail?.split('@')[0] || '命主'}
                </h3>
                <Badge variant="gold" className="text-[10px]">
                  {data?.profile?.membership_tier || 'FREE 会员'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{userEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-serif space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs">正在调取会员全生命周期记录与玄学档案...</p>
            </div>
          ) : (
            <>
              {/* 1. Complete BaZi & Metaphysics Deep-Dive Card */}
              {data?.metaphysics ? (
                <Card className="bg-obsidian-950/90 border-gold-500/30 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-gold-champagne" />
                      <span className="font-serif font-bold text-sm text-gold-100">
                        生辰八字四柱干支与命盘核验
                      </span>
                    </div>
                    <Badge variant="gold" className="text-[10px] font-mono">
                      {data.profile?.gender === 'female' ? '坤造 (女命)' : '乾造 (男命)'}
                    </Badge>
                  </div>

                  {/* Four Pillars 4-Cards Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {/* Year Pillar */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 flex flex-col justify-between min-h-[90px]">
                      <span className="text-[10px] text-slate-400 font-serif">年柱 (Year)</span>
                      <div className="text-base sm:text-lg font-serif font-bold text-gold-200">
                        {data.metaphysics.fourPillars.year}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {data.metaphysics.fourPillars.yearElement}
                      </span>
                    </div>

                    {/* Month Pillar */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/40 shadow-sm flex flex-col justify-between min-h-[90px] relative">
                      <span className="text-[10px] text-gold-300 font-serif font-bold flex items-center justify-center gap-0.5">
                        <span>月柱 (Month)</span>
                      </span>
                      <div className="text-base sm:text-lg font-serif font-bold text-amber-200">
                        {data.metaphysics.fourPillars.month}
                      </div>
                      <span className="text-[9px] text-amber-400 font-mono">
                        {data.metaphysics.solarTerm.currentTerm}节气
                      </span>
                    </div>

                    {/* Day Pillar */}
                    <div className="p-3 rounded-xl bg-gradient-to-b from-gold-500/15 to-obsidian-900 border border-gold-400/60 shadow-gold-glow flex flex-col justify-between min-h-[90px]">
                      <span className="text-[10px] text-gold-200 font-serif font-bold">日主 (元神)</span>
                      <div className="text-base sm:text-lg font-serif font-bold text-white">
                        {data.metaphysics.fourPillars.day}
                      </div>
                      <span className="text-[9px] text-gold-300 font-mono">
                        {data.metaphysics.fourPillars.dayMaster}
                      </span>
                    </div>

                    {/* Hour Pillar */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 flex flex-col justify-between min-h-[90px]">
                      <span className="text-[10px] text-slate-400 font-serif">时柱 (Hour)</span>
                      <div className="text-base sm:text-lg font-serif font-bold text-slate-200">
                        {data.metaphysics.fourPillars.hour}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {data.metaphysics.fourPillars.hourElement || '未知'}
                      </span>
                    </div>
                  </div>

                  {/* Calendar & Astronomy Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-obsidian-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>公历生辰:</span>
                        <strong className="text-slate-200 font-mono">
                          {data.profile?.birth_date} {data.profile?.birth_time || '(时辰未知)'}
                        </strong>
                      </div>
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>农历生辰:</span>
                        <strong className="text-gold-200 font-serif">
                          {data.metaphysics.lunar.lunarString}
                        </strong>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>节气与黄经:</span>
                        <strong className="text-amber-200 font-mono">
                          {data.metaphysics.solarTerm.currentTerm} ({data.metaphysics.solarTerm.solarLongitude}°)
                        </strong>
                      </div>
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>所属时区:</span>
                        <strong className="text-slate-300 font-mono">
                          {data.profile?.timezone || '吉隆坡'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Element Distribution & ZiWei Bureau */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Five Elements Breakdown */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-serif block">五行能量分布 (金木水火土)</span>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">金: {data.metaphysics.fourPillars.elementDistribution.Metal}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">木: {data.metaphysics.fourPillars.elementDistribution.Wood}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">水: {data.metaphysics.fourPillars.elementDistribution.Water}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">火: {data.metaphysics.fourPillars.elementDistribution.Fire}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-800/20 text-yellow-300 border border-yellow-500/20">土: {data.metaphysics.fourPillars.elementDistribution.Earth}</span>
                      </div>
                    </div>

                    {/* ZiWei Destiny Overview */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-serif block">紫微天盘定局</span>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">五行局:</span>
                          <strong className="text-gold-champagne">{data.metaphysics.ziwei.bureau}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">命宫 / 身宫:</span>
                          <span className="font-mono text-slate-200">
                            命在 {data.metaphysics.ziwei.lifePalaceStemBranch} · 身在 {data.metaphysics.ziwei.bodyPalaceStemBranch}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-obsidian-950/80 border-slate-800 p-4 rounded-xl text-center text-xs text-slate-500">
                  该用户尚未完善生辰八字（公历年月日时），暂时无法生成全息排盘。
                </Card>
              )}

              {/* 2. Key Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-obsidian-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">累计登录次数</span>
                  <span className="text-lg font-bold font-mono text-blue-300">
                    {data?.stats?.loginCount || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-obsidian-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">总交互事件</span>
                  <span className="text-lg font-bold font-mono text-gold-300">
                    {data?.stats?.totalActions || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-obsidian-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">收藏心水号码</span>
                  <span className="text-lg font-bold font-mono text-purple-300">
                    {data?.stats?.savedCount || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-obsidian-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">复盘账本记录</span>
                  <span className="text-lg font-bold font-mono text-emerald-300">
                    {data?.stats?.ledgerCount || 0}
                  </span>
                </div>
              </div>

              {/* 3. Sub-tabs: Timeline vs Saved Numbers vs Ledger */}
              <div className="flex border-b border-slate-800 gap-4 text-xs font-serif">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-2 transition flex items-center gap-1.5 ${
                    activeTab === 'timeline'
                      ? 'border-b-2 border-gold-500 text-gold-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>全息行为流水 ({data?.activityTimeline?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('saves')}
                  className={`pb-2 transition flex items-center gap-1.5 ${
                    activeTab === 'saves'
                      ? 'border-b-2 border-gold-500 text-gold-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>收藏号码 ({data?.savedPredictions?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('predictions')}
                  className={`pb-2 transition flex items-center gap-1.5 ${
                    activeTab === 'predictions'
                      ? 'border-b-2 border-gold-500 text-gold-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>每日推演档案 (近14天)</span>
                </button>
              </div>

              {/* Tab 1: Chronological Activity Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-3">
                  {(!data?.activityTimeline || data.activityTimeline.length === 0) ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      该用户暂无更多历史流水记录。
                    </div>
                  ) : (
                    data.activityTimeline.map((item: any) => {
                      const d = new Date(item.created_at);
                      const timeStr = d.toLocaleString('zh-CN', { timeZone: 'Asia/Kuala_Lumpur' });
                      const isLogin = item.event_type === 'auth.login';
                      const isLogout = item.event_type === 'auth.logout';

                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-obsidian-950 border border-slate-800/80 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isLogin && <LogIn className="w-3.5 h-3.5 text-emerald-400" />}
                              {isLogout && <LogOut className="w-3.5 h-3.5 text-rose-400" />}
                              {!isLogin && !isLogout && <Activity className="w-3.5 h-3.5 text-gold-400" />}
                              <span className="font-semibold text-slate-200">{item.event_label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">{timeStr}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1">
                            {item.page_path && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                                路由: {item.page_path}
                              </span>
                            )}
                            {item.metadata?.durationSeconds && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/50 text-blue-300">
                                停留: {item.metadata.durationSeconds} 秒
                              </span>
                            )}
                            {item.metadata?.device && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300">
                                设备: {item.metadata.device}
                              </span>
                            )}
                            {item.ip_address && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                                IP: {item.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 2: Saved Predictions */}
              {activeTab === 'saves' && (
                <div className="space-y-2">
                  {(!data?.savedPredictions || data.savedPredictions.length === 0) ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      该会员尚未收藏任何心水号码。
                    </div>
                  ) : (
                    data.savedPredictions.map((s: any) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-obsidian-950 border border-gold-500/20 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-base font-bold font-mono text-gold-300 tracking-wider">
                            {s.number}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {s.source_title_zh} · {s.date}
                          </div>
                        </div>
                        <Badge variant="gold" className="text-xs">
                          {s.score} 分
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Member Daily Predictions */}
              {activeTab === 'predictions' && (
                <div className="space-y-3">
                  {predictionsLoading ? (
                    <div className="py-12 text-center text-slate-400 font-serif space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
                      <p className="text-xs">正在依据该会员八字推演近 14 天玄学时空母码...</p>
                    </div>
                  ) : predictionsList.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      暂无该会员推演数据。
                    </div>
                  ) : (
                    predictionsList.map((p: any) => (
                      <div
                        key={p.date}
                        className="p-3.5 rounded-xl bg-obsidian-950 border border-gold-500/20 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">{p.date}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-gold-400 font-serif">
                              {p.dayStemBranch}
                            </span>
                            {p.hasHit && p.hitStatus && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-gold-500/20 border border-gold-500/50 text-gold-300 font-bold flex items-center gap-1 shadow-sm">
                                <span>🎉</span>
                                <span>{p.hitStatus.highestOperatorZh} · {p.hitStatus.highestTierZh?.split(' ')[0]}</span>
                              </span>
                            )}
                            {p.isSaved && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300">
                                已收藏
                              </span>
                            )}
                          </div>
                          <Badge variant={p.score >= 85 ? 'gold' : 'default'} className="text-[10px]">
                            {p.score} 分 · {p.confidence}
                          </Badge>
                        </div>

                        <div className="flex items-baseline justify-between bg-obsidian-900/60 p-2.5 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-serif">核心母码</span>
                            <span className="text-xl font-bold font-mono text-gold-300 tracking-wider">
                              {p.motherCode}
                            </span>
                          </div>
                          <div className="text-right text-[11px] text-slate-300 space-y-0.5">
                            <div>吉时: <span className="text-gold-300 font-mono">{p.auspiciousHour}</span></div>
                            <div>吉位: <span className="text-emerald-400">{p.wealthDirection}</span></div>
                          </div>
                        </div>

                        {/* 12 Variations */}
                        {p.variations && p.variations.length > 0 && (
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-1">12 组同频变体:</span>
                            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs text-center">
                              {p.variations.map((num: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-1 rounded bg-slate-900/80 border border-slate-800/80 text-slate-300 text-[11px]"
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
