// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Users Roster View
// File: components/admin/AdminUsersView.tsx
// Displays member list with habit tags, login/logout timestamps & drawer trigger
// ==========================================================

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Users,
  LogIn,
  LogOut,
  Calendar,
  Clock,
  Smartphone,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UserDetailDrawer } from './UserDetailDrawer';

interface UsersViewProps {
  users: any[];
  loading: boolean;
  onRefresh: () => void;
}

export function AdminUsersView({ users, loading, onRefresh }: UsersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.habitTags?.some((t: string) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索会员邮箱、称谓、习惯标签 (如: 傍晚、收藏)..."
            className="w-full bg-[#090D18] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新会员库</span>
          </Button>
          <Badge variant="gold" className="text-xs font-mono">
            共 {users.length} 位会员
          </Badge>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-obsidian-950/80 border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A12] text-slate-400 font-serif border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">会员信息</th>
                <th className="p-3.5">八字命造</th>
                <th className="p-3.5">习惯洞察与行为标签</th>
                <th className="p-3.5">登录频次 / 最近登入</th>
                <th className="p-3.5">最近设备</th>
                <th className="p-3.5 pr-4 text-right">全息画像</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-serif">
                    正在检索 Supabase 平台会员与行为档案...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-serif">
                    未检索到匹配的会员档案。
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const loginTimeStr = u.lastLoginAt
                    ? new Date(u.lastLoginAt).toLocaleString('zh-CN', {
                        timeZone: 'Asia/Kuala_Lumpur',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '尚未记录';

                  const logoutTimeStr = u.lastLogoutAt
                    ? new Date(u.lastLogoutAt).toLocaleString('zh-CN', {
                        timeZone: 'Asia/Kuala_Lumpur',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : null;

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser({ id: u.id, email: u.email })}
                      className="hover:bg-gold-500/[0.03] transition cursor-pointer group"
                    >
                      {/* Name & Email */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif font-bold text-xs shrink-0">
                            {u.name ? u.name[0] : '命'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-gold-300 transition">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Bazi & Birth */}
                      <td className="p-3.5">
                        <div className="text-[11px] text-slate-300">
                          {u.gender === 'female' ? '坤造 (女)' : '乾造 (男)'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.birthDate} · {u.birthTime ? u.birthTime.substring(0, 5) : '时辰未知'}
                        </div>
                      </td>

                      {/* Habit Tags */}
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.habitTags?.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-gold-300/90 whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Logins & Last Login */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1 text-[11px] text-blue-300 font-mono">
                          <LogIn className="w-3 h-3 text-blue-400" />
                          <span>{u.loginCount} 次登录</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          最近登入: {loginTimeStr}
                        </div>
                        {logoutTimeStr && (
                          <div className="text-[10px] text-rose-400/80">
                            最近登出: {logoutTimeStr}
                          </div>
                        )}
                      </td>

                      {/* Last Device */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.lastDevice || '未知'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          累计交互 {u.totalActions} 次
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pr-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] text-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
                        >
                          <span>查看画像</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Drawer */}
      {selectedUser && (
        <UserDetailDrawer
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
