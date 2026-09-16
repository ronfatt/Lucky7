// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Mobile Bottom Navigation Bar
// File: components/navigation/MobileBottomNav.tsx
// ==========================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  History,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  const NAV_LINKS = [
    { name: '时空总览', href: '/', icon: LayoutDashboard },
    { name: '我的命盘', href: '/destiny', icon: UserCheck },
    { name: '吉位罗盘', href: '/compass', icon: Compass },
    { name: '推演记录', href: '/history', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-obsidian-950/95 backdrop-blur-xl border-t border-gold-500/20 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-2xl">
      {NAV_LINKS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-gold-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-gold-400 shadow-gold-glow animate-pulse" />
            )}
            <Icon
              className={`w-5 h-5 transition-transform ${
                isActive ? 'scale-110 text-gold-400' : ''
              }`}
            />
            <span className="text-[10px] mt-1 font-medium tracking-tight">
              {item.name}
            </span>
          </Link>
        );
      })}

      {/* More Button */}
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-gold-300 transition-all cursor-pointer"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-1 font-medium tracking-tight">更多功能</span>
      </button>
    </nav>
  );
}
