// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Activity Logs View
// File: components/admin/AdminActivityLogsView.tsx
// High-density live telemetry audit log stream with 1-click CSV export
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  LogIn,
  LogOut,
  Calculator,
  Bookmark,
  Compass,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const EVENT_TYPE_OPTIONS = [
  { value: '', label: '全部事件类型' },
  { value: 'auth.login', label: '🔑 会员登录 (Login)' },
  { value: 'auth.logout', label: '🚪 会员退出 (Logout)' },
  { value: 'auth.register', label: '✨ 会员注册 (Register)' },
  { value: 'prediction.generate', label: '🎲 数字推演 (Generate)' },
  { value: 'prediction.save', label: '⭐ 心水收藏 (Bookmark)' },
  { value: 'compass.query', label: '🧭 吉位罗盘 (Compass)' },
  { value: 'page.view', label: '📄 页面浏览 (Page View)' },
];

export function AdminActivityLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedEventType) params.append('event_type', selectedEventType);
      if (searchEmail) params.append('email', searchEmail);
      params.append('limit', '150');

      const res = await fetch(`/api/admin/analytics/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs);
        setTotalCount(data.data.total);
      }
    } catch (e) {
      console.error('Fetch logs error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedEventType]);

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (selectedEventType) params.append('event_type', selectedEventType);
    if (searchEmail) params.append('email', searchEmail);
    params.append('format', 'csv');
    window.open(`/api/admin/analytics/logs?${params.toString()}`, '_blank');
  };

  const getEventBadge = (type: string) => {
    if (type === 'auth.login') {
      return (
        <Badge variant="success" className="text-[10px] py-0.5 flex items-center gap-1">
          <LogIn className="w-3 h-3" />
          <span>登入</span>
        </Badge>
      );
    }
    if (type === 'auth.logout') {
      return (
        <Badge variant="danger" className="text-[10px] py-0.5 flex items-center gap-1">
          <LogOut className="w-3 h-3" />
          <span>登出</span>
        </Badge>
      );
    }
    if (type === 'auth.register') {
      return (
        <Badge variant="gold" className="text-[10px] py-0.5 flex items-center gap-1">
          <span>新注册</span>
        </Badge>
      );
    }
    if (type.startsWith('prediction')) {
      return (
        <Badge variant="gold" className="text-[10px] py-0.5 flex items-center gap-1">
          <Calculator className="w-3 h-3" />
          <span>推演</span>
        </Badge>
      );
    }
    if (type.startsWith('compass')) {
      return (
        <Badge variant="wood" className="text-[10px] py-0.5 flex items-center gap-1">
          <Compass className="w-3 h-3" />
          <span>罗盘</span>
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="text-[10px] py-0.5 text-slate-400">
        <span>流水</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Action and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search by Email */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              placeholder="按会员邮箱模糊检索..."
              className="w-full bg-[#090D18] border border-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50"
            />
          </div>

          {/* Filter by Event Type */}
          <div className="relative">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-[#090D18] border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50"
            >
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            className="text-xs flex items-center gap-1 py-1.5 h-auto"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>查询</span>
          </Button>
        </div>

        {/* Export CSV Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleExportCsv}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-md shadow-gold-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出 CSV 审计报表</span>
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-obsidian-950/80 border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A12] text-slate-400 font-serif border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">时间 (UTC+8)</th>
                <th className="p-3">会员身份</th>
                <th className="p-3">事件类型</th>
                <th className="p-3">详细动作说明</th>
                <th className="p-3">路由 / 停留</th>
                <th className="p-3 pr-4">IP / 设备终端</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-serif">
                    正在检索实时操作流水...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-serif">
                    未检索到符合条件的日志记录。
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const d = new Date(log.created_at);
                  const timeStr = d.toLocaleString('zh-CN', {
                    timeZone: 'Asia/Kuala_Lumpur',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition">
                      {/* Time */}
                      <td className="p-3 pl-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {timeStr}
                      </td>

                      {/* User */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {log.user_name || '命主'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {log.user_email || '匿名访客'}
                        </div>
                      </td>

                      {/* Event Type Badge */}
                      <td className="p-3 whitespace-nowrap">{getEventBadge(log.event_type)}</td>

                      {/* Description / Label */}
                      <td className="p-3">
                        <span className="text-slate-300 font-medium">{log.event_label}</span>
                        {log.metadata?.motherCode && (
                          <span className="ml-1.5 font-mono text-gold-300 font-bold">
                            [{log.metadata.motherCode}]
                          </span>
                        )}
                        {log.metadata?.direction && (
                          <span className="ml-1.5 text-purple-300 text-[11px]">
                            ({log.metadata.direction})
                          </span>
                        )}
                      </td>

                      {/* Route & Duration */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-mono text-[10px] text-slate-400">
                          {log.page_path || '/'}
                        </div>
                        {log.metadata?.durationSeconds ? (
                          <span className="text-[10px] text-blue-400">
                            停留 {log.metadata.durationSeconds}s
                          </span>
                        ) : null}
                      </td>

                      {/* IP & Device */}
                      <td className="p-3 pr-4 whitespace-nowrap">
                        <div className="text-[11px] text-slate-300">
                          {log.metadata?.device || '桌面端'}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {log.ip_address || '127.0.0.1'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
