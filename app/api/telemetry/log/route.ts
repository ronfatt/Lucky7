// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Server-Side Telemetry Ingestion API
// File: app/api/telemetry/log/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { addLogToBuffer } from '@/lib/telemetry/log-buffer';

export async function POST(request: Request) {
  try {
    let body: any = null;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      // Beacon payload
      const rawText = await request.text();
      body = rawText ? JSON.parse(rawText) : {};
    }

    const {
      eventType = 'generic.action',
      eventLabel = '用户交互',
      pagePath = '/',
      userId = null,
      userEmail = null,
      userName = null,
      sessionId = null,
      metadata = {},
      durationSeconds = null,
    } = body || {};

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const nowIso = new Date().toISOString();

    const logEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now(),
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      event_type: eventType,
      event_label: eventLabel,
      page_path: pagePath,
      metadata: {
        ...metadata,
        durationSeconds,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionId,
      created_at: nowIso,
    };

    // 1. Maintain in-memory log buffer for instant admin access
    addLogToBuffer(logEntry);

    // 2. Persist to Supabase Database
    try {
      const { error: insertErr } = await supabaseAdmin
        .from('user_activity_logs')
        .insert({
          user_id: userId || null,
          user_email: userEmail || null,
          user_name: userName || null,
          event_type: eventType,
          event_label: eventLabel,
          page_path: pagePath,
          metadata: {
            ...metadata,
            durationSeconds,
          },
          ip_address: ipAddress,
          user_agent: userAgent,
          session_id: sessionId,
          created_at: nowIso,
        });

      if (insertErr) {
        console.debug('[TelemetryAPI] Supabase insert warning (table might need migration):', insertErr.message);
      }
    } catch (dbErr) {
      console.debug('[TelemetryAPI] Supabase exception:', dbErr);
    }

    // 3. Update user_profiles if this is a login, logout, or user action
    if (userId) {
      try {
        const updatePayload: Record<string, any> = {
          updated_at: nowIso,
        };

        if (eventType === 'auth.login') {
          updatePayload.last_login_at = nowIso;
          if (metadata?.device) {
            updatePayload.last_device = metadata.device;
          }
        } else if (eventType === 'auth.logout') {
          updatePayload.last_logout_at = nowIso;
        }

        await supabaseAdmin
          .from('user_profiles')
          .update(updatePayload)
          .eq('id', userId);
      } catch (profileErr) {
        console.debug('[TelemetryAPI] Profile update notice:', profileErr);
      }
    }

    return NextResponse.json({ success: true, loggedAt: nowIso });
  } catch (err: any) {
    console.error('[TelemetryAPI] Error processing log:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
