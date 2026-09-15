'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, HeartHandshake, AlertCircle, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [dailyBudget, setDailyBudget] = useState<string>('20');
  const [monthlyBudget, setMonthlyBudget] = useState<string>('200');
  const [pledgeChecked, setPledgeChecked] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-gold-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-champagne">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              自律防护与分享愿心 · Responsible Participation & Pledge
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            理性自律是术数推演与生活智慧的根基。通过自设参与限额与善心回馈承诺，筑牢心态防线。
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Responsible Budget Setting */}
        <Card className="border-emerald-500/25">
          <CardHeader>
            <CardTitle className="text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              个人理性参与限额设置 (Budget Controls)
            </CardTitle>
            <CardDescription>
              当系统监测到您今日或当月的参与行为触及设定阈值时，将触发强制理性冷却提醒，杜绝追号追损。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">每日参与限额 (元/天)</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">每月总限额 (元/月)</label>
                <input
                  type="number"
                  min="0"
                  max="50000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5 text-xs text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-gold-champagne shrink-0 mt-0.5" />
              <span>
                系统坚决反对过度投入与赌徒谬误。一旦达到您设定的限额，系统将显示：
                <strong className="text-gold-champagne">“已达到你设定的参与上限。今天建议停止。”</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 13% Share Pledge */}
        <Card className="border-gold-500/25">
          <CardHeader>
            <CardTitle className="text-gold-champagne">
              <HeartHandshake className="w-4 h-4" />
              得财有道 · 13% 分享愿 (The 13% Share Pledge)
            </CardTitle>
            <CardDescription>
              非概率修改器 · 纯粹的个人自愿立愿与善行规划
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-slate-100 text-sm">
                  自愿签署 13% 分享承诺
                </span>
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => setPledgeChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gold-500/50 text-gold-500 focus:ring-gold-500/40 bg-obsidian-900"
                />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                我自愿立愿：若因缘际会通过任何形式获得偏财收益，愿将净收益之 13% 用于公益慈善、救急济困、反哺社会或孝亲敬长。以仁德驭财，不贪不滞。
              </p>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-white/5 pt-3">
              * 特别声明：签署此承诺属于个人修养范畴，不会且绝不能以任何形式提升算法计算的“机会分数”或“数字评分”。
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" className="flex items-center gap-2">
            {saved ? (
              <>
                <Check className="w-4 h-4 text-obsidian-950" />
                设置已成功保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-obsidian-950" />
                保存自律与愿心设定
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
