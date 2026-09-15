'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const todayStr = '2026年9月13日 · 丙午年 丁酉月 辛未日';

  return (
    <header className="h-16 border-b border-gold-500/15 bg-obsidian-950/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-mono tracking-wide">{todayStr}</span>
        </div>
        <Badge variant="gold" className="text-[11px] font-serif">
          天心正运 · 洛书九宫归元
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Compliance / Non-gambling pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-900 border border-slate-800 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-gold-400" />
          <span>决策辅助 · 无保证中奖</span>
        </div>

        {/* 13% Share Pledge Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-[11px] text-gold-champagne">
          <HeartHandshake className="w-3.5 h-3.5 text-gold-champagne" />
          <span>得财有道 · 13%分享愿</span>
        </div>

        {/* Responsible limit pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>自律护航中</span>
        </div>
      </div>
    </header>
  );
}
