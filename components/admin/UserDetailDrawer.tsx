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
} from 'lucide-react';

interface UserDetailDrawerProps {
  userId: string | null;
  userEmail: string | null;
  onClose: () => void;
}

export function UserDetailDrawer({ userId, userEmail, onClose }: UserDetailDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'saves' | 'ledger'>('timeline');

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
              <p className="text-xs">正在调取会员全生命周期记录与习惯画像...</p>
            </div>
          ) : (
            <>
              {/* 1. Profile & Bazi Summary */}
              <Card className="bg-obsidian-950/80 border-gold-500/20 p-4 rounded-xl space-y-3">
                <div className="text-xs font-bold text-gold-champagne flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>本命玄学参数 (八字与紫微命造)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">命造格局</span>
                    <span className="font-semibold text-slate-200">
                      {data?.profile?.gender === 'female' ? '坤造 (女命)' : '乾造 (男命)'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">公历阳历生日</span>
                    <span className="font-mono text-gold-300">
                      {data?.profile?.birth_date || '未设置'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">出生时辰</span>
                    <span className="font-mono text-gold-300">
                      {data?.profile?.birth_time || '未指定'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">所属时区</span>
                    <span className="font-mono text-slate-300">
                      {data?.profile?.timezone || '吉隆坡'}
                    </span>
                  </div>
                </div>
              </Card>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
