'use client';

import React, { useState, useMemo } from 'react';
import type { ClassicalLiterature, LiteratureLineage, PlumBlossomTrigramMapping, FlyingStarSiHuaPattern } from '@/types/zwtsp';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  BookMarked,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  Compass,
  FileText,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Flame,
} from 'lucide-react';
import { LiteratureProvider, CLASSICAL_CANON_LIST } from '@/lib/literature/literature-provider';
import { PlumBlossomEngine, EARLY_HEAVEN_TRIGRAMS } from '@/lib/literature/plum-blossom-engine';
import { FlyingStarSiHuaEngine } from '@/lib/literature/flying-star-sihua-engine';

export function LiteratureBrowserView() {
  const [selectedLineage, setSelectedLineage] = useState<LiteratureLineage | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLiterature, setActiveLiterature] = useState<ClassicalLiterature | null>(null);
  const [testNumber, setTestNumber] = useState<string>('5729');
  const [activeTab, setActiveTab] = useState<'CANON' | 'PLUM_BLOSSOM' | 'FLYING_STAR'>('CANON');

  // Filtered literature
  const filteredLiterature = useMemo(() => {
    let list = LiteratureProvider.searchLiterature(searchQuery);
    if (selectedLineage !== 'ALL') {
      list = list.filter((l) => l.lineage === selectedLineage);
    }
    return list;
  }, [searchQuery, selectedLineage]);

  // Plum Blossom body/use interactive calculation
  const plumAnalysis = useMemo(() => {
    return PlumBlossomEngine.analyzeNumber(testNumber);
  }, [testNumber]);

  // Flying Star patterns
  const flyingStarPatterns = useMemo(() => {
    return FlyingStarSiHuaEngine.getAllPatterns();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0F1422] via-[#0C1019] to-[#070A12] border border-gold-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
                <BookMarked className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-wide">
                易理象数典籍文库
              </h1>
              <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-xs">
                Metaphysics Canon Library
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              汇聚钦天门华山派、象数心学派、飞星四化派、梅花易数体用学等 6 部古典文献与名师讲义，
              为系统「时·位·象·数·行·验」确立严谨学术基石与数理古训溯源。
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#070A12] p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('CANON')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'CANON'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              典籍全文藏经 ({CLASSICAL_CANON_LIST.length}部)
            </button>
            <button
              onClick={() => setActiveTab('PLUM_BLOSSOM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'PLUM_BLOSSOM'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              梅花易数体用数理
            </button>
            <button
              onClick={() => setActiveTab('FLYING_STAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'FLYING_STAR'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              飞星四化 576 象意
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CANON LITERATURE LIST */}
      {activeTab === 'CANON' && (
        <div className="space-y-6">
          {/* Search & Lineage Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0B0F19]/90 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索典籍名、著者、章节或核心理论 (如 自化、河洛十五数)..."
                className="w-full bg-[#070A12] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedLineage('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'ALL'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                全部派系
              </button>
              <button
                onClick={() => setSelectedLineage('XIANG_SHU')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'XIANG_SHU'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                象数心学派
              </button>
              <button
                onClick={() => setSelectedLineage('QIN_TIAN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'QIN_TIAN'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                钦天门华山派
              </button>
              <button
                onClick={() => setSelectedLineage('FEI_XING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'FEI_XING'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                飞星四化派
              </button>
              <button
                onClick={() => setSelectedLineage('MEI_HUA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'MEI_HUA'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                梅花易数体用学
              </button>
              <button
                onClick={() => setSelectedLineage('LI_QI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedLineage === 'LI_QI'
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                飞宫理气派
              </button>
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLiterature.map((lit) => (
              <Card
                key={lit.id}
                className="bg-[#0B0F19]/90 border-slate-800 hover:border-gold-500/40 transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Top Lineage Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={
                        lit.lineage === 'XIANG_SHU'
                          ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20 text-[10px]'
                          : lit.lineage === 'QIN_TIAN'
                          ? 'border-gold-500/40 text-gold-300 bg-gold-950/20 text-[10px]'
                          : lit.lineage === 'FEI_XING'
                          ? 'border-blue-500/40 text-blue-300 bg-blue-950/20 text-[10px]'
                          : lit.lineage === 'MEI_HUA'
                          ? 'border-purple-500/40 text-purple-300 bg-purple-950/20 text-[10px]'
                          : 'border-amber-500/40 text-amber-300 bg-amber-950/20 text-[10px]'
                      }
                    >
                      {lit.lineageName}
                    </Badge>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {lit.pageCount} 页 · 权威藏本
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                      《{lit.title}》
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">著者 / 传人：{lit.author}</p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-[#070A12]/60 p-3 rounded-xl border border-slate-800/80">
                    {lit.summary}
                  </p>

                  {/* Core Theory Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      核心易理体系:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lit.coreTheories.slice(0, 3).map((theory, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                        >
                          {theory.length > 18 ? theory.slice(0, 18) + '...' : theory}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="px-5 py-3 border-t border-slate-800/80 bg-[#070A12]/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                    {lit.fileName}
                  </span>
                  <Button
                    onClick={() => setActiveLiterature(lit)}
                    className="bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <span>研读章目</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: PLUM BLOSSOM TRIGRAM ENGINE */}
      {activeTab === 'PLUM_BLOSSOM' && (
        <div className="space-y-6">
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-gold-400" />
                  邵雍梅花易数 · 先天八卦数与体用生克计算台
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  依据宋代邵康节《梅花易数》正传与李科儒注本，将四位数字转归上卦为体、下卦为用，推算天地五行生克局势。
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#070A12] p-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 whitespace-nowrap">测试号码:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-24 bg-transparent border border-gold-500/30 rounded-lg px-2 py-1 text-gold-300 font-mono font-bold text-center text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Eight Trigram Cards Reference */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                先天八卦数位阶字典 (Early Heaven Trigrams 1-8):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
                {Object.values(EARLY_HEAVEN_TRIGRAMS).map((tri) => (
                  <div
                    key={tri.digit}
                    className="p-3 rounded-xl bg-[#070A12] border border-slate-800 hover:border-gold-500/30 transition"
                  >
                    <span className="text-xl font-bold font-serif text-gold-300">{tri.trigramZh}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {tri.digit} · {tri.nature}
                    </span>
                    <Badge variant="outline" className="mt-2 text-[10px] border-slate-700 text-slate-300">
                      {tri.element}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Analysis for Current Number */}
            <div className="p-5 rounded-xl bg-[#070A12] border border-gold-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold font-mono text-gold-400 tracking-wider">
                    {plumAnalysis.numberStr}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      上卦体【{plumAnalysis.tiTrigram.trigramZh}为{plumAnalysis.tiTrigram.nature}】/ 下卦用【{plumAnalysis.yongTrigram.trigramZh}为{plumAnalysis.yongTrigram.nature}】
                    </div>
                    <span className="text-xs text-slate-400">
                      体属性：{plumAnalysis.tiTrigram.element} · 用属性：{plumAnalysis.yongTrigram.element}
                    </span>
                  </div>
                </div>

                <Badge
                  className={
                    plumAnalysis.relation === 'YONG_SHENG_TI'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-3 py-1'
                      : plumAnalysis.relation === 'BI_HE'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs px-3 py-1'
                      : plumAnalysis.relation === 'TI_KE_YONG'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs px-3 py-1'
                      : 'bg-red-500/20 text-red-300 border-red-500/40 text-xs px-3 py-1'
                  }
                >
                  {plumAnalysis.relationZh}
                </Badge>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-[#0B0F19] p-3.5 rounded-lg border border-slate-800">
                {plumAnalysis.canonicalCitation}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 3: FLYING STAR SI HUA 576 PATTERNS */}
      {activeTab === 'FLYING_STAR' && (
        <div className="space-y-6">
          <Card className="bg-[#0B0F19]/90 border-slate-800 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold-400" />
                飞星紫微斗数 · 十二宫五百七十六象飞化释义
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                依据《飞星紫微斗数十二宫六七二象》与蔡明宏华山钦天四化理论，展示宫位互飞的断语与数理意涵。
              </p>
            </div>

            <div className="space-y-3">
              {flyingStarPatterns.map((pat) => (
                <div
                  key={pat.id}
                  className="p-4 rounded-xl bg-[#070A12] border border-slate-800 hover:border-gold-500/30 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{pat.fromPalace}</span>
                      <span className="text-slate-500">飞</span>
                      <Badge
                        variant="outline"
                        className={
                          pat.siHuaType === 'LU'
                            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20'
                            : pat.siHuaType === 'QUAN'
                            ? 'border-amber-500/40 text-amber-300 bg-amber-950/20'
                            : pat.siHuaType === 'KE'
                            ? 'border-blue-500/40 text-blue-300 bg-blue-950/20'
                            : 'border-purple-500/40 text-purple-300 bg-purple-950/20'
                        }
                      >
                        {pat.siHuaName}
                      </Badge>
                      <span className="text-slate-500">入</span>
                      <span className="font-bold text-gold-400 text-sm">{pat.toPalace}</span>
                    </div>
                    <p className="text-slate-300">{pat.canonicalMeaning}</p>
                    <p className="text-[11px] text-slate-500">{pat.numberImplication}</p>
                  </div>

                  <div className="text-right text-[11px] text-slate-500 font-serif shrink-0">
                    {pat.sourceLiterature}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Literature Chapter Reader Modal */}
      {activeLiterature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0c1017] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gold-500/20 bg-[#121824] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">《{activeLiterature.title}》</h2>
                <span className="text-xs text-slate-400">著者：{activeLiterature.author} · 派系：{activeLiterature.lineageName}</span>
              </div>
              <button
                onClick={() => setActiveLiterature(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
              <div className="p-4 rounded-xl bg-[#111726] border border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-gold-400 block uppercase">原典总论与微言大义:</span>
                <p className="leading-relaxed text-slate-300">{activeLiterature.summary}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gold-400" />
                  精选重点章节研读大纲 ({activeLiterature.chapters.length} 篇)
                </h3>

                <div className="space-y-3">
                  {activeLiterature.chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="p-4 rounded-xl bg-[#0a0f19] border border-slate-800/80 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gold-300 text-sm">{ch.title}</h4>
                        <span className="text-[10px] text-slate-500">第 {ch.chapterNumber} 讲</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{ch.summary}</p>

                      {ch.keyQuotes.length > 0 && (
                        <div className="p-3 rounded-lg bg-[#070A12] border-l-2 border-gold-500 text-[11px] text-amber-200/90 italic">
                          {ch.keyQuotes[0]}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {ch.keywords.map((kw, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gold-500/20 bg-[#121824] flex justify-end">
              <Button
                onClick={() => setActiveLiterature(null)}
                className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs px-4 py-1.5 rounded-lg"
              >
                完成研读
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
