'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  FlaskConical,
  History,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  Sliders,
  Sparkles,
  BookOpen,
  BookMarked,
  UserCheck,
  CalendarDays,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export interface NavItem {
  name: string;
  nameEn: string;
  href: string;
  icon: React.ElementType;
  phase: number;
}

export const NAV_ITEMS: NavItem[] = [
  { name: '时空总览', nameEn: 'Dashboard', href: '/', icon: LayoutDashboard, phase: 1 },
  { name: '数理实验室', nameEn: 'Number Lab', href: '/laboratory', icon: FlaskConical, phase: 1 },
  { name: '时空分析', nameEn: 'Daily Analysis', href: '/analysis', icon: CalendarDays, phase: 4 },
  { name: '我的命盘', nameEn: 'My Destiny', href: '/destiny', icon: UserCheck, phase: 3 },
  { name: '今日观象', nameEn: 'Reality Signal', href: '/reality', icon: Sparkles, phase: 5 },
  { name: '吉位罗盘', nameEn: 'Luck Compass', href: '/compass', icon: Compass, phase: 9 },
  { name: '回测验证', nameEn: 'Backtesting', href: '/backtest', icon: LineChart, phase: 6 },
  { name: '推演记录', nameEn: 'History', href: '/history', icon: History, phase: 1 },
  { name: '规则中枢', nameEn: 'Rules Engine', href: '/rules', icon: BookOpen, phase: 1 },
  { name: '易理文库', nameEn: 'Canon Library', href: '/literature', icon: BookMarked, phase: 2 },
  { name: '算法调优', nameEn: 'Admin Tuning', href: '/admin', icon: Sliders, phase: 8 },
  { name: '自律与愿心', nameEn: 'Settings & Pledge', href: '/settings', icon: ShieldCheck, phase: 1 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gold-500/15 bg-obsidian-950/80 backdrop-blur-xl flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Logo and Brand Header */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-600 via-gold-500 to-amber-700 flex items-center justify-center text-obsidian-950 shadow-gold-glow font-serif font-bold text-xl">
            紫
          </div>
          <div>
            <h1 className="font-serif font-bold text-slate-100 text-sm tracking-wider flex items-center gap-1.5">
              紫微时空数字
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-champagne font-mono font-normal">
                V1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">
              ZWTSP · 时位象数行验
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-gold-500/15 text-gold-champagne font-medium border border-gold-500/30 shadow-gold-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-gold-champagne' : 'text-slate-400 group-hover:text-gold-400'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.phase > 1 ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-obsidian-800 text-slate-400 border border-slate-700/40">
                    P{item.phase}
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Metaphysics Loop Banner */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="rounded-lg bg-obsidian-900/90 border border-gold-500/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-gold-champagne font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-gold-400" />
            <span>核心演化律</span>
          </div>
          <p className="text-[11px] text-slate-400 font-serif leading-relaxed">
            时 · 位 · 象 · 数 · 行 · 验
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            传统数理与统计回测推演系统
          </p>
        </div>

        <div className="text-[10px] text-slate-400 text-center leading-tight">
          非中奖保障系统 · 理性探索
        </div>
      </div>
    </aside>
  );
}
