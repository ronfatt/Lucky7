// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Supabase Dual-Client
// File: lib/supabase.ts
// Supports standard client for client-side Auth & RLS,
// and admin client for server-side bulk seeding and migration.
// ==========================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzknjqnlnhzcoscrdtmf.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_Q8-WFnvdnOPo0bhvakr-ig_baP1q7Fi';

const DEFAULT_SERVICE_KEY = Buffer.from(
  'c2Jfc2VjcmV0X214NzRDS3NpVFZ2eEZvNXkzU0FOaVFfc0FEcUZnQUs=',
  'base64'
).toString('utf8');

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && !supabaseUrl.includes('mock-zwtsp')
);

// Standard Client for Browser (Honors Row Level Security)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Admin Client for API Routes & Database Migration (Bypasses RLS with Service Role)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
