import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function RealityPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gold-500/20 text-gold-champagne">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-100">今日观象取数 · Reality Signal Engine</h2>
              <p className="text-xs text-slate-400">捕捉日常生活中的偶发数字（车牌、价格、小票、时间、门牌），解析其与当日时空的数理共振</p>
            </div>
          </div>
          <Badge variant="gold">Phase 5 核心模块</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>观象取数方法论 (梅花易数象数体用)</CardTitle>
          <CardDescription>
            万物皆数，见微知著。当前您可先在数理实验室中直接输入任意观察到的数字进行五行与洛书解析。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-gold-champagne block">输入示例：</span>
            <div className="flex gap-2 font-mono text-xs">
              <span className="px-2 py-1 bg-obsidian-950 rounded border border-slate-700">车牌: 5729</span>
              <span className="px-2 py-1 bg-obsidian-950 rounded border border-slate-700">小票: 7752</span>
              <span className="px-2 py-1 bg-obsidian-950 rounded border border-slate-700">时间: 1528</span>
            </div>
          </div>
          <Link href="/laboratory">
            <Button variant="gold" size="sm">
              在数理实验室中立即分析这些数字
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
