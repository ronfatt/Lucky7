// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Responsive Header
// File: components/navigation/Header.tsx
// ==========================================================

'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  User,
  LogIn,
  LogOut,
  Cloud,
  Menu,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-store';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { AuthModal } from '@/components/auth/AuthModal';
import { MemberCenterModal } from '@/components/auth/MemberCenterModal';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import { CalendarConversionEngine } from '@/lib/engines/calendar/calendar-engine';
import { getRealtimeDate } from '@/lib/utils/date-utils';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenAuth?: () => void;
  onOpenMemberCenter?: () => void;
}

export function Header({
  onOpenMobileMenu,
  onOpenAuth,
  onOpenMemberCenter,
}: HeaderProps) {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const { profile, updateProfile, isCloudSynced } = useUserProfile();

  const todayStr = React.useMemo(() => {
    const tz = profile?.timezone || 'Asia/Kuala_Lumpur';
    const dateStr = getRealtimeDate(tz);
    const [y, m, d] = dateStr.split('-');
    const fp = CalendarConversionEngine.getFourPillars(dateStr, '10:00:00', true);
    return `${y}年${Number(m)}月${Number(d)}日 · ${fp.yearStem}${fp.yearBranch}年 ${fp.monthStem}${fp.monthBranch}月 ${fp.dayStem}${fp.dayBranch}日`;
  }, [profile?.timezone]);

  // Internal modal fallback if not passed by parent
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [internalMemberCenterOpen, setInternalMemberCenterOpen] = useState(false);
  const [internalEditProfileOpen, setInternalEditProfileOpen] = useState(false);

  const handleAuthClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setInternalAuthOpen(true);
    }
  };

  const handleMemberCenterClick = () => {
    if (onOpenMemberCenter) {
      onOpenMemberCenter();
    } else {
      setInternalMemberCenterOpen(true);
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-gold-500/15 bg-obsidian-950/80 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Trigger + Brand/Date */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="打开菜单"
            className="lg:hidden p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
        )}

        {/* Mobile Brand Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center text-obsidian-950 font-serif font-bold text-xs shadow-gold-glow">
            紫
          </div>
          <span className="font-serif font-bold text-xs text-gold-100">
            紫微时空
          </span>
        </div>

        {/* Desktop Date & Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-mono tracking-wide">
            {todayStr}
          </span>
        </div>
        <Badge variant="gold" className="text-[10px] sm:text-[11px] font-serif hidden sm:inline-flex">
          天心正运 · 洛书归元
        </Badge>
      </div>

      {/* Right: Compliance Badges + Member System */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Compliance Pill (desktop only) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-900 border border-slate-800 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-gold-400" />
          <span>决策辅助 · 无保证中奖</span>
        </div>

        {/* 13% Share Pledge (tablet/desktop only) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-[11px] text-gold-champagne">
          <HeartHandshake className="w-3.5 h-3.5 text-gold-champagne" />
          <span>13%愿心</span>
        </div>

        {/* Member Auth Bar */}
        {loading ? (
          <div className="h-7 w-16 sm:w-20 bg-slate-800/60 animate-pulse rounded-xl" />
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-800">
            <button
              onClick={handleMemberCenterClick}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs text-gold-300 transition cursor-pointer"
              title="点击查看会员中心与命盘"
            >
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-medium max-w-[75px] sm:max-w-[90px] truncate">
                {profile.name || user.email?.split('@')[0]}
              </span>
              {isCloudSynced && (
                <span title="已与 Supabase 云端同步">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                </span>
              )}
            </button>
            <button
              onClick={() => signOut()}
              title="退出登录"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition text-xs flex items-center"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Button
            onClick={handleAuthClick}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-gold-500/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>会员登录</span>
          </Button>
        )}
      </div>

      {/* Fallback modals if AppShell is not used */}
      {!onOpenAuth && (
        <>
          <AuthModal
            isOpen={internalAuthOpen}
            onClose={() => setInternalAuthOpen(false)}
          />
          <MemberCenterModal
            isOpen={internalMemberCenterOpen}
            onClose={() => setInternalMemberCenterOpen(false)}
            onOpenEditProfile={() => setInternalEditProfileOpen(true)}
          />
          <EditProfileModal
            isOpen={internalEditProfileOpen}
            onClose={() => setInternalEditProfileOpen(false)}
            currentProfile={profile}
            onSave={(updated) => updateProfile(updated)}
          />
        </>
      )}
    </header>
  );
}
