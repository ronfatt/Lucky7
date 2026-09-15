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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setErrorMessage('密码长度至少需要 6 个字符');
          setIsLoading(false);
          return;
        }
        const { user, error } = await signUp(email, password, name);
        if (error) {
          setErrorMessage(error.message || '注册失败，请检查邮箱格式或网络状态');
        } else {
          setSuccessMessage('注册成功！已为您开启云端会员命盘同步。');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        const { user, error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || '登录失败，请检查邮箱与密码是否正确');
        } else {
          setSuccessMessage('登录成功！已同步您的专属紫微命盘。');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || '系统繁忙，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#101626] via-[#0C101A] to-[#070A12] border-gold-500/40 shadow-2xl p-6 relative overflow-hidden">
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
              <span>完成注册 · 开启云端同步</span>
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
    </div>
  );
}
