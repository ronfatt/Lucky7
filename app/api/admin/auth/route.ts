// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin Dedicated Authentication API
// File: app/api/admin/auth/route.ts
// Handles separate ID & Password authentication for Admin Dashboard
// ==========================================================

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'zwtsp_secret_admin_guard_2026';

// Permitted Admin Usernames & Passwords
const VALID_ADMINS = [
  {
    username: (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Lucky7Admin888!',
  },
  {
    username: 'lucky7admin',
    password: process.env.ADMIN_PASSWORD || 'Lucky7Admin888!',
  },
  {
    username: 'ronfatt@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'Lucky7Admin888!',
  },
];

function generateAdminToken(username: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifyAdminToken(token: string): { valid: boolean; username?: string } {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const [username, expiresAtStr, signature] = raw.split(':');
    const expiresAt = parseInt(expiresAtStr, 10);

    if (!username || !expiresAt || isNaN(expiresAt)) return { valid: false };
    if (Date.now() > expiresAt) return { valid: false };

    const expectedSig = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(`${username}:${expiresAt}`)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: true, username };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

// GET: Check current Admin session
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/zwtsp_admin_session=([^;]+)/);
    const token = match ? match[1] : '';

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const { valid, username } = verifyAdminToken(token);
    return NextResponse.json({ authenticated: valid, username: valid ? username : null });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// POST: Login or Logout
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = 'login', username = '', password = '' } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: '管理员已安全退出' });
      response.cookies.set('zwtsp_admin_session', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        sameSite: 'lax',
      });
      return response;
    }

    // Login validation
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return NextResponse.json(
        { success: false, error: '请输入管理员账号与密钥' },
        { status: 400 }
      );
    }

    const matched = VALID_ADMINS.some(
      (acc) =>
        (acc.username === cleanUser || acc.username === cleanUser.replace('@gmail.com', '')) &&
        acc.password === cleanPass
    );

    if (!matched) {
      return NextResponse.json(
        { success: false, error: '管理员身份验证失败：账号或密钥不正确' },
        { status: 401 }
      );
    }

    const token = generateAdminToken(cleanUser);
    const response = NextResponse.json({
      success: true,
      message: '管理员认证成功，正在载入运营中台...',
      admin: { username: cleanUser },
      token,
    });

    response.cookies.set('zwtsp_admin_session', token, {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || '认证服务异常' },
      { status: 500 }
    );
  }
}
