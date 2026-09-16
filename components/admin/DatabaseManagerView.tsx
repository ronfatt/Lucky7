// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Supabase Database Manager View
// File: components/admin/DatabaseManagerView.tsx
// ==========================================================

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Database,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCode,
  Copy,
  Check,
  Server,
  Users,
  BookOpen,
  History,
  Lock,
} from 'lucide-react';

export function DatabaseManagerView() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
    stats?: any;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzknjqnlnhzcoscrdtmf.supabase.co';
  const projectRef = 'xzknjqnlnhzcoscrdtmf';

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/admin/seed-database', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedResult({
          success: true,
          message: '数据库古籍原典与博彩历史数据灌库成功！',
          stats: data.stats,
        });
      } else {
        setSeedResult({
          success: false,
          message: data.error || '灌库请求失败，请确保已在 Supabase 运行过建表 SQL 脚本。',
        });
      }
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err?.message || '网络通讯异常，无法连接到服务端灌库 API',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySqlInstruction = () => {
    const text = `-- 请在 Supabase SQL Editor 中执行项目内 supabase/full_database_setup.sql 脚本`;
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <Card className="border-gold-500/20 bg-obsidian-950/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-champagne border border-gold-500/20">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <CardTitle className="text-base text-gold-100 font-serif">
                Supabase 云端数据库治理与数据灌库
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                管理古籍原典、新马博彩出奖、飞星规约与全平台会员资料表
              </CardDescription>
            </div>
          </div>
          <Badge variant="gold" className="text-[11px] font-mono">
            xzknjqnlnhzcoscrdtmf
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Connection status bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Server className="w-3 h-3 text-gold-400" />
              <span>云端实例 URL</span>
            </div>
            <div className="text-xs font-mono text-slate-200 truncate" title={supabaseUrl}>
              {supabaseUrl}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>安全策略 (RLS)</span>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>行级隔离已启用</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-gold-champagne" />
              <span>会员系统状态</span>
            </div>
            <div className="text-xs font-semibold text-gold-champagne flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auth + user_profiles 就绪</span>
            </div>
          </div>
        </div>

        {/* Database Tables Overview */}
        <div className="p-4 rounded-xl bg-obsidian-900/60 border border-gold-500/15 space-y-3">
          <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              核心云端数据表架构 (8 大表结构)
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              定义于 supabase/full_database_setup.sql
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">user_profiles</div>
              <div className="text-[10px] text-slate-500 mt-0.5">会员命盘与八字四柱</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">classical_literature</div>
              <div className="text-[10px] text-slate-500 mt-0.5">古籍原典书目库</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">literature_chapters</div>
              <div className="text-[10px] text-slate-500 mt-0.5">紫微古籍篇章详解</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">flying_star_patterns</div>
              <div className="text-[10px] text-slate-500 mt-0.5">十干飞星四化规约</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">lottery_draws</div>
              <div className="text-[10px] text-slate-500 mt-0.5">新马 7 大博彩开奖</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">saved_predictions</div>
              <div className="text-[10px] text-slate-500 mt-0.5">会员心水号码收藏</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">prediction_ledger</div>
              <div className="text-[10px] text-slate-500 mt-0.5">个人推演复盘账本</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-slate-800">
              <div className="font-mono text-slate-300 font-semibold">numerology_rules</div>
              <div className="text-[10px] text-slate-500 mt-0.5">数理规则与调优参数</div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex-1 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10"
          >
            {isSeeding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>正在执行云端灌库同步...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>一键执行数据灌库 (Seed Canons & Draws)</span>
              </>
            )}
          </Button>

          <a
            href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-gold-500/40 bg-obsidian-900 text-slate-300 hover:text-gold-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            <span>打开 Supabase SQL Editor</span>
          </a>
        </div>

        {/* Result Feedback Banner */}
        {seedResult && (
          <div
            className={`p-4 rounded-xl border text-xs animate-fade-in ${
              seedResult.success
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {seedResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold">{seedResult.message}</div>
                {seedResult.stats && (
                  <div className="text-[11px] text-slate-300 flex flex-wrap gap-3 pt-1">
                    <span>古籍原典: {seedResult.stats.literatureCount} 卷</span>
                    <span>篇章详解: {seedResult.stats.chaptersCount} 篇</span>
                    <span>四化断语: {seedResult.stats.sihuaPatternsCount} 条</span>
                    <span>开奖历史: {seedResult.stats.drawsCount} 期</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
