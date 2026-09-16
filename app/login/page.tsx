// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Dedicated Login & Register Page
// File: app/login/page.tsx
// Required authentication entry portal before accessing user dashboard
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-store';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';

const CHINESE_HOURS = [
  { branch: '子', label: '子时 (23:00 - 00:59)', time: '23:30:00' },
  { branch: '丑', label: '丑时 (01:00 - 02:59)', time: '02:00:00' },
  { branch: '寅', label: '寅时 (03:00 - 04:59)', time: '04:00:00' },
  { branch: '卯', label: '卯时 (05:00 - 06:59)', time: '06:00:00' },
  { branch: '辰', label: '辰时 (07:00 - 08:59)', time: '08:00:00' },
  { branch: '巳', label: '巳时 (09:00 - 10:59)', time: '10:00:00' },
  { branch: '午', label: '午时 (11:00 - 12:59)', time: '12:00:00' },
  { branch: '未', label: '未时 (13:00 - 14:59)', time: '14:00:00' },
  { branch: '申', label: '申时 (15:00 - 16:59)', time: '16:00:00' },
  { branch: '酉', label: '酉时 (17:00 - 18:59)', time: '18:00:00' },
  { branch: '戌', label: '戌时 (19:00 - 20:59)', time: '20:00:00' },
  { branch: '亥', label: '亥时 (21:00 - 22:59)', time: '22:00:00' },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, signIn, signUp } = useAuth();
  const { updateProfile } = useUserProfile();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('1990-05-18');
  const [birthTime, setBirthTime] = useState('09:30:00');
  const [isUnknownHour, setIsUnknownHour] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  const formatAuthError = (err: any): string => {
    const msg = err?.message || String(err);
    if (msg.includes('Email not confirmed')) {
      return '邮箱尚未激活：请前往邮箱收件箱点击验证链接；若需免验证直接登录，管理员可在 Supabase 后台（Authentication -> Providers -> Email）关闭【Confirm email】。';
    }
    if (msg.includes('Invalid login credentials')) {
      return '登录失败：账号邮箱或密码不匹配，请核对后重试。';
    }
    if (msg.includes('User already registered')) {
      return '该邮箱已注册：请直接切换至上方【立即登录】。';
    }
    if (msg.includes('rate limit')) {
      return '操作过于频繁，请稍等 1-2 分钟后再试。';
    }
    if (msg.includes('is invalid')) {
      return '邮箱格式无效：请输入真实的常用邮箱（如 Gmail、QQ、163 等）。';
    }
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setErrorMessage('密码长度至少需要 6 位字符');
          setIsSubmitting(false);
          return;
        }

        const { user: newUser, session, error } = await signUp(
          email,
          password,
          name || '命主',
          {
            gender,
            birthDate,
            birthTime: isUnknownHour ? '' : birthTime,
          }
        );
        if (error) {
          setErrorMessage(formatAuthError(error));
        } else {
          // If profile information provided during signup, save it
          if (name || birthDate) {
            updateProfile({
              name: name || '命主',
              gender,
              birthDate,
              birthTime: isUnknownHour ? '' : birthTime,
              birthTimePrecision: isUnknownHour ? 'UNKNOWN' : 'EXACT',
              birthPlace: '马来西亚吉隆坡',
              timezone: 'Asia/Kuala_Lumpur',
              calendarType: 'gregorian',
            });
          }

          if (session) {
            setSuccessMessage('注册成功！已为您自动登录并初始化本命盘。正在进入系统...');
            setTimeout(() => {
              router.push('/');
            }, 1000);
          } else {
            setSuccessMessage('注册成功！若开启了邮箱验证，请查收邮件激活；若已关闭验证，请切换至【立即登录】。');
          }
        }
      } else {
        const { user: signedInUser, error } = await signIn(email, password);
        if (error) {
          setErrorMessage(formatAuthError(error));
        } else {
          setSuccessMessage('登录成功！正在进入您的时空推演看板...');
          setTimeout(() => {
            router.push('/');
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-gold-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
          <span className="text-xs font-serif tracking-widest">正在验证会员认证凭据...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-br from-[#060810] via-[#090D18] to-[#04060B] relative overflow-x-hidden">
      {/* Mystical Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 text-obsidian-950 font-serif font-black text-2xl shadow-gold-glow mb-3">
          紫
        </div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 tracking-wider">
          紫微时空数字预测系统
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-serif">
          天心正运 · 洛书归元 · 尊享会员认证入口
        </p>
      </div>

      {/* Main Auth Card */}
      <Card className="w-full max-w-md bg-[#0C101C]/95 border-gold-500/40 shadow-2xl p-5 sm:p-7 rounded-2xl relative z-10 backdrop-blur-xl">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 mb-5 bg-[#060810] rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>会员登录</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>注册新会员</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup Specific: Name, Gender, Birth Info */}
          {mode === 'signup' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-obsidian-950 border border-gold-500/20">
              <div className="text-[11px] font-serif text-gold-champagne flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>初始化您的本命参数 (自动排定八字紫微)</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">命主姓名/称谓</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="如：李知命"
                      className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-8 pr-2 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">乾造 / 坤造</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-[#070A12] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
                  >
                    <option value="male">乾造 (男命)</option>
                    <option value="female">坤造 (女命)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">公历阳历生日</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-[#070A12] border border-slate-800 text-xs text-gold-200 px-2.5 py-2 rounded-xl focus:outline-none focus:border-gold-500/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">出生时辰</label>
                  <select
                    disabled={isUnknownHour}
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-[#070A12] border border-slate-800 text-xs text-white px-2 py-2 rounded-xl focus:outline-none focus:border-gold-500/60 disabled:opacity-50"
                  >
                    {CHINESE_HOURS.map((h) => (
                      <option key={h.branch} value={h.time}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium block">
              会员电子邮箱
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium block">
              登录密码
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位密码字符"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all mt-2"
          >
            {isSubmitting ? (
              <span>正在验证通行中据...</span>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>安全登录 · 进入时空推演看板</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>注册会员 · 生成专属本命盘</span>
              </>
            )}
          </Button>
        </form>

        {/* Footnotes */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Supabase 加密储存</span>
          </div>
          <div className="flex items-center gap-1.5 text-gold-champagne/80">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>13% 愿心承诺</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
