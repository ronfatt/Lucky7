// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Metaphysical Poster Export Modal
// File: components/prediction/MetaphysicalPosterModal.tsx
// Renders luxury Oriental Black-Gold aesthetic card via HTML5 Canvas
// ==========================================================

'use client';

import React, { useRef, useEffect, useState } from 'react';
import type {
  BirthProfile,
  MotherCodeResult,
  VariationCodeRecord,
} from '@/types/zwtsp';
import type { WindfallWealthAnalysis } from '@/lib/engines/daily/windfall-wealth-engine';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Share2,
} from 'lucide-react';

interface MetaphysicalPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BirthProfile;
  dateStr: string;
  motherCode: MotherCodeResult;
  variations: VariationCodeRecord[];
  windfallAnalysis: WindfallWealthAnalysis;
}

export function MetaphysicalPosterModal({
  isOpen,
  onClose,
  profile,
  dateStr,
  motherCode,
  variations,
  windfallAnalysis,
}: MetaphysicalPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina 2x scale
    const width = 600;
    const height = 920;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0E1322');
    bgGrad.addColorStop(0.5, '#070A12');
    bgGrad.addColorStop(1, '#05070D');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Borders & Golden Accents
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 0);
      ctx.lineTo(0, 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    drawCorner(26, 26, 0);
    drawCorner(width - 26, 26, 90);
    drawCorner(width - 26, height - 26, 180);
    drawCorner(26, height - 26, 270);

    // 3. Header: Title & Subtitle
    ctx.fillStyle = '#E5C07B';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('紫微时空数字预测系统 · ZWTSP V1.0', width / 2, 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('今日时空数理运势典藏卡', width / 2, 95);

    // Date & Stem
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`岁次丙午年 · 农历八月初三 · 流日 ${dateStr}`, width / 2, 122);

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.moveTo(60, 140);
    ctx.lineTo(width - 60, 140);
    ctx.stroke();

    // 4. User Natal Profile Badge
    ctx.fillStyle = '#111827';
    ctx.roundRect?.(60, 155, width - 120, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`命主：${profile.name} (${profile.gender === 'male' ? '乾造·男' : '坤造·女'})`, 80, 184);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`生辰：${profile.birthDate}`, width - 80, 184);

    // 5. Hero: Mother Code Box
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 11px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('—— 本期核心推演母码 (PRIMARY SEQUENCE) ——', width / 2, 240);

    // Giant Mother Code
    const goldGrad = ctx.createLinearGradient(0, 260, 0, 340);
    goldGrad.addColorStop(0, '#FFE899');
    goldGrad.addColorStop(0.5, '#F59E0B');
    goldGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = goldGrad;
    ctx.font = '900 68px monospace';
    ctx.letterSpacing = '12px';
    ctx.fillText(motherCode.motherCode, width / 2, 325);

    // Confidence & Score
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`综合数理指数：${motherCode.score.toFixed(1)} 分  |  置信度：${motherCode.confidence}`, width / 2, 360);

    // 6. Top 3 Variation Codes
    ctx.fillStyle = '#1E293B';
    ctx.roundRect?.(50, 385, width - 100, 125, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('核心变异码与衍生形态：', 70, 412);

    const topVars = variations.slice(0, 3);
    topVars.forEach((v, idx) => {
      const yPos = 445 + idx * 24;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`【变位 ${idx + 1}】 ${v.resultNumber}`, 70, yPos);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`(${v.explanation || v.variationType})`, 210, yPos);

      ctx.fillStyle = '#FCD34D';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${v.variationScore.toFixed(1)}分`, width - 70, yPos);
    });

    // 7. Windfall Wealth Summary Box
    ctx.fillStyle = '#0F172A';
    ctx.roundRect?.(50, 530, width - 100, 130, 12);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`今日偏财运指数：${windfallAnalysis.score} 分 · ${windfallAnalysis.suitabilityZh}`, 70, 560);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12px sans-serif';
    ctx.fillText(`气运吉时：${windfallAnalysis.auspiciousHour}`, 70, 590);
    ctx.fillText(`煞星避动：${windfallAnalysis.avoidHour}`, 70, 615);
    ctx.fillText(`财神吉位：九宫离九 · 正南方 (火生土旺)`, 70, 640);

    // 8. Canon Quote
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.roundRect?.(50, 680, width - 100, 75, 8);
    ctx.fill();

    ctx.fillStyle = '#E5C07B';
    ctx.font = 'italic 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('“数往者顺，知来者逆，是故易逆数也。”', width / 2, 712);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px serif';
    ctx.fillText('—— 宋代邵康节《梅花易数》· 万物类象起数篇', width / 2, 735);

    // 9. Anti-Gambling Warning & Seal
    ctx.fillStyle = '#64748B';
    ctx.font = '10px sans-serif';
    ctx.fillText('【理智敬告】所有博彩均为物理独立随机事件 · 传统数理象学仅供文化研究与益智参考', width / 2, 785);
    ctx.fillText('量力而行 · 切勿沉迷 · 享受理性推衍乐趣', width / 2, 802);

    // Traditional red chop seal
    ctx.fillStyle = '#B91C1C';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 2 - 38, 825, 76, 32);
    ctx.font = 'bold 12px serif';
    ctx.fillStyle = '#FCA5A5';
    ctx.fillText('时空易数', width / 2, 846);

    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [isOpen, profile, dateStr, motherCode, variations, windfallAnalysis]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `紫微时空数理运势卡_${dateStr}_${motherCode.motherCode}.png`;
    a.click();
  };

  const handleCopySummary = () => {
    const text = `【紫微时空数理运势卡】\n日期：${dateStr}\n命主：${profile.name}\n本期母码：${motherCode.motherCode} (指数: ${motherCode.score.toFixed(1)})\n偏财指数：${windfallAnalysis.score}分 (${windfallAnalysis.suitabilityZh})\n最佳吉时：${windfallAnalysis.auspiciousHour}\n避煞时辰：${windfallAnalysis.avoidHour}\n核心变异码：${variations.slice(0, 3).map((v) => v.resultNumber).join('、')}\n“数往者顺，知来者逆，是故易逆数也。”\n【理性娱乐，切勿沉迷】`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-gold-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0E1322] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              生成今日时空数理运势卡 · 典藏长图海报
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Canvas Preview */}
        <div className="p-4 flex flex-col items-center bg-[#070A12] max-h-[68vh] overflow-y-auto custom-scrollbar">
          <canvas ref={canvasRef} className="w-[300px] sm:w-[380px] rounded-xl shadow-2xl border border-gold-500/30" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0B0F19] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            支持一键下载高分辨率 PNG 海报，适合分享至朋友圈或保存复盘
          </span>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleCopySummary}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制文本</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制运势摘要</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleDownload}
              className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              下载高清海报 (PNG)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
