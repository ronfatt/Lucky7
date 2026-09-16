// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Analytics Overview API
// File: app/api/admin/analytics/overview/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // 1. Fetch Users Count
    let totalUsers = 0;
    let usersList: any[] = [];
    try {
      const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!authErr && authUsers?.users) {
        totalUsers = authUsers.users.length;
        usersList = authUsers.users;
      }
    } catch (e) {
      console.debug('[AnalyticsOverview] Auth list error:', e);
    }

    // 2. Fetch User Profiles
    let profiles: any[] = [];
    try {
      const { data: profData } = await supabaseAdmin.from('user_profiles').select('*');
      if (profData) {
        profiles = profData;
        if (totalUsers === 0) totalUsers = profData.length;
      }
    } catch (e) {
      console.debug('[AnalyticsOverview] Profiles select error:', e);
    }

    // 3. Fetch Activity Logs (Supabase + local memory buffer merge)
    let logs: any[] = [...localLogBuffer];
    try {
      const { data: dbLogs, error: logErr } = await supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (!logErr && dbLogs && dbLogs.length > 0) {
        // Merge and deduplicate by id
        const existingIds = new Set(logs.map((l) => l.id));
        for (const item of dbLogs) {
          if (!existingIds.has(item.id)) {
            logs.push(item);
          }
        }
      }
    } catch (e) {
      console.debug('[AnalyticsOverview] Logs select error:', e);
    }

    // 4. Calculate KPIs
    const todayLogs = logs.filter((l) => l.created_at >= todayStart);
    const uniqueActiveToday = new Set(
      todayLogs.map((l) => l.user_id || l.user_email || l.ip_address).filter(Boolean)
    );

    const totalLogins = logs.filter((l) => l.event_type === 'auth.login').length;
    const todayLogins = todayLogs.filter((l) => l.event_type === 'auth.login').length;
    const totalPredictions = logs.filter((l) => l.event_type === 'prediction.generate').length;
    const totalBookmarks = logs.filter((l) => l.event_type === 'prediction.save').length;
    const totalCompassQueries = logs.filter((l) => l.event_type === 'compass.query').length;

    // 5. Hourly Distribution (0 to 23 hours in UTC+8 / Asia/Kuala_Lumpur)
    const hourlyDistribution: { hour: number; label: string; count: number }[] = Array.from(
      { length: 24 },
      (_, h) => ({
        hour: h,
        label: `${String(h).padStart(2, '0')}:00`,
        count: 0,
      })
    );

    logs.forEach((log) => {
      try {
        const d = new Date(log.created_at);
        // Convert to Asia/Kuala_Lumpur hour
        const hourStr = d.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kuala_Lumpur',
          hour: '2-digit',
          hour12: false,
        });
        const h = parseInt(hourStr, 10);
        if (!isNaN(h) && h >= 0 && h < 24) {
          hourlyDistribution[h].count += 1;
        }
      } catch {}
    });

    // 6. Device & OS Breakdown
    const devices: Record<string, number> = {
      'iPhone / iOS': 0,
      'Android Mobile': 0,
      'Desktop (Mac/PC)': 0,
      '其他设备': 0,
    };

    logs.forEach((l) => {
      const dev = l.metadata?.device || '';
      if (dev.includes('iPhone') || dev.includes('iOS')) {
        devices['iPhone / iOS'] += 1;
      } else if (dev.includes('Android')) {
        devices['Android Mobile'] += 1;
      } else if (dev.includes('Desktop')) {
        devices['Desktop (Mac/PC)'] += 1;
      } else {
        devices['其他设备'] += 1;
      }
    });

    // 7. Feature Usage Breakdown
    const features: Record<string, number> = {
      '时空总览 (推演看板)': 0,
      '我的命盘 (八字紫微)': 0,
      '吉位罗盘 (时辰方位)': 0,
      '心水收藏 (保存号码)': 0,
      '易理文献 (古籍原典)': 0,
      '中奖复盘 (账本记录)': 0,
    };

    logs.forEach((l) => {
      const et = l.event_type || '';
      const p = l.page_path || '';
      if (et.startsWith('prediction') || p === '/' || p === '/today') {
        features['时空总览 (推演看板)'] += 1;
      } else if (et.startsWith('destiny') || p.includes('destiny')) {
        features['我的命盘 (八字紫微)'] += 1;
      } else if (et.startsWith('compass') || p.includes('compass')) {
        features['吉位罗盘 (时辰方位)'] += 1;
      } else if (et === 'prediction.save') {
        features['心水收藏 (保存号码)'] += 1;
      } else if (p.includes('literature')) {
        features['易理文献 (古籍原典)'] += 1;
      } else if (p.includes('history') || p.includes('reality')) {
        features['中奖复盘 (账本记录)'] += 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeToday: Math.max(uniqueActiveToday.size, totalUsers > 0 ? 1 : 0),
          totalLogins,
          todayLogins,
          totalPredictions,
          totalBookmarks,
          totalCompassQueries,
          totalLogsCount: logs.length,
        },
        hourlyDistribution,
        devices,
        features,
        recentActivity: logs.slice(0, 10),
      },
    });
  } catch (err: any) {
    console.error('[AnalyticsOverview] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
