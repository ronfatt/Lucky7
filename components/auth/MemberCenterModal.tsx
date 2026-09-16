// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Member Center Modal
// File: components/auth/MemberCenterModal.tsx
// ==========================================================

'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/lib/auth/auth-store';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Cloud,
  LogOut,
  X,
  Sparkles,
  Edit3,
} from 'lucide-react';

interface MemberCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
}

export function MemberCenterModal({
  isOpen,
  onClose,
  onOpenEditProfile,
}: MemberCenterModalProps) {
  const { user, signOut } = useAuth();
  const { profile, isCloudSynced } = useUserProfile();

  const fourPillars = useMemo(() => {
    try {
      return FourPillarsEngine.calculateFourPillars(profile);
    } catch {
      return null;
    }
  }, [profile]);

  const ziweiChart = useMemo(() => {
    try {
      return ZiWeiEngine.generateChart(profile);
    } catch {
      return null;
    }
  }, [profile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-gold-500/30 p-6 shadow-2xl shadow-gold-500/10 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-champagne">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-gold-100">
                  会员中心 · 个人命盘
                </h3>
                <Badge variant="gold" className="text-[10px]">
                  天心尊享会员
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                紫微斗数与时空数理专属身份档案
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Bar */}
        <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-slate-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-xs">
            <Mail className="w-4 h-4 text-gold-400" />
            <div>
              <div className="text-slate-200 font-medium">{user?.email || '已连接账号'}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                UID: {user?.id ? `${user.id.slice(0, 12)}...` : '本地访客'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-400">
            <Cloud className="w-3.5 h-3.5" />
            <span>{isCloudSynced ? '云端已同步' : '本地暂存'}</span>
          </div>
        </div>

        {/* Destiny Chart Summary Card */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-serif text-gold-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              当前命主本命盘设置
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenEditProfile();
              }}
              className="text-gold-400 hover:text-gold-300 text-xs flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3 h-3" />
              <span>修改命盘资料</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-950/60 border border-gold-500/20 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">姓名称谓:</span>
                <span className="text-slate-200 font-bold">{profile.name}</span>
                <span className="text-slate-500 text-[10px]">
                  ({profile.gender === 'male' ? '乾造·男' : '坤造·女'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">阳历生日:</span>
                <span className="text-slate-200 font-mono">{profile.birthDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">生辰时辰:</span>
                <span className="text-slate-200 font-mono">
                  {profile.birthTime || '吉时 (未详)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">出生地域:</span>
                <span className="text-slate-200 truncate">{profile.birthPlace}</span>
              </div>
            </div>

            {/* Four Pillars Pills */}
            {fourPillars && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1.5">四柱八字乾坤：</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-1.5 rounded-lg bg-obsidian-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">年柱</div>
                    <div className="text-xs font-bold text-gold-champagne">
                      {fourPillars.yearStem}{fourPillars.yearBranch}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-obsidian-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">月柱</div>
                    <div className="text-xs font-bold text-gold-champagne">
                      {fourPillars.monthStem}{fourPillars.monthBranch}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-obsidian-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">日柱(命主)</div>
                    <div className="text-xs font-bold text-emerald-400">
                      {fourPillars.dayStem}{fourPillars.dayBranch}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-obsidian-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">时柱</div>
                    <div className="text-xs font-bold text-gold-champagne">
                      {fourPillars.hourStem ? `${fourPillars.hourStem}${fourPillars.hourBranch}` : '吉时'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ZiWei summary */}
            {ziweiChart && (
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                <span>
                  命宫所落：<strong className="text-slate-200">{ziweiChart.lifePalaceBranch || '寅'}位</strong>
                </span>
                <span>
                  五行局：<strong className="text-gold-300">{ziweiChart.bureau || '水二局'}</strong>
                </span>
                <span>
                  身宫：<strong className="text-slate-200">{ziweiChart.bodyPalaceBranch || '午'}位</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onOpenEditProfile();
            }}
            className="flex items-center gap-1.5 text-xs text-gold-champagne border-gold-500/30 hover:bg-gold-500/10"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>重新录入命盘</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              signOut();
              onClose();
            }}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>安全退出</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
