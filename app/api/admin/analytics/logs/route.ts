// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Activity Logs API & CSV Export
// File: app/api/admin/analytics/logs/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('event_type') || '';
    const email = searchParams.get('email')?.toLowerCase() || '';
    const format = searchParams.get('format') || 'json';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // 1. Gather logs from local memory buffer + Supabase
    let allLogs = [...localLogBuffer];

    try {
      let query = supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (eventType) {
        query = query.eq('event_type', eventType);
      }
      if (email) {
        query = query.ilike('user_email', `%${email}%`);
      }

      const { data: dbLogs } = await query;
      if (dbLogs && dbLogs.length > 0) {
        const idSet = new Set(allLogs.map((l) => l.id));
        for (const item of dbLogs) {
          if (!idSet.has(item.id)) {
            allLogs.push(item);
          }
        }
      }
    } catch (e) {
      console.debug('[LogsAPI] DB query notice:', e);
    }

    // 2. Memory filter
    let filtered = allLogs;
    if (eventType) {
      filtered = filtered.filter((l) => l.event_type === eventType);
    }
    if (email) {
      filtered = filtered.filter((l) => l.user_email?.toLowerCase().includes(email));
    }

    // Sort descending by created_at
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 3. Handle CSV Export
    if (format === 'csv') {
      const csvRows: string[] = [];
      // UTF-8 BOM for Chinese Excel compatibility
      const BOM = '\uFEFF';
      csvRows.push(['时间 (UTC+8)', '用户姓名', '用户邮箱', '事件类型', '操作描述', '页面路径', '停留时长(秒)', 'IP地址', '客户端设备'].join(','));

      filtered.forEach((row) => {
        const d = new Date(row.created_at);
        const timeStr = d.toLocaleString('zh-CN', { timeZone: 'Asia/Kuala_Lumpur' });
        const clean = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
        const duration = row.metadata?.durationSeconds || '';
        const device = row.metadata?.device || (row.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop');

        csvRows.push([
          clean(timeStr),
          clean(row.user_name || '命主'),
          clean(row.user_email || '匿名访客'),
          clean(row.event_type),
          clean(row.event_label),
          clean(row.page_path),
          clean(duration),
          clean(row.ip_address),
          clean(device),
        ].join(','));
      });

      const csvContent = BOM + csvRows.join('\n');
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="zwtsp_activity_logs_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        total: filtered.length,
        logs: filtered.slice(0, limit),
      },
    });
  } catch (err: any) {
    console.error('[LogsAPI] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
