'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, CalendarDays, ArrowRight, CheckCircle2, XCircle, Search } from 'lucide-react';
import Link from 'next/link';

export default function PredictionHistoryPage() {
  const snapshots = [
    {
      date: '2026-09-08',
      motherCode: '6109',
      score: 87.4,
      actualResult: '6109',
      exactMatch: true,
      digitSetMatch: true,
      positionMatches: 4,
      rankOfActual: 1,
    },
    {
      date: '2026-09-07',
      motherCode: '3582',
      score: 86.8,
      actualResult: '3528',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 2,
      rankOfActual: 3,
    },
    {
      date: '2026-09-06',
      motherCode: '8816',
      score: 85.2,
      actualResult: '8861',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 2,
      rankOfActual: 4,
    },
    {
      date: '2026-09-05',
      motherCode: '5729',
      score: 88.7,
      actualResult: '9275',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 0,
      rankOfActual: 8,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">历史推演快照与实盘对照</h1>
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
              不可篡改存证
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            系统对每日推演快照进行不可逆留存，并于开奖后自动比对准确度（包含完全命中、位置命中与无序集合吻合）。
          </p>
        </div>

        <Link
          href="/dashboard/prediction"
          className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          返回今日数字模型
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Snapshots Table */}
      <Card className="bg-[#0B0F19]/90 border-slate-800 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070A12] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">推演日期</th>
                <th className="p-3">模型母码</th>
                <th className="p-3">模型评分</th>
                <th className="p-3">实际开奖号码</th>
                <th className="p-3">精确命中 (Exact)</th>
                <th className="p-3">集合命中 (Digit Set)</th>
                <th className="p-3">同位命中数</th>
                <th className="p-3 text-right">实际号码排位</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {snapshots.map((s) => (
                <tr key={s.date} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-mono text-slate-400">{s.date}</td>
                  <td className="p-3 font-mono font-bold text-gold-300 text-sm">
                    {s.motherCode}
                  </td>
                  <td className="p-3 font-mono text-slate-300">{s.score.toFixed(1)}分</td>
                  <td className="p-3 font-mono font-bold text-white text-sm">
                    {s.actualResult}
                  </td>
                  <td className="p-3">
                    {s.exactMatch ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> 完全一致
                      </span>
                    ) : (
                      <span className="text-slate-500">否</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.digitSetMatch ? (
                      <span className="text-blue-400 font-medium">四字完全吻合 (无序)</span>
                    ) : (
                      <span className="text-slate-500">部分重合</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-300">{s.positionMatches} 位</td>
                  <td className="p-3 text-right font-mono font-bold text-gold-400">
                    #{s.rankOfActual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
