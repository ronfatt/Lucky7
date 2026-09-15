'use client';

import React, { useState, useMemo } from 'react';
import {
  extractNumberFeatures,
} from '@/lib/numerology/number-features';
import {
  ELEMENT_LABELS,
  DIRECTION_LABELS,
  getDigitElement,
  getDigitPolarity,
} from '@/lib/numerology/digit-foundation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Binary,
  Layers,
  Compass,
  Sparkles,
  Info,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { WuXingElement } from '@/types/zwtsp';

const PRESETS = ['5729', '7752', '5278', '7', '29', '381', '9405'];

// Luo Shu 3x3 layout order
const LUOSHU_LAYOUT = [
  { digit: 4, name: '巽四', dir: 'SE', el: 'Wood' as WuXingElement },
  { digit: 9, name: '离九', dir: 'S',  el: 'Fire' as WuXingElement },
  { digit: 2, name: '坤二', dir: 'SW', el: 'Earth' as WuXingElement },
  { digit: 3, name: '震三', dir: 'E',  el: 'Wood' as WuXingElement },
  { digit: 5, name: '中五', dir: 'Center', el: 'Earth' as WuXingElement },
  { digit: 7, name: '兑七', dir: 'W',  el: 'Metal' as WuXingElement },
  { digit: 8, name: '艮八', dir: 'NE', el: 'Earth' as WuXingElement },
  { digit: 1, name: '坎一', dir: 'N',  el: 'Water' as WuXingElement },
  { digit: 6, name: '乾六', dir: 'NW', el: 'Metal' as WuXingElement },
];

