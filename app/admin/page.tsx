// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Operations & Intelligence Hub
// File: app/admin/page.tsx
// Comprehensive analytics, user roster, habit profiling, telemetry logs & DB manager
// Protected by independent Admin ID & Password authentication gate
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  Users,
  History,
  Database,
  Sliders,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { AdminLoginGate } from '@/components/admin/AdminLoginGate';
import { AdminOverviewDashboard } from '@/components/admin/AdminOverviewDashboard';
import { AdminDailyPredictionsView } from '@/components/admin/AdminDailyPredictionsView';
import { AdminUsersView } from '@/components/admin/AdminUsersView';
import { AdminActivityLogsView } from '@/components/admin/AdminActivityLogsView';
import { DatabaseManagerView } from '@/components/admin/DatabaseManagerView';

export default function AdminPage() {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<string>('admin');
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'users' | 'logs' | 'database'>('overview');

  // Overview Data State
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Users Data State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // 1. Verify Admin Session on mount
  useEffect(() => {
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAdminAuth(true);
          setAdminUser(data.username || 'admin');
          fetchOverview();
          fetchUsers();
        } else {
          setIsAdminAuth(false);
        }
      })
      .catch(() => setIsAdminAuth(false));
  }, []);

  const fetchOverview = async () => {
    setOverviewLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/overview');
      const data = await res.json();
      if (data.success) {
        setOverviewData(data.data);
      }
    } catch (e) {
      console.error('Fetch overview error:', e);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/users');
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data.users);
      }
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {}
    setIsAdminAuth(false);
  };

  // Loading Admin Authentication Verification
  if (isAdminAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-gold-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
          <span className="text-xs font-serif tracking-widest">
            正在核验中台特权凭证...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated as Admin: Show Dedicated Admin Login Portal
  if (!isAdminAuth) {
    return (
      <AdminLoginGate
        onSuccess={(name) => {
          setIsAdminAuth(true);
          setAdminUser(name);
          fetchOverview();
          fetchUsers();
        }}
      />
    );
  }

  // Authenticated Admin Hub View
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-gold-500/25 bg-gradient-to-r from-obsidian-950 via-[#0B0F1E] to-obsidian-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 text-obsidian-950 font-serif font-black text-xl flex items-center justify-center shadow-gold-glow shrink-0">
              中
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-serif font-bold text-slate-100 tracking-wide">
                  紫微时空数字预测系统 · 运营治理中台
                </h1>
                <Badge variant="gold" className="text-[10px] hidden sm:inline-flex">
                  Admin Guard
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-serif">
                <span className="text-gold-300 font-mono">当前操作员: {adminUser}</span>
                <span>·</span>
                <span>全量行为流水收集已启用</span>
                <span>·</span>
                <span className="text-emerald-400">已与 Supabase 云端同步</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                fetchOverview();
                fetchUsers();
              }}
              className="text-xs flex items-center gap-1.5 border-slate-700 hover:border-gold-500/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${overviewLoading || usersLoading ? 'animate-spin' : ''}`} />
              <span>实时同步</span>
            </Button>

            <Link href="/">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5 border-slate-700 hover:border-slate-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回会员面板</span>
              </Button>
            </Link>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleAdminLogout}
              className="text-xs flex items-center gap-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>安全退出</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-obsidian-950 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-bold font-serif transition flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>全局数据看板</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 min-w-[145px] py-2.5 px-3 rounded-xl text-xs font-bold font-serif transition flex items-center justify-center gap-2 ${
              activeTab === 'predictions'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>会员每日推演档案</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold font-serif transition flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>会员档案与习惯 ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-bold font-serif transition flex items-center justify-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>全息实时流水</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-bold font-serif transition flex items-center justify-center gap-2 ${
              activeTab === 'database'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>数据库与算法</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div>
          {activeTab === 'overview' && (
            <AdminOverviewDashboard
              data={overviewData}
              loading={overviewLoading}
              onRefresh={fetchOverview}
            />
          )}

          {activeTab === 'predictions' && (
            <AdminDailyPredictionsView />
          )}

          {activeTab === 'users' && (
            <AdminUsersView
              users={usersList}
              loading={usersLoading}
              onRefresh={fetchUsers}
            />
          )}

          {activeTab === 'logs' && <AdminActivityLogsView />}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <DatabaseManagerView />

              <Card className="border-gold-500/20 bg-obsidian-950/60">
                <CardHeader>
                  <CardTitle className="text-sm text-gold-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-gold-400" />
                    <span>9 维算法权重调优策略 (Algorithm Governance)</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    普通用户仅能查阅推演结果，管理员可在此审查底层算法与经典古籍映射逻辑。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    当前生效调优结构：个人本命（15%）、时空八字（15%）、紫微星曜（10%）、四化飞星（5%）、五行生克（10%）、河洛九宫（10%）、现实观象（5%）、历史统计（20%）、数理结构（10%）。每次微调均由系统自动记录审计版本号并生成版本快照。
                  </p>
                  <Link href="/rules">
                    <Button variant="outline" size="sm" className="text-xs">
                      查看当前生效规则库 (Rules Repository)
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
