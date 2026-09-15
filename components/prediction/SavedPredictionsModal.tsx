// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Saved Predictions & Auto Draw Checker Modal
// File: components/prediction/SavedPredictionsModal.tsx
// ==========================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  SavedPredictionsStore,
  SavedPredictionItem,
} from '@/lib/prediction/saved-predictions-store';
import { AutoDrawChecker, DrawCheckResult } from '@/lib/prediction/auto-draw-checker';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Star,
  Trophy,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  Copy,
  Check,
  Filter,
} from 'lucide-react';

interface SavedPredictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectNumber?: (num: string) => void;
}

export function SavedPredictionsModal({
  isOpen,
  onClose,
  onInspectNumber,
}: SavedPredictionsModalProps) {
  const [items, setItems] = useState<SavedPredictionItem[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'HITS_ONLY' | 'PENDING'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    setItems(SavedPredictionsStore.getAll());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('zwtsp_favorites_updated', handleUpdate);
    return () => window.removeEventListener('zwtsp_favorites_updated', handleUpdate);
  }, []);

  const checkResults = useMemo(() => {
    return AutoDrawChecker.checkAll(items);
  }, [items]);

  const filteredResults = useMemo(() => {
    if (filterType === 'HITS_ONLY') {
      return checkResults.filter((r) => r.hasHit);
    }
    if (filterType === 'PENDING') {
      return checkResults.filter((r) => !r.hasHit);
    }
    return checkResults;
  }, [checkResults, filterType]);

  const totalHitsCount = checkResults.filter((r) => r.hasHit).length;

  const handleCopy = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    SavedPredictionsStore.remove(id);
    loadData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-gold-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0E1322] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Star className="w-5 h-5 fill-gold-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  我的心水收藏 · 开奖自动核对中心
                </h3>
                <Badge variant="outline" className="border-gold-500/40 text-gold-300 text-[10px]">
                  共收藏 {items.length} 组
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                记录您在历次时空推演中珍藏的心水号码，并全天候自动比对新马 7 大博彩平台开奖结果
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

        {/* Filter Bar & Quick Stats */}
        <div className="px-5 py-3 bg-[#070A12] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> 状态筛选:
            </span>
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filterType === 'ALL'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              全部 ({checkResults.length})
            </button>
            <button
              onClick={() => setFilterType('HITS_ONLY')}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filterType === 'HITS_ONLY'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎉 已命中奖项 ({totalHitsCount})
            </button>
            <button
              onClick={() => setFilterType('PENDING')}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filterType === 'PENDING'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⏳ 蓄势储备 ({checkResults.length - totalHitsCount})
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            支持正字直落与全打组选多维度命中核验
          </div>
        </div>

        {/* List Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
          {filteredResults.length > 0 ? (
            filteredResults.map((res) => {
              const { item } = res;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    res.hasHit
                      ? 'bg-gradient-to-r from-[#121A2A] to-[#0A0E17] border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-[#070A12]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Number & Origin Info */}
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[90px]">
                      <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200 tracking-wider">
                        {item.number}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        指数: {item.score}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                          {item.sourceTitleZh}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-mono">
                          推演日: {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{item.notes || '时空数理综合共振推演'}</p>
                    </div>
                  </div>

                  {/* Middle: Hit Verification Verdict */}
                  <div className="flex-1 md:text-right space-y-1">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${res.badgeColor}`}
                      >
                        {res.highestTierZh}
                      </span>
                    </div>
                    {res.hasHit && res.recentHits[0] && (
                      <p className="text-[11px] text-slate-400">
                        最近开出：{res.recentHits[0].drawDate} · {res.recentHits[0].operatorNameZh} (
                        {res.recentHits[0].tierName})
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleCopy(item.number, item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                      title="复制号码"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </>
                      )}
                    </button>

                    {onInspectNumber && (
                      <button
                        onClick={() => {
                          onInspectNumber(item.number);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 text-gold-300 text-xs flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>研判历史</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                      title="移出收藏"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Star className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">暂无符合条件的收藏记录</p>
              <span className="text-xs text-slate-600 block">
                在今日推演的母码或候选号码卡片上点击「⭐ 收藏」，即可加入心水库！
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070A12] border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>系统每日开奖后自动刷新核对状态 · 理性娱乐请勿沉迷</span>
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 text-xs rounded-xl"
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
