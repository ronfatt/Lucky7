// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Users Roster & Habit Analysis API
// File: app/api/admin/analytics/users/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    // 1. Fetch Supabase Auth Users
    let authUsers: any[] = [];
    try {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (!error && data?.users) {
        authUsers = data.users;
      }
    } catch (e) {
      console.debug('[UsersAPI] listUsers notice:', e);
    }

    // 2. Fetch User Profiles
    let profilesMap = new Map<string, any>();
    try {
      const { data: profiles, error: profErr } = await supabaseAdmin.from('user_profiles').select('*');
      if (!profErr && profiles) {
        profiles.forEach((p) => profilesMap.set(p.id, p));
      }
    } catch (e) {
      console.debug('[UsersAPI] profiles notice:', e);
    }

    // 3. Fetch user activity stats from logs (both Supabase + local buffer)
    let logsMap = new Map<string, any[]>();
    const allLogs = [...localLogBuffer];

    try {
      const { data: dbLogs } = await supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (dbLogs) {
        allLogs.push(...dbLogs);
      }
    } catch {}

    allLogs.forEach((log) => {
      const uid = log.user_id;
      const email = log.user_email?.toLowerCase();
      const key = uid || email;
      if (key) {
        if (!logsMap.has(key)) logsMap.set(key, []);
        logsMap.get(key)!.push(log);
      }
    });

    // 4. Combine Users & Profiles & Activity Insights
    let mergedUsers = authUsers.map((u) => {
      const profile = profilesMap.get(u.id) || {};
      const userLogs = logsMap.get(u.id) || logsMap.get(u.email?.toLowerCase()) || [];

      // Calculate user specific habits
      const logins = userLogs.filter((l) => l.event_type === 'auth.login');
      const logouts = userLogs.filter((l) => l.event_type === 'auth.logout');
      const predictions = userLogs.filter((l) => l.event_type.startsWith('prediction'));
      const bookmarks = userLogs.filter((l) => l.event_type === 'prediction.save');

      // Detect peak active hour
      const hourCounts: Record<number, number> = {};
      userLogs.forEach((l) => {
        try {
          const d = new Date(l.created_at);
          const h = d.getHours();
          hourCounts[h] = (hourCounts[h] || 0) + 1;
        } catch {}
      });

      let peakHour = -1;
      let maxCount = 0;
      Object.entries(hourCounts).forEach(([h, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          peakHour = parseInt(h, 10);
        }
      });

      // Derive habit tags
      const habitTags: string[] = [];
      if (peakHour >= 17 && peakHour <= 19) {
        habitTags.push('🎯 傍晚开奖前集中');
      } else if (peakHour >= 6 && peakHour <= 10) {
        habitTags.push('🌅 晨间运势推演');
      } else if (peakHour >= 22 || peakHour <= 2) {
        habitTags.push('🌙 深夜玄学参研');
      }

      if (bookmarks.length >= 3) {
        habitTags.push('⭐ 高频心水收藏客');
      }
      if (predictions.length >= 5) {
        habitTags.push('🔥 深度数字推演家');
      }
      if (userLogs.some((l) => l.page_path?.includes('destiny'))) {
        habitTags.push('🔮 偏好紫微命盘');
      }
      if (habitTags.length === 0) {
        habitTags.push('🌱 新入驻会员');
      }

      // Latest login / logout
      const latestLogin = logins[0]?.created_at || profile.last_login_at || u.last_sign_in_at || null;
      const latestLogout = logouts[0]?.created_at || profile.last_logout_at || null;
      const latestDevice =
        userLogs[0]?.metadata?.device || profile.last_device || '未知设备';

      return {
        id: u.id,
        email: u.email,
        name: profile.name || u.user_metadata?.name || u.email?.split('@')[0] || '命主',
        gender: profile.gender || u.user_metadata?.gender || 'male',
        birthDate: profile.birth_date || u.user_metadata?.birthDate || '1990-05-18',
        birthTime: profile.birth_time || u.user_metadata?.birthTime || '09:30:00',
        membershipTier: profile.membership_tier || 'FREE',
        createdAt: u.created_at || profile.created_at,
        lastLoginAt: latestLogin,
        lastLogoutAt: latestLogout,
        loginCount: Math.max(logins.length, profile.login_count || (latestLogin ? 1 : 0)),
        totalActions: Math.max(userLogs.length, profile.total_actions || 1),
        lastDevice: latestDevice,
        habitTags,
        recentActionsCount: userLogs.length,
      };
    });

    // If query filter exists
    if (query) {
      mergedUsers = mergedUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(query) ||
          u.name?.toLowerCase().includes(query) ||
          u.habitTags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        total: mergedUsers.length,
        users: mergedUsers,
      },
    });
  } catch (err: any) {
    console.error('[UsersAPI] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
