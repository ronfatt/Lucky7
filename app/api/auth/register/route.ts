// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Server-Side User Registration API
// File: app/api/auth/register/route.ts
// Bypasses public SMTP email rate-limits by creating confirmed users directly via Supabase Admin
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      gender = 'male',
      birthDate = '1990-05-18',
      birthTime = '09:30:00',
      birthPlace = '马来西亚吉隆坡',
      timezone = 'Asia/Kuala_Lumpur',
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '请提供有效的电子邮箱与登录密码' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度至少需要 6 个字符' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name || cleanEmail.split('@')[0] || '命主').trim();

    // 1. Create user in Supabase Auth with auto-confirmed email (zero SMTP rate limits)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          name: displayName,
          gender,
          birthDate,
          birthTime,
        },
      });

    if (authError) {
      if (
        authError.message.includes('already registered') ||
        authError.message.includes('User already exists')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: '该邮箱已被注册，请直接点击上方【会员登录】输入密码登录。',
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    const user = authData?.user;

    // 2. Initialize profile in public.user_profiles table
    if (user?.id) {
      try {
        await supabaseAdmin.from('user_profiles').upsert(
          {
            id: user.id,
            name: displayName,
            gender,
            birth_date: birthDate,
            birth_time: birthTime,
            birth_place: birthPlace,
            timezone,
            calendar_type: 'gregorian',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch (profileErr) {
        console.warn('[RegisterAPI] Profile upsert notice:', profileErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '会员注册成功并已自动激活！',
      user: {
        id: user?.id,
        email: user?.email,
        name: displayName,
      },
    });
  } catch (err: any) {
    console.error('[RegisterAPI] Server exception:', err);
    return NextResponse.json(
      { success: false, error: err?.message || '服务器注册服务异常，请重试' },
      { status: 500 }
    );
  }
}
