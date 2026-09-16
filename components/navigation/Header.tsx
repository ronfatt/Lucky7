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
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-store';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { AuthModal } from '@/components/auth/AuthModal';
import { MemberCenterModal } from '@/components/auth/MemberCenterModal';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';

export function Header() {
  const todayStr = '2026年9月13日 · 丙午年 丁酉月 辛未日';
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const { profile, updateProfile, isCloudSynced } = useUserProfile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMemberCenterOpen, setIsMemberCenterOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-gold-500/15 bg-obsidian-950/60 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-mono tracking-wide hidden md:inline">{todayStr}</span>
        </div>
        <Badge variant="gold" className="text-[11px] font-serif">
          天心正运 · 洛书归元
        </Badge>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Compliance / Non-gambling pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-900 border border-slate-800 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-gold-400" />
          <span>决策辅助 · 无保证中奖</span>
        </div>

        {/* 13% Share Pledge Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-[11px] text-gold-champagne">
          <HeartHandshake className="w-3.5 h-3.5 text-gold-champagne" />
          <span>13%分享愿</span>
        </div>

        {/* Member Auth Bar */}
        {loading ? (
          <div className="h-7 w-20 bg-slate-800/60 animate-pulse rounded-xl" />
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={() => setIsMemberCenterOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs text-gold-300 transition cursor-pointer"
              title="点击查看会员中心与命盘"
            >
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-medium max-w-[90px] truncate">{profile.name || user.email?.split('@')[0]}</span>
              {isCloudSynced && (
                <span title="已与 Supabase 云端同步">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                </span>
              )}
            </button>
            <button
              onClick={() => signOut()}
              title="退出登录"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition text-xs flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-gold-500/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>会员登录</span>
          </Button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <MemberCenterModal
        isOpen={isMemberCenterOpen}
        onClose={() => setIsMemberCenterOpen(false)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentProfile={profile}
        onSave={(updated) => updateProfile(updated)}
      />
    </header>
  );
}
