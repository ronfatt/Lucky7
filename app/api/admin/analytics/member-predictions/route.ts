// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Member Daily Predictions API
// File: app/api/admin/analytics/member-predictions/route.ts
// Computes and retrieves every member's daily 4-digit numbers and prediction archives
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';
import { MemberDailyCalculator } from '@/lib/prediction/member-daily-calculator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = searchParams.get('userId') || '';
    const email = searchParams.get('email')?.toLowerCase() || '';
    const format = searchParams.get('format') || 'json';
    const daysRange = parseInt(searchParams.get('days') || '1', 10);

    // 1. Fetch Users from user_profiles & auth.users
    let profiles: any[] = [];
    try {
      let query = supabaseAdmin.from('user_profiles').select('*');
      if (userId) query = query.eq('id', userId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        profiles = data;
      }
    } catch (e) {
      console.debug('[MemberPredictionsAPI] user_profiles notice:', e);
    }

    // If user_profiles is empty, fallback to auth.users
    if (profiles.length === 0) {
      try {
        const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
        if (authData?.users) {
          profiles = authData.users.map((u) => ({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email?.split('@')[0] || '命主',
            gender: u.user_metadata?.gender || 'male',
            birth_date: u.user_metadata?.birthDate || '1990-05-18',
            birth_time: u.user_metadata?.birthTime || '09:30:00',
            timezone: 'Asia/Kuala_Lumpur',
          }));
        }
      } catch (e) {
        console.debug('[MemberPredictionsAPI] auth users notice:', e);
      }
    }

    // Filter by email if provided
    if (email) {
      profiles = profiles.filter((p) => p.email?.toLowerCase().includes(email));
    }

    // 2. Fetch saved predictions & ledger to check if numbers were saved/hit
    let savedMap = new Set<string>();
    try {
      const { data: saves } = await supabaseAdmin.from('saved_predictions').select('user_id, number, date');
      if (saves) {
        saves.forEach((s) => savedMap.add(`${s.user_id}_${s.date}_${s.number}`));
      }
    } catch {}

    // 3. Prepare dates list
    const datesList: string[] = [];
    if (daysRange > 1) {
      // Generate past N days ending at selectedDate
      const baseDate = new Date(selectedDate);
      for (let i = 0; i < Math.min(daysRange, 30); i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        datesList.push(d.toISOString().split('T')[0]);
      }
    } else {
      datesList.push(selectedDate);
    }

    // 4. Calculate predictions for each profile across each date
    const results: any[] = [];

    profiles.forEach((profile) => {
      datesList.forEach((dt) => {
        try {
          const prediction = MemberDailyCalculator.calculate(profile, dt);
          const isSaved = savedMap.has(`${profile.id}_${dt}_${prediction.motherCode}`);

          // Check logs for actual user views
          const logsForThis = localLogBuffer.filter(
            (l) =>
              (l.user_id === profile.id || l.user_email?.toLowerCase() === profile.email?.toLowerCase()) &&
              l.event_type.startsWith('prediction') &&
              (l.metadata?.date === dt || l.created_at?.startsWith(dt))
          );

          results.push({
            ...prediction,
            isSaved,
            viewCount: logsForThis.length,
          });
        } catch (err) {
          console.error(`[MemberPredictionsAPI] Error calculating for ${profile.email}:`, err);
        }
      });
    });

    // Sort by date desc, then score desc
    results.sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.score - a.score;
    });

    // 5. Handle CSV Export
    if (format === 'csv') {
      const BOM = '\uFEFF';
      const rows = [
        ['推演日期', '干支时空', '会员姓名', '会员邮箱', '4位核心母码', '气场得分', '偏财指数', '吉神方位', '吉位时辰', '吉色穿搭', '12组变体号码', '是否已收藏'].join(','),
      ];

      const clean = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;

      results.forEach((item) => {
        rows.push([
          clean(item.date),
          clean(item.dayStemBranch),
          clean(item.userName),
          clean(item.userEmail),
          clean(item.motherCode),
          clean(item.score),
          clean(item.windfallScore),
          clean(item.wealthDirection),
          clean(item.auspiciousHour),
          clean(item.luckyColor),
          clean(item.variations?.slice(0, 6).join(' / ')),
          clean(item.isSaved ? '已收藏' : '未收藏'),
        ].join(','));
      });

      return new Response(BOM + rows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="zwtsp_member_predictions_${selectedDate}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        date: selectedDate,
        totalMembers: profiles.length,
        totalPredictions: results.length,
        predictions: results,
      },
    });
  } catch (err: any) {
    console.error('[MemberPredictionsAPI] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
