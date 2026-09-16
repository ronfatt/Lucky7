'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sliders, Search, ShieldCheck, Activity, FileText } from 'lucide-react';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import type { BirthProfile } from '@/types/zwtsp';
import { CalculationTraceModal } from '@/components/daily/CalculationTraceModal';
import { getRealtimeDate } from '@/lib/utils/date-utils';

export default function AdminDailyDebuggerPage() {
  const [testTimezone, setTestTimezone] = useState<string>('Asia/Shanghai');
  const [testDate, setTestDate] = useState<string>(() => getRealtimeDate(testTimezone));
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

  const profile: BirthProfile = {
    name: '李知命 (调试沙盒)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: testTimezone,
    calendarType: 'gregorian',
  };

  const dna = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);
  const chart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const dailySig = useMemo(() => DailyEngine.generateDailySignature(testDate, testTimezone), [testDate, testTimezone]);
  const activePalaces = useMemo(() => DailyEngine.activatePalaces(chart, dailySig), [chart, dailySig]);
  const activatedNumbers = useMemo(() => DailyEngine.activateNumbers(dna, activePalaces, dailySig), [dna, activePalaces, dailySig]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel border border-red-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-red-950/60 text-red-400">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              时空数理全链路调试台 (Admin Daily Debugger)
            </h2>
            <p className="text-xs text-slate-400">
              对任意指定日期与时区执行全量排盘、节气定位、五行场能与全数字 0-9 激活溯源验算
            </p>
          </div>
        </div>
        <Badge variant="danger">管理员工程模式</Badge>
      </div>

      {/* Control inputs */}
      <Card className="border-white/10">
        <CardContent className="p-5 flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">推演日期 (YYYY-MM-DD)</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="bg-obsidian-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">计算时区</label>
            <select
              value={testTimezone}
              onChange={(e) => setTestTimezone(e.target.value)}
              className="bg-obsidian-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            >
              <option value="Asia/Shanghai">Asia/Shanghai (CST +08:00)</option>
              <option value="UTC">UTC (+00:00)</option>
              <option value="America/New_York">America/New_York (EST -05:00)</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2 pt-4">
            <Badge variant="gold">
              节气: {dailySig.solarTerm.currentTerm} ({dailySig.solarTerm.seasonZh})
            </Badge>
            <Badge variant="success">
              干支: {dailySig.yearStemBranch} {dailySig.monthStemBranch} {dailySig.dayStemBranch}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 0-9 Trace Table */}
      <Card className="border-gold-500/20">
        <CardHeader>
          <CardTitle>数字激活溯源明细 (0-9 Digits Calculation Trace)</CardTitle>
          <CardDescription>
            Input → Rule → Feature → Score → Final Activation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-white/5 font-serif">
                <tr>
                  <th className="py-2.5 px-3">数字</th>
                  <th className="py-2.5 px-3">本命基准 (35%)</th>
                  <th className="py-2.5 px-3">今日五行 (25%)</th>
                  <th className="py-2.5 px-3">时律共振 (15%)</th>
                  <th className="py-2.5 px-3">活跃宫位 (15%)</th>
                  <th className="py-2.5 px-3">星曜四化 (10%)</th>
                  <th className="py-2.5 px-3">最终激活分</th>
                  <th className="py-2.5 px-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {activatedNumbers.map((act) => (
                  <tr key={act.digit} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-bold text-base text-gold-champagne">{act.digit}</td>
                    <td className="py-2.5 px-3">{act.personalBaseScore}</td>
                    <td className="py-2.5 px-3">{act.elementScore}</td>
                    <td className="py-2.5 px-3">{act.timeScore}</td>
                    <td className="py-2.5 px-3">{act.palaceScore}</td>
                    <td className="py-2.5 px-3">{act.starScore}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{act.activationScore}</td>
                    <td className="py-2.5 px-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDigit(act.digit)}
                        className="text-[10px] py-0.5 px-2"
                      >
                        <FileText className="w-3 h-3 mr-1" /> 查看分步
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedDigit !== null && (
        <CalculationTraceModal
          trace={{
            digit: selectedDigit,
            element: 'Fire',
            polarity: 'Yang',
            steps: activatedNumbers.find(a => a.digit === selectedDigit)?.trace || [],
            finalScore: activatedNumbers.find(a => a.digit === selectedDigit)?.activationScore || 0,
            classification: 'Primary',
          }}
          onClose={() => setSelectedDigit(null)}
        />
      )}
    </div>
  );
}
