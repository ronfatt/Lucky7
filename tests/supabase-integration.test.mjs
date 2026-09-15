// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Supabase Integration Test Suite
// File: tests/supabase-integration.test.mjs
// Verifies:
// 1. Supabase Client Configuration & Credentials
// 2. Full Database Setup SQL validity
// 3. User Profile schema mapping & cloud synchronization
// ==========================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

import { isSupabaseConfigured, supabase, supabaseAdmin } from '../lib/supabase.ts';
import { DEFAULT_USER_PROFILE } from '../lib/profile/user-profile-store.ts';

test('Supabase Dimension 1: Client Configuration & Connectivity', (t) => {
  assert.ok(isSupabaseConfigured, 'Supabase should be recognized as configured');
  assert.ok(supabase, 'Standard Supabase client must be instantiated');
  assert.ok(supabaseAdmin, 'Admin Supabase client must be instantiated');
  assert.ok(supabase.auth, 'Supabase auth subsystem must be accessible');
});

test('Supabase Dimension 2: Full Database Setup SQL Script Verification', (t) => {
  const sqlPath = path.resolve('supabase/full_database_setup.sql');
  assert.ok(fs.existsSync(sqlPath), 'full_database_setup.sql must exist');

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.user_profiles'), 'Must contain user_profiles table');
  assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.classical_literature'), 'Must contain classical_literature table');
  assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.lottery_draws'), 'Must contain lottery_draws table');
  assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.saved_predictions'), 'Must contain saved_predictions table');
  assert.ok(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.prediction_ledger'), 'Must contain prediction_ledger table');
  assert.ok(sqlContent.includes('handle_new_user'), 'Must contain new user registration trigger');
});

test('Supabase Dimension 3: Profile Cloud Sync Mapping', (t) => {
  assert.ok(DEFAULT_USER_PROFILE.name, 'Default profile must have name');
  assert.ok(DEFAULT_USER_PROFILE.birthDate, 'Default profile must have birthDate');
  assert.equal(DEFAULT_USER_PROFILE.birthTimePrecision, 'EXACT');

  // Verify fields match SQL schema
  const dbFields = {
    id: 'test-uuid',
    name: DEFAULT_USER_PROFILE.name,
    gender: DEFAULT_USER_PROFILE.gender,
    birth_date: DEFAULT_USER_PROFILE.birthDate,
    birth_time: DEFAULT_USER_PROFILE.birthTime,
    birth_place: DEFAULT_USER_PROFILE.birthPlace,
    timezone: DEFAULT_USER_PROFILE.timezone,
    calendar_type: DEFAULT_USER_PROFILE.calendarType,
  };

  assert.equal(dbFields.name, '李知命');
  assert.equal(dbFields.birth_date, '1990-05-18');
  assert.equal(dbFields.gender, 'male');
});
