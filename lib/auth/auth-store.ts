// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Member Auth Store
// File: lib/auth/auth-store.ts
// React hook & client-side authentication management with Supabase
// ==========================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Fetch current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Subscribe to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string,
      extraProfile?: {
        gender?: 'male' | 'female';
        birthDate?: string;
        birthTime?: string;
      }
    ) => {
      if (!isSupabaseConfigured) {
        return { user: null, session: null, error: { message: 'Supabase 未正确配置' } };
      }
      try {
        // 1. Register through server API (bypasses Supabase SMTP rate limit & auto-confirms email)
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            ...extraProfile,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || '注册失败，请稍后重试');
        }

        // 2. Immediately sign in to establish client session & tokens
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          console.warn('[AuthStore] Auto sign-in notice:', signInError);
        }

        return {
          user: signInData?.user || result.user,
          session: signInData?.session || null,
          error: null,
        };
      } catch (err: any) {
        console.error('[AuthStore] Sign up exception:', err);
        return { user: null, session: null, error: err };
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { user: null, error: { message: 'Supabase 未正确配置' } };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('SignOut error:', err);
    }
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
    isConfigured: isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
  };
}

function splitEmail(email: string): string {
  if (!email || !email.includes('@')) return '命主';
  return email.split('@')[0];
}
