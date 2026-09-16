// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Member Daily Predictions View
// File: components/admin/AdminDailyPredictionsView.tsx
// Comprehensive inspector for every member's calculated 4-digit numbers by date
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Search,
  Download,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Compass,
  Shirt,
  User,
  Hash,
  Eye,
} from 'lucide-react';

interface PredictionItem {
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  dayStemBranch: string;
  lunarDateStr: string;
  motherCode: string;
  confidence: string;
  score: number;
  windfallScore: number;
  windfallSuitability: string;
  auspiciousHour: string;
  wealthDirection: string;
  luckyColor: string;
  colorReason: string;
  variations: string[];
  isSaved?: boolean;
  viewCount?: number;
}

export function AdminDailyPredictionsView() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Available users for dropdown
  const [members, setMembers] = useState<{ id: string; name: string; email: string }[]>([]);

  // Fetch users for dropdown
  useEffect(() => {
    fetch('/api/admin/analytics/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.users) {
          setMembers(
            data.data.users.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('date', selectedDate);
      if (selectedUserId) params.append('userId', selectedUserId);

      const res = await fetch(`/api/admin/analytics/member-predictions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPredictions(data.data.predictions);
      }
    } catch (e) {
      console.error('Fetch predictions error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [selectedDate, selectedUserId]);

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    params.append('date', selectedDate);
    if (selectedUserId) params.append('userId', selectedUserId);
    params.append('format', 'csv');
    window.open(`/api/admin/analytics/member-predictions?${params.toString()}`, '_blank');
  };

  const handleDateQuickSelect = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const filteredPredictions = predictions.filter((p) => {
    const q = searchKeyword.toLowerCase();
    return (
      p.userName?.toLowerCase().includes(q) ||
      p.userEmail?.toLowerCase().includes(q) ||
      p.motherCode?.includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Control & Filter Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Quick Date Pills */}
          <div className="flex items-center gap-1 bg-[#060810] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handleDateQuickSelect(0)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                selectedDate === todayStr
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              今日
            </button>
            <button
              type="button"
              onClick={() => handleDateQuickSelect(1)}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition font-medium"
            >
              昨日
            </button>
            <button
              type="button"
              onClick={() => handleDateQuickSelect(2)}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition font-medium"
            >
              前日
            </button>
          </div>

          {/* Date Picker */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#060810] border border-slate-800 text-xs text-gold-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50 font-mono"
            />
          </div>

          {/* Member Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-[#060810] border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50 max-w-[200px]"
            >
              <option value="">全部会员 ({members.length} 人)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[180px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="按姓名、邮箱或号码检索..."
              className="w-full bg-[#060810] border border-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchPredictions}
            className="text-xs flex items-center gap-1 py-1.5 h-auto"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </Button>
        </div>

        {/* Export CSV Button */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <Button
            type="button"
            onClick={handleExportCsv}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-md shadow-gold-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出当日推演 CSV</span>
          </Button>
        </div>
      </div>

      {/* Predictions Table */}
      <Card className="bg-obsidian-950/80 border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A12] text-slate-400 font-serif border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">推演日期 / 干支</th>
                <th className="p-3.5">会员身份</th>
                <th className="p-3.5 text-center">4 位核心推演母码</th>
                <th className="p-3.5">气场契合度 / 偏财</th>
                <th className="p-3.5">吉位罗盘 / 时辰</th>
                <th className="p-3.5">吉色穿搭</th>
                <th className="p-3.5 pr-4 text-right">状态 / 变体</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 font-serif space-y-2">
                    <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs">正在实时为各会员校准时空洛书并推算当日数字...</p>
                  </td>
                </tr>
              ) : filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-serif">
                    未检索到该日期或条件下的会员推演数据。
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((item, idx) => {
                  const rowId = `${item.userId}_${item.date}`;
                  const isExpanded = expandedRow === rowId;

                  return (
                    <React.Fragment key={rowId}>
                      <tr
                        onClick={() => setExpandedRow(isExpanded ? null : rowId)}
                        className="hover:bg-gold-500/[0.04] transition cursor-pointer group"
                      >
                        {/* Date & Stem-Branch */}
                        <td className="p-3.5 pl-4 whitespace-nowrap">
                          <div className="font-mono text-xs text-slate-200 font-bold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gold-400" />
                            <span>{item.date}</span>
                          </div>
                          <div className="text-[11px] text-amber-400/90 font-serif mt-0.5">
                            【{item.dayStemBranch}日】
                          </div>
                        </td>

                        {/* Member */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-200 group-hover:text-gold-300 transition">
                            {item.userName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.userEmail}
                          </div>
                        </td>

                        {/* 4-Digit Hero Number */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-gradient-to-r from-gold-500/20 via-amber-500/30 to-gold-500/20 border border-gold-500/50 text-gold-200 font-mono font-black text-xl sm:text-2xl tracking-widest shadow-sm shadow-gold-500/20 group-hover:scale-105 transition-transform">
                            {item.motherCode}
                          </div>
                          <div className="text-[10px] text-gold-champagne/70 font-mono mt-0.5">
                            置信评级: {item.confidence}
                          </div>
                        </td>

                        {/* Scores */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="text-xs font-bold font-mono text-emerald-300">
                            {item.score} 分
                          </div>
                          <div className="text-[10px] text-slate-400">
                            偏财指数: <span className="text-amber-400 font-mono">{item.windfallScore} 分</span>
                          </div>
                        </td>

                        {/* Wealth Direction */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-xs text-purple-300 font-serif">
                            <Compass className="w-3.5 h-3.5 text-purple-400" />
                            <span>{item.wealthDirection}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            吉时: {item.auspiciousHour}
                          </div>
                        </td>

                        {/* Lucky Color */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-200">
                            <Shirt className="w-3.5 h-3.5 text-gold-400" />
                            <span>{item.luckyColor}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                            {item.colorReason}
                          </div>
                        </td>

                        {/* Status & Variations toggle */}
                        <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.isSaved && (
                              <Badge variant="gold" className="text-[10px] py-0.5 flex items-center gap-1">
                                <Bookmark className="w-3 h-3 fill-gold-400" />
                                <span>已收藏</span>
                              </Badge>
                            )}
                            <button
                              type="button"
                              className="p-1 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-0.5 text-[11px]"
                            >
                              <span>变体</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row: 12 Variations Grid */}
                      {isExpanded && (
                        <tr className="bg-obsidian-900/60 border-b border-gold-500/20">
                          <td colSpan={7} className="p-4 pl-6">
                            <div className="space-y-2.5">
                              <div className="text-xs font-bold text-gold-champagne font-serif flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                                <span>
                                  【{item.userName}】当日核心母码【{item.motherCode}】派生之 12 组延展吉数 (含互易与倒换阵列)
                                </span>
                              </div>

                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {item.variations?.map((varCode, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="p-2 rounded-xl bg-obsidian-950 border border-slate-800 text-center font-mono font-bold text-slate-200 text-sm hover:border-gold-500/50 hover:text-gold-300 transition"
                                  >
                                    {varCode}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
