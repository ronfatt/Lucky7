// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Mobile Menu Drawer
// File: components/navigation/MobileMenuDrawer.tsx
// ==========================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './Sidebar';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Flame,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { useAuth } from '@/lib/auth/auth-store';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenMemberCenter?: () => void;
}

export function MobileMenuDrawer({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenMemberCenter,
}: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const { isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-sm h-full bg-obsidian-950 border-l border-gold-500/20 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-obsidian-900/60 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center text-obsidian-950 font-serif font-bold text-sm">
                紫
              </div>
              <div>
                <div className="text-sm font-serif font-bold text-slate-100 flex items-center gap-1.5">
                  紫微时空数字
                  <Badge variant="gold" className="text-[9px] px-1 py-0">V1.2</Badge>
                </div>
                <div className="text-[10px] text-slate-400">传统数理与时位象数</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Card in Drawer */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-gold-500/10 to-transparent">
            {isAuthenticated ? (
              <div
                onClick={() => {
                  onClose();
                  onOpenMemberCenter?.();
                }}
                className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/30 flex items-center justify-between cursor-pointer hover:border-gold-400 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gold-200">{profile.name}</div>
                    <div className="text-[10px] text-emerald-400">云端会员 · 已同步</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth?.();
                }}
                className="w-full py-2 px-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-gold-500/20"
              >
                <span>登录 / 注册会员账号</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-gold-champagne/70 tracking-wider">
              全部推演与数理中枢
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-champagne font-bold border border-gold-500/30 shadow-gold-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">P{item.phase}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 border-t border-white/5 bg-obsidian-950 space-y-2">
          <div className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
            <span>决策辅助 · 无保证中奖 · 13%分享愿心</span>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-serif">
            时 · 位 · 象 · 数 · 行 · 验
          </div>
        </div>
      </div>
    </div>
  );
}
