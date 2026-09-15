import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
  const mockPredictions = [
    {
      id: 'pred-20260913-01',
      date: '2026-09-13',
      version: 'V1.0',
      top5: [7, 2, 9, 5, 8],
      motherCode: '7295',
      consistency: 88.4,
      lockedAt: '2026-09-13 08:30:00 (封存不可篡改)',
      status: '已锁定',
    },
    {
      id: 'pred-20260912-01',
      date: '2026-09-12',
      version: 'V1.0',
      top5: [3, 8, 1, 6, 0],
      motherCode: '3816',
      consistency: 85.1,
      lockedAt: '2026-09-12 08:30:00 (封存不可篡改)',
      status: '已揭晓验算',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel border border-gold-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-gold-500/20 text-gold-champagne">
            <History className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-100">推演历史与不可篡改记录 · Prediction History</h2>
            <p className="text-xs text-slate-400">所有推演记录在开奖前均生成不可更改的快照与数字哈希，杜绝事后诸葛亮与数据粉饰</p>
          </div>
        </div>
        <Badge variant="gold">锁定防篡改机制</Badge>
      </div>

      <div className="space-y-4">
        {mockPredictions.map((pred) => (
          <Card key={pred.id} className="border-white/10">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-200">{pred.date}</span>
                  <Badge variant="gold">版本: {pred.version}</Badge>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {pred.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>母码: <strong className="text-gold-champagne">{pred.motherCode}</strong></span>
                  <span>TOP 5: [{pred.top5.join(', ')}]</span>
                  <span>模型一致性: {pred.consistency}%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  快照封存时间戳: {pred.lockedAt}
                </div>
              </div>
              <Link href="/laboratory">
                <Button variant="outline" size="sm">
                  回溯特征
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
