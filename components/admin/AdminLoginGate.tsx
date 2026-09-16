// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Login Gate Component
// File: components/admin/AdminLoginGate.tsx
// Separate ID & Password login portal for Admin Dashboard
// ==========================================================

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Lock,
  UserCheck,
  ShieldAlert,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminLoginGateProps {
  onSuccess: (adminName: string) => void;
}

export function AdminLoginGate({ onSuccess }: AdminLoginGateProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username,
          password,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(data.admin?.username || username);
      } else {
        setErrorMsg(data.error || '管理员身份核验未通过，请检查账号与密码');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || '连接中台鉴权服务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#05070D] via-[#090D18] to-[#04060A] relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Admin Card */}
      <Card className="w-full max-w-md bg-[#0C101C]/95 border-gold-500/35 p-6 sm:p-8 rounded-2xl relative z-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-3 shadow-gold-glow">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-100">
            紫微时空数字 · 运营治理中台
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-serif">
            特权管理专区 · 请输入管理员凭证核验身份
          </p>
          <div className="mt-2.5">
            <Badge variant="gold" className="text-[10px] tracking-wider font-mono">
              SECURITY LEVEL: ELEVATED
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              管理员账号 (Admin ID)
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入管理员 ID (如 admin)"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              管理员密钥 (Admin Password)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入中台管理员密钥"
                className="w-full bg-[#070A12] border border-slate-800 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all mt-2"
          >
            {loading ? (
              <span>正在验证管理员特权凭据...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>验证特权 · 进入管理中台</span>
              </>
            )}
          </Button>
        </form>

        {/* Disclaimer footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-gold-400" />
            <span>全量操作均受系统审计</span>
          </span>
          <a
            href="/"
            className="text-gold-champagne/80 hover:text-gold-300 hover:underline transition"
          >
            返回会员首页
          </a>
        </div>
      </Card>
    </div>
  );
}