export function NumberLaboratory() {
  const [inputValue, setInputValue] = useState<string>('5729');

  const features = useMemo(() => {
    return extractNumberFeatures(inputValue);
  }, [inputValue]);

  const activeDigitSet = useMemo(() => {
    return new Set(features.rawDigits);
  }, [features.rawDigits]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setInputValue(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Philosophy */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-gold-500/20 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-850">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-champagne">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              时空数理实验室 · Number Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            支持 1-4 位及更多数字的五行归藏、阴阳分合、洛书九宫阵列与河图数理深度解析。
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">经典卦例:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputValue(preset)}
              className={`px-2.5 py-1 text-xs rounded-md font-mono border transition-all ${
                inputValue === preset
                  ? 'bg-gold-500/20 text-gold-champagne border-gold-500/50 shadow-gold-glow'
                  : 'bg-obsidian-800/80 text-slate-300 border-slate-700/60 hover:border-gold-500/30'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input Control Console */}
      <Card className="border-gold-500/25">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2 space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>输入任意数字或组合 (单数字 / 双数 / 3位 / 4位母码)</span>
                <span className="text-gold-champagne font-mono text-[11px]">
                  当前长度: {features.length} 位
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="如: 5729"
                  maxLength={10}
                  className="w-full bg-obsidian-950/90 border border-gold-500/30 rounded-xl px-5 py-3 text-2xl font-mono tracking-widest text-gold-champagne focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title="清空"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Visual Digit Badge Strips */}
            <div className="w-full md:w-1/2 flex flex-wrap gap-2.5 items-center justify-start md:justify-end">
              {features.rawDigits.map((d, idx) => {
                const el = getDigitElement(d);
                const pol = getDigitPolarity(d);
                const meta = ELEMENT_LABELS[el];
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-2.5 rounded-xl bg-obsidian-900 border border-white/10 shadow-sm min-w-[56px]"
                  >
                    <span className="text-xl font-mono font-bold text-slate-100">{d}</span>
                    <span className={`text-[10px] font-medium mt-0.5 ${meta.text}`}>
                      {meta.zh} · {pol === 'Yang' ? '阳' : '阴'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Analytical Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Luo Shu 3x3 Magic Square (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full border-gold-500/20">
            <CardHeader>
              <CardTitle>
                <Compass className="w-4 h-4 text-gold-champagne" />
                洛书九宫立体定位 (Luo Shu 9-Palaces)
              </CardTitle>
              <CardDescription>
                戴九履一，左三右七，二四为肩，六八为足，五居中央。高亮显示当前输入激活宫位。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
                {LUOSHU_LAYOUT.map((cell) => {
                  const isActive = activeDigitSet.has(cell.digit);
                  const count = features.repeatedDigits[cell.digit] || 0;
                  const elMeta = ELEMENT_LABELS[cell.el];

                  return (
                    <div
                      key={cell.digit}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 aspect-square ${
                        isActive
                          ? 'bg-gradient-to-br from-gold-500/25 via-obsidian-850 to-obsidian-900 border-gold-400 shadow-gold-glow scale-[1.02]'
                          : 'bg-obsidian-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isActive && count > 1 && (
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-mono font-bold">
                          ×{count}
                        </span>
                      )}
                      <span
                        className={`text-2xl font-mono font-bold ${
                          isActive ? 'text-gold-champagne' : 'text-slate-400'
                        }`}
                      >
                        {cell.digit}
                      </span>
                      <span className="text-[11px] font-medium text-slate-300 mt-1">
                        {cell.name}
                      </span>
                      <span className={`text-[10px] ${elMeta.text}`}>
                        {cell.dir} · {elMeta.zh}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Central 0 note */}
              {activeDigitSet.has(0) && (
                <div className="mt-4 p-2.5 rounded-lg bg-obsidian-900/80 border border-gold-500/20 text-center">
                  <Badge variant="gold" className="mr-2">
                    数字 0
                  </Badge>
                  <span className="text-xs text-slate-300">
                    玄牝归中 · 寄中宫土 (天五生土，地十成之，十化为零)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Mathematical & Metaphysical Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Statistical Properties */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Binary className="w-4 h-4 text-gold-champagne" />
                象数核心指标 (Structural Metrics)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">数字和 (Sum)</span>
                  <span className="text-xl font-mono font-bold text-slate-100">{features.digitSum}</span>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-gold-500/20">
                  <span className="text-[11px] text-gold-400 block">数字根 (Digital Root)</span>
                  <span className="text-xl font-mono font-bold text-gold-champagne">{features.digitalRoot}</span>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">阴阳比 (Yang/Yin)</span>
                  <span className="text-xl font-mono font-bold text-slate-100">
                    {features.oddCount}:{features.evenCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">高低比 (High/Low)</span>
                  <span className="text-xl font-mono font-bold text-slate-100">
                    {features.highCount}:{features.lowCount}
                  </span>
                </div>
              </div>

              {/* Extra Structure Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="outline">跨度 (Range): {features.range}</Badge>
                <Badge variant="outline">尾数 (Tail): {features.tailPattern}</Badge>
                <Badge variant="outline">连号数 (Consecutive): {features.consecutiveCount}</Badge>
                <Badge variant="outline">最大重号 (Max Repeat): {features.maxRepeatCount}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Five Elements Balance */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Layers className="w-4 h-4 text-gold-champagne" />
                五行生克配比 (Five Element Distribution)
              </CardTitle>
              <CardDescription>
                主导元素: <strong className="text-gold-champagne">{ELEMENT_LABELS[features.dominantElement].zh} ({features.dominantElement})</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as WuXingElement[]).map((el) => {
                const count = features.elementDistribution[el];
                const meta = ELEMENT_LABELS[el];
                const pct = features.length > 0 ? (count / features.length) * 100 : 0;

                return (
                  <div key={el} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        {meta.zh}行 ({el})
                      </span>
                      <span className="font-mono text-slate-400">
                        {count} 个 ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-obsidian-950 overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* He Tu Pairs Detection */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap className="w-4 h-4 text-gold-champagne" />
                河图合化扫描 (He Tu Harmonies)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {features.heTuPairsFound.length > 0 ? (
                <div className="space-y-2">
                  {features.heTuPairsFound.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-obsidian-900 border border-gold-500/20 flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-200 font-serif">{item.label}</span>
                      <Badge variant="gold">相生同气</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 p-4 rounded-lg bg-obsidian-950/60 border border-dashed border-slate-800 text-center">
                  当前输入组合中未出现成对的河图共宗数 (如 1/6, 2/7, 3/8, 4/9, 5/0)。
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
