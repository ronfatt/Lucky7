'use client';

import React, { useState, useMemo } from 'react';
import type { BirthProfile } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sliders, FlaskConical, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { RealitySignalStore } from '@/lib/signals/reality-signal-store';
import { DigitFeatureVectorEngine } from '@/lib/synthesis/digit-feature-vector-engine';
import { CandidateGenerationEngine } from '@/lib/synthesis/candidate-generation-engine';
import { MotherCodeEngine } from '@/lib/synthesis/mother-code-engine';
import { getRealtimeDate } from '@/lib/utils/date-utils';

export default function AdminModelLabPage() {
  const [activeTab, setActiveTab] = useState<'FULL' | 'DNA_ONLY' | 'DAILY_ONLY' | 'REALITY_ONLY'>('FULL');
  const [testDate, setTestDate] = useState<string>(() => getRealtimeDate());

  const profile: BirthProfile = {
    name: '李知命 (实验档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };

  const fourPillars = useMemo(() => FourPillarsEngine.calculateFourPillars(profile), [profile]);
  const ziweiChart = useMemo(() => ZiWeiEngine.generateChart(profile), [profile]);
  const personalDNA = useMemo(() => PersonalNumberDNAEngine.generateDNA(profile), [profile]);

  const dailySig = useMemo(() => DailyEngine.generateDailySignature(testDate), [testDate]);
  const activePalaces = useMemo(() => DailyEngine.activatePalaces(ziweiChart, dailySig), [ziweiChart, dailySig]);
  const activeNumbers = useMemo(() => DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig), [personalDNA, activePalaces, dailySig]);

  const personalDirections = useMemo(() => {
    return PersonalDirectionEngine.calculatePersonalDirections(fourPillars, ziweiChart, personalDNA);
  }, [fourPillars, ziweiChart, personalDNA]);

  const dailyDirection = useMemo(() => {
    return DailyDirectionEngine.calculateDailyDirections(
      testDate,
      personalDirections,
      dailySig,
      activeNumbers,
      activePalaces
    );
  }, [testDate, personalDirections, dailySig, activeNumbers, activePalaces]);

  const realitySignals = useMemo(() => RealitySignalStore.getSignals(), []);

  // Compute based on activeTab
  const simulatedVectors = useMemo(() => {
    if (activeTab === 'DNA_ONLY') {
      return DigitFeatureVectorEngine.computeVectors(
        personalDNA,
        [],
        undefined,
        [],
        dailySig.dominantElement
      );
    }
    if (activeTab === 'DAILY_ONLY') {
      // Empty personal DNA fallback
      const emptyDna = { ...personalDNA, coreNumbers: [], scoresByDigit: {} };
      return DigitFeatureVectorEngine.computeVectors(
        emptyDna,
        activeNumbers,
        undefined,
        [],
        dailySig.dominantElement
      );
    }
    if (activeTab === 'REALITY_ONLY') {
      const emptyDna = { ...personalDNA, coreNumbers: [], scoresByDigit: {} };
      return DigitFeatureVectorEngine.computeVectors(
        emptyDna,
        [],
        undefined,
        realitySignals,
        dailySig.dominantElement
      );
    }
    return DigitFeatureVectorEngine.computeVectors(
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      dailySig.dominantElement
    );
  }, [activeTab, personalDNA, activeNumbers, dailyDirection, realitySignals, dailySig]);

  const candidates = useMemo(() => {
    return CandidateGenerationEngine.generateCandidates(
      simulatedVectors,
      personalDNA,
      activeNumbers,
      dailyDirection,
      realitySignals,
      10
    );
  }, [simulatedVectors, personalDNA, activeNumbers, dailyDirection, realitySignals]);

  const motherCode = useMemo(() => {
    return MotherCodeEngine.extractMotherCode(candidates);
  }, [candidates]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1420]/90 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              模型实验实验室 · Model Lab
            </h1>
            <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
              Feature Simulation Bench
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            动态模拟各要素剥离状态下的候选生成与母码漂移，对比各层特征对最终输出的影响权重。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="bg-[#070A12] border border-slate-800 text-xs text-gold-300 px-3 py-2 rounded-xl"
          />
        </div>
      </div>

      {/* Model Mode Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('FULL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'FULL'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow'
              : 'bg-[#0B0F19] text-slate-400 border border-slate-800'
          }`}
        >
          完整全要素模型 (Full Model)
        </button>
        <button
          onClick={() => setActiveTab('DNA_ONLY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'DNA_ONLY'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow'
              : 'bg-[#0B0F19] text-slate-400 border border-slate-800'
          }`}
        >
          仅本命数字 DNA (DNA Only)
        </button>
        <button
          onClick={() => setActiveTab('DAILY_ONLY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'DAILY_ONLY'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow'
              : 'bg-[#0B0F19] text-slate-400 border border-slate-800'
          }`}
        >
          仅流日干支时空 (Daily Only)
        </button>
        <button
          onClick={() => setActiveTab('REALITY_ONLY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'REALITY_ONLY'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow'
              : 'bg-[#0B0F19] text-slate-400 border border-slate-800'
          }`}
        >
          仅现实信号共振 (Reality Only)
        </button>
      </div>

      {/* Simulation Result Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 bg-[#0B0F19]/90 border-slate-800 p-6">
          <div className="text-xs text-slate-400 mb-1">当前模拟设定母码 (Simulated Mother Code)</div>
          <div className="text-5xl font-mono font-black text-gold-300 tracking-widest my-2">
            {motherCode.motherCode}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            得分: <strong className="text-white">{motherCode.score.toFixed(1)}分</strong> · 评级 {motherCode.confidence}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#070A12] border border-slate-800 text-xs text-slate-400 leading-relaxed">
            {motherCode.summary}
          </div>
        </Card>

        <Card className="lg:col-span-7 bg-[#0B0F19]/90 border-slate-800 p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-400" />
              该模式下生成的 Top 10 候选
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {candidates.map((c) => (
              <div
                key={c.number}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#070A12] border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-[10px]">
                    #{c.rank}
                  </span>
                  <strong className="text-white font-mono text-sm tracking-wider">{c.number}</strong>
                  <span className="text-slate-500 text-[10px]">{c.generationMethod}</span>
                </div>
                <div className="font-mono font-bold text-gold-300">{c.score.toFixed(1)}分</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
