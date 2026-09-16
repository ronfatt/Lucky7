// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin User Deep-Dive Detail API
// File: app/api/admin/analytics/user-detail/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email')?.toLowerCase();

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: '缺少用户标识 userId 或 email' }, { status: 400 });
    }

    // 1. Fetch User Profile
    let profile: any = null;
    try {
      let query = supabaseAdmin.from('user_profiles').select('*');
      if (userId) query = query.eq('id', userId);
      else if (email) query = query.eq('email', email);
      const { data } = await query.maybeSingle();
      profile = data;
    } catch {}

    // 2. Fetch User's Logs
    let userLogs = localLogBuffer.filter(
      (l) => (userId && l.user_id === userId) || (email && l.user_email?.toLowerCase() === email)
    );

    try {
      let logQuery = supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (userId) logQuery = logQuery.eq('user_id', userId);
      else if (email) logQuery = logQuery.ilike('user_email', email);

      const { data: dbLogs } = await logQuery;
      if (dbLogs && dbLogs.length > 0) {
        const idSet = new Set(userLogs.map((l) => l.id));
        for (const item of dbLogs) {
          if (!idSet.has(item.id)) userLogs.push(item);
        }
      }
    } catch {}

    userLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 3. Fetch User's Saved Predictions
    let savedPredictions: any[] = [];
    if (userId) {
      try {
        const { data: saves } = await supabaseAdmin
          .from('saved_predictions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
        if (saves) savedPredictions = saves;
      } catch {}
    }

    // 4. Fetch User's Ledger
    let ledgerRecords: any[] = [];
    if (userId) {
      try {
        const { data: ledger } = await supabaseAdmin
          .from('prediction_ledger')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(50);
        if (ledger) ledgerRecords = ledger;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        activityTimeline: userLogs,
        savedPredictions,
        ledgerRecords,
        stats: {
          totalActions: userLogs.length,
          loginCount: userLogs.filter((l) => l.event_type === 'auth.login').length,
          savedCount: savedPredictions.length,
          ledgerCount: ledgerRecords.length,
        },
      },
    });
  } catch (err: any) {
    console.error('[UserDetailAPI] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
