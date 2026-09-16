// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 实验参与守则与同意条款 Modal
// File: components/auth/ConsentTermsModal.tsx
// Displays the full 5-clause Participation Guidelines & Consent agreement
// ==========================================================

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  ShieldCheck,
  HeartHandshake,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ConsentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function ConsentTermsModal({ isOpen, onClose, onAgree }: ConsentTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <Card className="w-full max-w-2xl bg-[#090D18] border-gold-500/40 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] my-auto relative overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-obsidian-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-serif">
                  实验参与守则与同意条款
                </h3>
                <Badge variant="gold" className="text-[10px]">
                  法定告知与承诺
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-serif mt-0.5">
                PARTICIPATION GUIDELINES & CONSENT
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans divide-y divide-slate-800/60">
          {/* Preamble */}
          <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-gold-500/20 text-gold-200">
            <p className="font-serif">
              本人自愿参与本次实验，并确认已获机会阅读、理解及考虑以下条款。本人同意以理性、自主及量力而为的原则参与，并遵守以下约定。
            </p>
          </div>

          {/* Clause 1 */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-serif flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-champagne flex items-center justify-center text-[10px] font-mono">
                1
              </span>
              <span>第一条｜理性参与，拒绝赌博与 All-In 心态</span>
            </h4>
            <p className="text-slate-300 pl-7">
              本人明白，本实验仅作为研究、观察及个人体验用途，并不代表或保证任何形式的中奖结果。
            </p>
            <p className="text-slate-300 pl-7">
              本人承诺，在参与实验及购买彩票的过程中，将以理性、娱乐及可承担的金额参与，不以赌博、翻本、借钱投注、追注或
              All-In（孤注一掷）的心态进行投注。
            </p>
            <p className="text-slate-300 pl-7 text-amber-300/90 font-medium">
              所有投注金额必须以不影响本人及家庭正常生活、储蓄、债务偿还及其他财务责任为基本原则。若本人出现失去控制、不断加码、追求回本，或因投注影响生活的情况，应立即停止参与实验。
            </p>
          </div>

          {/* Clause 2 */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-serif flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-champagne flex items-center justify-center text-[10px] font-mono">
                2
              </span>
              <span>第二条｜中奖后的 13% 公益承诺</span>
            </h4>
            <p className="text-slate-300 pl-7">
              本人自愿承诺：若本人在参与实验期间，按照实验所提供的方法、流程或建议进行后获得彩票中奖收益，本人愿意从相关的实际中奖所得中拨出
              <strong className="text-gold-300 font-semibold"> 13%</strong>，用于慈善、公益或帮助有需要的人士。
            </p>
            <p className="text-slate-300 pl-7">
              有关捐赠对象可由本人自行选择合法及适当的慈善机构、公益项目或有实际需要的受助对象。
            </p>
            <div className="ml-7 p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-200 font-serif italic text-[11px]">
              “得之于好运，分享于社会；得到一份幸运，也让幸运继续流动。”
            </div>
          </div>

          {/* Clause 3 */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-serif flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-champagne flex items-center justify-center text-[10px] font-mono">
                3
              </span>
              <span>第三条｜真实见证及照片、视频授权</span>
            </h4>
            <p className="text-slate-300 pl-7">
              若本人参与实验后认为实验对本人产生实际效果，并愿意提供真实体验及反馈，本人同意成为本实验的参与者见证。
            </p>
            <p className="text-slate-300 pl-7">
              本人同意授权实验主办方，在取得本人相关见证素材后，可使用本人提供或经本人同意拍摄的照片、视频、声音、访问内容、文字评价、中奖经历及个人体验分享等素材，作为本实验未来的研究记录、案例分享、课程内容、社交媒体、网站、宣传视频及相关推广用途。
            </p>
            <p className="text-slate-300 pl-7">
              所有见证内容应以本人的真实经历及真实陈述为基础，不得故意捏造、篡改或夸大本人的实际结果。具体的公开识别方式，以签署时所勾选的授权选项为准（默认仅使用昵称/化名）。
            </p>
          </div>

          {/* Clause 4 */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-serif flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-champagne flex items-center justify-center text-[10px] font-mono">
                4
              </span>
              <span>第四条｜结果不保证</span>
            </h4>
            <p className="text-slate-300 pl-7">
              本人清楚了解，彩票本质上具有随机性。任何分析、方法、仪式、命理、风水、数字或行为建议，均不构成中奖保证、财务建议或投资建议。
            </p>
            <p className="text-slate-300 pl-7">
              过去参与者的结果、个别成功案例或见证，并不代表其他参与者能够获得相同结果。本人参与实验及决定是否购买彩票，均属于本人的自主决定；本人应自行控制投注金额，并承担相关财务风险。
            </p>
          </div>

          {/* Clause 5 */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-serif flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-champagne flex items-center justify-center text-[10px] font-mono">
                5
              </span>
              <span>第五条｜自愿参与</span>
            </h4>
            <p className="text-slate-300 pl-7">
              本人确认，本次参与属于自愿性质。本人已阅读及理解本文件内容，并有机会在签署前提出疑问。
            </p>
            <p className="text-slate-300 pl-7">
              本人可以自行决定停止参与；停止参与并不免除本人在停止前已作出的个人财务决定或其他责任。
            </p>
            <div className="ml-7 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-serif font-bold text-center">
              不贪、不赌、不借、不追、不 All-In；理性参与，量力而为。
            </div>
            <p className="text-slate-400 pl-7 text-[11px]">
              本人同时认同：若幸运真的来到，在自己得到的同时，也愿意把其中一部分幸运分享出去。
            </p>
          </div>

          {/* Reminder */}
          <div className="pt-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">重要提醒 (Important Notice)</strong>
                本条款用于记录参与者的知情、自愿及相关承诺，不应被理解为中奖保证、专业法律意见或财务建议。
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-obsidian-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 font-serif flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>勾选即代表本人已完整阅读并自愿签署全部条款</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs"
            >
              返回
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onAgree}
              className="flex-1 sm:flex-none bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-md shadow-gold-500/20"
            >
              我已完整阅读并认同签署
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
