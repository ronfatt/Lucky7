'use client';

import React, { useState } from 'react';
import type { BirthProfile } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserCheck, Calendar, Sparkles, Clock, MapPin, RefreshCw, Edit3 } from 'lucide-react';
import { VisualZiWeiChart } from '@/components/destiny/VisualZiWeiChart';
import { PersonalDNAView } from '@/components/destiny/PersonalDNAView';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';

export default function DestinyPage() {
  const { profile, updateProfile, isReady } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const chart = ZiWeiEngine.generateChart(profile);
  const dna = PersonalNumberDNAEngine.generateDNA(profile);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onSave={(updated) => updateProfile(updated)}
      />

      {/* Top Banner */}
      <div className="p-7 rounded-2xl glass-panel border border-gold-500/25 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-850 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">Phase 2 · 本命数理中枢</Badge>
            <span className="text-xs text-slate-400 font-mono">ZW-TRADITIONAL-V1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-slate-100">
              我的命盘 · {profile.name} ({profile.gender === 'male' ? '乾造·男' : '坤造·女'})
            </h2>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>修改资料</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            生辰：{profile.birthDate} {profile.birthTime ? profile.birthTime : '（时辰未知）'} · 出生地：{profile.birthPlace || '未填写'} · 时区：{profile.timezone}
          </p>
        </div>

        {/* Edit Profile Quick Trigger */}
        <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-gold-500/30 flex items-center gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block">当前命盘状态:</span>
            <span className="text-xs font-mono font-bold text-gold-300">
              {profile.birthTimePrecision === 'UNKNOWN' ? '三柱分析 (时辰未知)' : '四柱俱全 (精确推演)'}
            </span>
          </div>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            修改命盘
          </Button>
        </div>
      </div>

      {/* 1. Four Pillars Card */}
      <Card className="border-gold-500/20">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              <Calendar className="w-4 h-4 text-gold-champagne" />
              生辰八字四柱干支 (Four Pillars)
            </CardTitle>
            <CardDescription>
              日主天干为核心立足点，透出天地五行生克气机
            </CardDescription>
          </div>
          <Badge variant="gold">日主: {fourPillars.dayMaster} ({fourPillars.dayMasterElement})</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">年柱 (Year)</span>
              <div className="text-xl font-serif font-bold text-slate-100">
                {fourPillars.yearStem}{fourPillars.yearBranch}
              </div>
              <span className="text-[10px] text-slate-400 block">{fourPillars.yearElement}</span>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">月柱 (Month)</span>
              <div className="text-xl font-serif font-bold text-slate-100">
                {fourPillars.monthStem}{fourPillars.monthBranch}
              </div>
              <span className="text-[10px] text-slate-400 block">{fourPillars.monthElement}</span>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-900 border border-gold-500/30 space-y-1">
              <span className="text-[11px] text-gold-400">日柱 (Day Master)</span>
              <div className="text-xl font-serif font-bold text-gold-champagne">
                {fourPillars.dayStem}{fourPillars.dayBranch}
              </div>
              <span className="text-[10px] text-gold-400 block">{fourPillars.dayElement} (元神)</span>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400">时柱 (Hour)</span>
              <div className="text-xl font-serif font-bold text-slate-100">
                {fourPillars.isHourKnown ? `${fourPillars.hourStem}${fourPillars.hourBranch}` : '未知'}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {fourPillars.isHourKnown ? fourPillars.hourElement : '不虚构时辰'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Visual Zi Wei Chart */}
      <VisualZiWeiChart chart={chart} />

      {/* 3. Personal Number DNA */}
      <PersonalDNAView dna={dna} />
    </div>
  );
}
