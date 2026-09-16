// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Overview Dashboard Component
// File: components/admin/AdminOverviewDashboard.tsx
// ==========================================================

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Activity,
  LogIn,
  Calculator,
  Bookmark,
  Smartphone,
  Compass,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Flame,
} from 'lucide-react';

interface OverviewProps {
  data: {
    summary: {
      totalUsers: number;
      activeToday: number;
      totalLogins: number;
      todayLogins: number;
      totalPredictions: number;
      totalBookmarks: number;
      totalCompassQueries: number;
      totalLogsCount: number;
    };
    hourlyDistribution: { hour: number; label: string; count: number }[];
    devices: Record<string, number>;
    features: Record<string, number>;
    recentActivity: any[];
  } | null;
  loading: boolean;
  onRefresh: () => void;
}

export function AdminOverviewDashboard({ data, loading, onRefresh }: OverviewProps) {
  if (loading || !data) {
    return (
      <div className="py-16 text-center text-slate-400 font-serif space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs">正在实时汇聚平台全量运营指标...</p>
      </div>
    );
  }

  const { summary, hourlyDistribution, devices, features, recentActivity } = data;
  const maxHourlyCount = Math.max(...hourlyDistribution.map((h) => h.count), 1);
  const totalDeviceCount = Math.max(
    Object.values(devices).reduce((a, b) => a + b, 0),
    1
  );
  const totalFeatureCount = Math.max(
    Object.values(features).reduce((a, b) => a + b, 0),
    1
  );

  return (
    <div className="space-y-6">
      {/* 1. Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Users */}
        <Card className="bg-obsidian-950/80 border-gold-500/25 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">注册会员总数</span>
            <div className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-gold-200">
            {summary.totalUsers}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Supabase 云端加密</span>
          </div>
        </Card>

        {/* Active Today */}
        <Card className="bg-obsidian-950/80 border-emerald-500/30 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">今日活跃会员 (DAU)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
            {summary.activeToday}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            今日登录 {summary.todayLogins} 次
          </div>
        </Card>

        {/* Logins Count */}
        <Card className="bg-obsidian-950/80 border-blue-500/30 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">累计登录总频次</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-blue-300">
            {summary.totalLogins}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            含自动免密与手动认证
          </div>
        </Card>

        {/* Today Predictions */}
        <Card className="bg-obsidian-950/80 border-amber-500/30 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">推演测算生成数</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-amber-300">
            {summary.totalPredictions}
          </div>
          <div className="mt-1 text-[10px] text-amber-400/80">
            母码与三四位组合推演
          </div>
        </Card>

        {/* Bookmarks */}
        <Card className="bg-obsidian-950/80 border-purple-500/30 p-4 relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">心水号码收藏</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-purple-300">
            {summary.totalBookmarks}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            会员心仪号码入库量
          </div>
        </Card>
      </div>

      {/* 2. 24-Hour Activity Peak Radar */}
      <Card className="bg-obsidian-950/90 border-gold-500/20 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-champagne">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-serif">
                用户 24 小时活跃时段分布波峰 (吉隆坡时间 UTC+8)
              </h3>
              <p className="text-[11px] text-slate-400">
                揭示会员使用习惯：晨间运势推演 vs 傍晚开奖前 (17:00-19:00) 流量激增波峰
              </p>
            </div>
          </div>
          <Badge variant="gold" className="text-[10px]">
            习惯热力雷达
          </Badge>
        </div>

        {/* Bar Chart */}
        <div className="h-32 flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 px-1 border-b border-slate-800/80 overflow-x-auto">
          {hourlyDistribution.map((item) => {
            const heightPercent = Math.max((item.count / maxHourlyCount) * 100, 4);
            const isDrawHour = item.hour >= 17 && item.hour <= 19;
            return (
              <div
                key={item.hour}
                className="flex-1 min-w-[12px] flex flex-col items-center gap-1 group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-7 bg-obsidian-900 border border-slate-700 text-[10px] text-gold-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {item.label}: {item.count} 次
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t transition-all ${
                    isDrawHour
                      ? 'bg-gradient-to-t from-amber-600 to-gold-400 shadow-sm shadow-gold-500/50'
                      : item.count > 0
                      ? 'bg-gold-500/50 hover:bg-gold-400'
                      : 'bg-slate-800/40'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 px-1">
          <span>00:00 (子时)</span>
          <span>06:00 (卯时)</span>
          <span className="text-gold-400 font-bold">12:00 (午时)</span>
          <span className="text-amber-400 font-bold">18:00 (开奖前)</span>
          <span>23:00 (亥时)</span>
        </div>
      </Card>

      {/* 3. Device Fingerprints & Feature Popularity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Breakdown */}
        <Card className="bg-obsidian-950/80 border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gold-400" />
              <h4 className="text-xs font-bold text-slate-200 font-serif">访问设备终端画像</h4>
            </div>
            <span className="text-[10px] text-slate-500">移动端 vs 桌面端</span>
          </div>

          <div className="space-y-3">
            {Object.entries(devices).map(([dev, count]) => {
              const pct = Math.round((count / totalDeviceCount) * 100);
              return (
                <div key={dev} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{dev}</span>
                    <span className="font-mono text-gold-300">
                      {count} 次 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Feature Heatmap */}
        <Card className="bg-obsidian-950/80 border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-200 font-serif">功能模块交互热度</h4>
            </div>
            <span className="text-[10px] text-slate-500">点击与交互偏好</span>
          </div>

          <div className="space-y-3">
            {Object.entries(features).map(([feat, count]) => {
              const pct = Math.round((count / totalFeatureCount) * 100);
              return (
                <div key={feat} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{feat}</span>
                    <span className="font-mono text-amber-300">
                      {count} 次 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 4. Live Stream Ticker */}
      <Card className="bg-obsidian-950/80 border-slate-800/80 p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 font-serif">实时用户交互快讯 (Live Stream)</span>
          </div>
          <span className="text-[10px] text-slate-500">最近 10 条流水</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {recentActivity.length === 0 ? (
            <div className="py-4 text-center text-slate-500 text-[11px]">
              暂无最新动态，用户产生交互时将在此实时呈现。
            </div>
          ) : (
            recentActivity.map((log) => {
              const d = new Date(log.created_at);
              const time = d.toLocaleTimeString('zh-CN', { timeZone: 'Asia/Kuala_Lumpur' });
              return (
                <div key={log.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <Badge
                      variant={
                        log.event_type.startsWith('auth.login')
                          ? 'success'
                          : log.event_type.startsWith('auth.logout')
                          ? 'danger'
                          : log.event_type.startsWith('prediction')
                          ? 'gold'
                          : 'default'
                      }
                      className="text-[10px] py-0 px-1.5 shrink-0"
                    >
                      {log.event_type}
                    </Badge>
                    <span className="text-slate-300 truncate">{log.event_label}</span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      ({log.user_email || '匿名访客'})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{time}</span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
