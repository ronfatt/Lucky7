'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { History, CalendarDays, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DailyHistoryPage() {
  const pastRecords = [
    { date: '2026-09-13', solarTerm: '白露', opportunity: 76, level: 'STRONG', top3: [5, 7, 2], dominant: 'Metal' },
    { date: '2026-09-12', solarTerm: '白露', opportunity: 68, level: 'NORMAL', top3: [3, 8, 1], dominant: 'Water' },
    { date: '2026-09-11', solarTerm: '白露', opportunity: 62, level: 'NORMAL', top3: [7, 2, 9], dominant: 'Fire' },
    { date: '2026-09-10', solarTerm: '白露', opportunity: 54, level: 'NORMAL', top3: [0, 5, 8], dominant: 'Earth' },
    { date: '2026-09-09', solarTerm: '白露', opportunity: 71, level: 'STRONG', top3: [4, 9, 2], dominant: 'Metal' },
    { date: '2026-09-08', solarTerm: '白露', opportunity: 38, level: 'WEAK', top3: [1, 6, 3], dominant: 'Wood' },
    { date: '2026-09-07', solarTerm: '处暑', opportunity: 59, level: 'NORMAL', top3: [2, 7, 5], dominant: 'Fire' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-champagne">
              <History className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              时空推演历史与过去7日走势 (Daily History)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            按日归档的时空签名与激活快照，记录客观模型演化，杜绝事后改写。
          </p>
        </div>
        <Link href="/today">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 返回今日激活
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="w-4 h-4 text-gold-champagne" />
            过去 7 日时空指数与激活记录
          </CardTitle>
          <CardDescription>
            纯描述性历史快照展示，不作为未来任何概率推断依据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-white/5">
                <tr>
                  <th className="py-2.5 px-3">日期</th>
                  <th className="py-2.5 px-3">节气</th>
                  <th className="py-2.5 px-3">时空指数</th>
                  <th className="py-2.5 px-3">状态等级</th>
                  <th className="py-2.5 px-3">主导五行</th>
                  <th className="py-2.5 px-3">Top 3 激活数字</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {pastRecords.map((r) => (
                  <tr key={r.date} className="hover:bg-white/5">
                    <td className="py-3 px-3 text-slate-200 font-bold">{r.date}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">{r.solarTerm}</td>
                    <td className="py-3 px-3 text-gold-champagne font-bold">{r.opportunity}</td>
                    <td className="py-3 px-3 font-sans">
                      <Badge variant={r.level === 'STRONG' ? 'gold' : r.level === 'WEAK' ? 'danger' : 'default'}>
                        {r.level}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">{r.dominant}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5 font-bold text-slate-100">
                        {r.top3.map(d => (
                          <span key={d} className="px-1.5 py-0.5 rounded bg-obsidian-900 border border-white/10">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
