// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Dream & Imagery Divination Modal
// File: components/prediction/DreamImageryDivinationModal.tsx
// ==========================================================

'use client';

import React, { useState } from 'react';
import {
  PlumBlossomImageryEngine,
  DreamDivinationResult,
} from '@/lib/literature/plum-blossom-imagery-engine';
import { SavedPredictionsStore } from '@/lib/prediction/saved-predictions-store';
import { RealitySignalStore } from '@/lib/signals/reality-signal-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Moon,
  Sparkles,
  Search,
  Star,
  Check,
  X,
  Camera,
  Car,
  FileText,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface DreamImageryDivinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNumber?: (num: string) => void;
}

const PRESET_CHIPS = [
  '梦见烈火与光明',
  '梦见巨龙飞天',
  '路上偶遇车祸',
  '梦到洪水大暴雨',
  '梦中捡到黄金首饰',
  '草丛看见巨蟒蛇',
  '参加热闹结婚喜宴',
  '高山古庙登顶',
];

export function DreamImageryDivinationModal({
  isOpen,
  onClose,
  onSelectNumber,
}: DreamImageryDivinationModalProps) {
  const [activeTab, setActiveTab] = useState<'DREAM' | 'PLATE'>('DREAM');
  const [dreamInput, setDreamInput] = useState<string>('梦见大火与金龙在天空盘旋');
  const [divinationResult, setDivinationResult] = useState<DreamDivinationResult | null>(() =>
    PlumBlossomImageryEngine.divinateFromImagery('梦见大火与金龙在天空盘旋')
  );

  // Plate OCR / Receipt input
  const [plateInput, setPlateInput] = useState<string>('WVP 8295 B');
  const [extractedPlate, setExtractedPlate] = useState<string | null>('8295');
  const [savedSuccessNum, setSavedSuccessNum] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDivinate = () => {
    if (!dreamInput.trim()) return;
    const res = PlumBlossomImageryEngine.divinateFromImagery(dreamInput);
    setDivinationResult(res);
  };

  const handleChipClick = (chip: string) => {
    setDreamInput(chip);
    const res = PlumBlossomImageryEngine.divinateFromImagery(chip);
    setDivinationResult(res);
  };

  const handlePlateParse = (val: string) => {
    setPlateInput(val);
    const res = PlumBlossomImageryEngine.parsePlateOrReceipt(val);
    setExtractedPlate(res.extracted4D);
  };

  const handleSaveFavorite = (num: string, title: string, score: number) => {
    SavedPredictionsStore.save({
      number: num,
      sourceType: 'DREAM_IMAGERY',
      sourceTitleZh: title,
      date: new Date().toISOString().slice(0, 10),
      score,
      notes: `起卦物象：${dreamInput.slice(0, 20)}`,
    });
    setSavedSuccessNum(num);
    setTimeout(() => setSavedSuccessNum(null), 2500);
  };

  const handleInjectRealitySignal = (num: string) => {
    RealitySignalStore.createSignal({
      signalType: 'VEHICLE_PLATE',
      rawValue: plateInput,
      direction: 'S',
      notes: `现实抓取车牌/单据号码【${num}】`,
    });
    handleSaveFavorite(num, '车牌与单据现实信号', 85);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-gold-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0E1322] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Moon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  现实信号与物象起卦 · 梅花易数推演
                </h3>
                <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[10px]">
                  万物类象
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                依据宋代邵康节《梅花易数》，将梦境、突发物象或车牌单据转化为确定性八卦与 4D 吉数
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#070A12] px-5 text-xs">
          <button
            onClick={() => setActiveTab('DREAM')}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'DREAM'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            梦境与物象感应起卦
          </button>
          <button
            onClick={() => setActiveTab('PLATE')}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'PLATE'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            车牌单据现实信号识别
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'DREAM' && (
            <>
              {/* Input Area */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  输入您昨晚的梦境、路遇奇特景象或灵感关键词：
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dreamInput}
                    onChange={(e) => setDreamInput(e.target.value)}
                    placeholder="例如：梦到大火、金龙、车祸、发大水、黄金、棺材..."
                    className="flex-1 bg-[#070A12] border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <Button
                    onClick={handleDivinate}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    起卦推衍
                  </Button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 mr-1">快捷类象:</span>
                  {PRESET_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divination Result Display */}
              {divinationResult && (
                <div className="p-4 rounded-xl bg-[#0E1322] border border-purple-500/30 space-y-4">
                  {/* Hexagram Head */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <div>
                      <span className="text-[10px] text-purple-400 uppercase tracking-widest block font-mono">
                        梅花象数起卦结论
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {divinationResult.hexagramName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-xs">
                        上卦【{divinationResult.matchedTrigrams.upper.name} · {divinationResult.matchedTrigrams.upper.elementZh}】
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-xs">
                        下卦【{divinationResult.matchedTrigrams.lower.name} · {divinationResult.matchedTrigrams.lower.elementZh}】
                      </Badge>
                      <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs font-mono">
                        动在第 {divinationResult.matchedTrigrams.movingLine} 爻
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#070A12]/60 p-3 rounded-lg border border-slate-800/80">
                    {divinationResult.guaSummary}
                  </p>

                  {/* Recommended 4D Numbers */}
                  <div>
                    <span className="text-xs font-bold text-white block mb-2">
                      依八卦象数与动爻演化之 4D 契合引数：
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {divinationResult.recommended4DNumbers.map((item, idx) => (
                        <div
                          key={item.number}
                          className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition"
                        >
                          <div>
                            <span className="text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-gold-300 to-amber-200 tracking-wider">
                              {item.number}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.derivationMethod}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                handleSaveFavorite(
                                  item.number,
                                  `梅花梦境起卦码 (${divinationResult.matchedTrigrams.upper.name}${divinationResult.matchedTrigrams.lower.name})`,
                                  item.score
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 text-gold-300 text-xs flex items-center gap-1 transition"
                            >
                              {savedSuccessNum === item.number ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">已收藏</span>
                                </>
                              ) : (
                                <>
                                  <Star className="w-3.5 h-3.5" />
                                  <span>收藏</span>
                                </>
                              )}
                            </button>

                            {onSelectNumber && (
                              <button
                                onClick={() => {
                                  onSelectNumber(item.number);
                                  onClose();
                                }}
                                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                                title="填入分析"
                              >
                                分析
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic pt-1">
                    {divinationResult.classicalQuote}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'PLATE' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  输入现实中观察到的车牌号、收据票据号或幸运尾号：
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={plateInput}
                    onChange={(e) => handlePlateParse(e.target.value)}
                    placeholder="例如：WVP 8295 B 或 订单号 #9821"
                    className="flex-1 bg-[#070A12] border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {extractedPlate ? (
                <div className="p-4 rounded-xl bg-[#0E1322] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-purple-400 uppercase tracking-widest block font-mono">
                      提纯 4D 现实信号
                    </span>
                    <div className="text-3xl font-mono font-black text-gold-300 mt-1">
                      {extractedPlate}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      成功从原始文字【{plateInput}】中识别出 4 位数字
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleInjectRealitySignal(extractedPlate)}
                      className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
                    >
                      <Star className="w-3.5 h-3.5" />
                      一键载入现实信号并收藏
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#070A12] border border-slate-800 text-center text-xs text-slate-500">
                  未能识别到有效的 4 位数字，请检查输入格式。
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070A12] border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>《易经》象数合一 · 现实信号仅供灵感启迪</span>
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 text-xs rounded-xl"
          >
            完成
          </Button>
        </div>
      </div>
    </div>
  );
}
