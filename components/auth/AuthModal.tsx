// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Member Auth Modal
// File: components/auth/AuthModal.tsx
// ==========================================================

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Cloud,
} from 'lucide-react';
import { ConsentTermsModal } from './ConsentTermsModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formatAuthError = (err: any): string => {
      const msg = err?.message || String(err);
      if (msg.includes('Email not confirmed')) {
        return '邮箱尚未通过验证：请前往收件箱或垃圾箱查收确认邮件并点击激活链接；或者项目管理员可在 Supabase 控制台（Authentication -> Providers -> Email）关闭【Confirm email】以实现免验证直接登录。';
      }
      if (msg.includes('Invalid login credentials')) {
        return '登录失败：账号邮箱或密码不匹配，请重新核对。';
      }
      if (msg.includes('User already registered')) {
        return '该邮箱已注册：请直接点击上方【立即登录】按钮。';
      }
      if (msg.includes('rate limit')) {
        return '请求过于频繁，请稍等 1-2 分钟后再试。';
      }
      if (msg.includes('is invalid')) {
        return '邮箱格式无效：请输入真实的常用邮箱（如 Gmail、QQ、163 等）。';
      }
      return msg;
    };

    try {
      if (mode === 'signup') {
        if (!agreedToTerms) {
          setErrorMessage('请先勾选同意《实验参与守则与同意条款》后方可完成注册');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('密码长度至少需要 6 个字符');
          setIsLoading(false);
          return;
        }
        const { user, session, error } = await signUp(email, password, name, {
          agreedToTerms: true,
          witnessPrivacy: 'nickname',
        });
        if (error) {
          setErrorMessage(formatAuthError(error));
        } else if (session) {
          setSuccessMessage('注册成功！已为您自动登录并开启命盘云同步。');
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSuccessMessage('注册成功！若您的项目开启了邮箱验证，请查收邮件激活；若已关闭验证，请切换至【立即登录】。');
        }
      } else {
        const { user, error } = await signIn(email, password);
        if (error) {
          setErrorMessage(formatAuthError(error));
        } else {
          setSuccessMessage('登录成功！已同步您的专属紫微命盘。');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in duration-200">
      <div className="w-full max-w-md my-auto relative">
        <Card className="w-full bg-gradient-to-br from-[#101626] via-[#0C101A] to-[#070A12] border-gold-500/40 shadow-2xl p-5 sm:p-6 relative overflow-hidden rounded-2xl">
          {/* Glow decoration */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>{mode === 'signin' ? '会员登录' : '注册新命主会员'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 border border-gold-500/20">
                Supabase 云同步
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              跨端储存您的个人八字命盘、心水收藏与推演复盘
            </p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 my-4 bg-[#070A12] rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signin'
                ? 'bg-gold-500 text-obsidian-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            立即登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-gold-500 text-obsidian-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            注册账号
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium block">
                命主称谓 (姓名)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如：李知命"
                  className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium block">
              电子邮箱
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium block">
              密码
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位字符"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          {/* Terms Consent Checkbox for Signup */}
          {mode === 'signup' && (
            <div className="p-2.5 rounded-xl bg-obsidian-950 border border-gold-500/25">
              <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-300 leading-relaxed">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-700 bg-obsidian-900 text-gold-500 focus:ring-gold-500/40 shrink-0 accent-amber-500"
                />
                <span>
                  本人自愿参与并已阅读同意
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-gold-300 font-bold underline hover:text-gold-200 mx-1 inline"
                  >
                    《实验参与守则与同意条款》
                  </button>
                  （含 13% 愿心公益承诺与拒绝赌博约定）。
                </span>
              </label>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/20 transition"
          >
            {isLoading ? (
              <span>处理中...</span>
            ) : mode === 'signin' ? (
              <span>安全登录 · 载入命盘</span>
            ) : (
              <span>同意守则并注册会员</span>
            )}
          </Button>
        </form>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Cloud className="w-3 h-3 text-gold-400" />
            <span>Supabase PostgreSQL 驱动</span>
          </div>
          <span>数据加密传输 · 保护生辰隐私</span>
        </div>
      </Card>

      {/* Terms Modal */}
      <ConsentTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
      />
    </div>
  </div>
  );
}
