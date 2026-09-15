// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) User Profile Store with Cloud Sync
// File: lib/profile/user-profile-store.ts
// Dual-track storage: LocalStorage + Supabase user_profiles
// ==========================================================

import { useState, useEffect, useCallback } from 'react';
import type { BirthProfile } from '../../types/zwtsp.ts';
import { supabase, isSupabaseConfigured } from '../supabase.ts';

export const DEFAULT_USER_PROFILE: BirthProfile = {
  name: '李知命',
  gender: 'male',
  birthDate: '1990-05-18',
  birthTime: '09:30:00', // 巳时
  birthTimePrecision: 'EXACT',
  birthPlace: '浙江杭州',
  timezone: 'Asia/Shanghai',
  calendarType: 'gregorian',
};

const STORAGE_KEY = 'zwtsp_user_birth_profile';
const PROFILE_UPDATE_EVENT = 'zwtsp_profile_updated';

/**
 * Retrieves the stored user birth profile from browser localStorage
 * with fallback to the default profile.
 */
export function getStoredUserProfile(): BirthProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_PROFILE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.birthDate === 'string') {
      return {
        ...DEFAULT_USER_PROFILE,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('[UserProfileStore] Failed to parse stored profile, using default', err);
  }
  return DEFAULT_USER_PROFILE;
}

/**
 * Saves updated user birth profile to localStorage and notifies listeners
 */
export function saveStoredUserProfile(profile: BirthProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATE_EVENT, { detail: profile }));
  } catch (err) {
    console.error('[UserProfileStore] Failed to save profile to localStorage', err);
  }
}

/**
 * React hook that subscribes to user profile changes across all components/pages
 * and syncs automatically with Supabase cloud database when logged in.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<BirthProfile>(DEFAULT_USER_PROFILE);
  const [isReady, setIsReady] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. Initial load from local storage
  useEffect(() => {
    setProfile(getStoredUserProfile());
    setIsReady(true);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BirthProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getStoredUserProfile());
      }
    };

    window.addEventListener(PROFILE_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROFILE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // 2. Cloud sync listener with Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const syncCloudProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data && !error) {
          const cloudProfile: BirthProfile = {
            name: data.name || '命主',
            gender: data.gender || 'male',
            birthDate: data.birth_date || '1990-05-18',
            birthTime: data.birth_time || '14:30:00',
            birthPlace: data.birth_place || 'Kuala Lumpur',
            timezone: data.timezone || 'Asia/Kuala_Lumpur',
            calendarType: data.calendar_type || 'gregorian',
            birthTimePrecision: 'EXACT',
          };
          setProfile(cloudProfile);
          saveStoredUserProfile(cloudProfile);
          setIsCloudSynced(true);
        } else if (error && error.code !== 'PGRST116') {
          console.warn('[UserProfileStore] Cloud sync read error:', error);
        }
      } catch (err) {
        console.warn('[UserProfileStore] Cloud profile fetch error:', err);
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
        syncCloudProfile(session.user.id);
      } else {
        setCurrentUserId(null);
        setIsCloudSynced(false);
      }
    });

    // Listen for auth transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
        syncCloudProfile(session.user.id);
      } else {
        setCurrentUserId(null);
        setIsCloudSynced(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Update profile handler (writes to local storage + Supabase if authenticated)
  const updateProfile = useCallback(
    async (newProfile: BirthProfile) => {
      setProfile(newProfile);
      saveStoredUserProfile(newProfile);

      if (isSupabaseConfigured && currentUserId) {
        try {
          const { error } = await supabase.from('user_profiles').upsert(
            {
              id: currentUserId,
              name: newProfile.name,
              gender: newProfile.gender,
              birth_date: newProfile.birthDate,
              birth_time: newProfile.birthTime,
              birth_place: newProfile.birthPlace,
              timezone: newProfile.timezone,
              calendar_type: newProfile.calendarType,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

          if (!error) {
            setIsCloudSynced(true);
          } else {
            console.warn('[UserProfileStore] Failed to write profile to Supabase:', error);
            setIsCloudSynced(false);
          }
        } catch (err) {
          console.error('[UserProfileStore] Cloud write exception:', err);
          setIsCloudSynced(false);
        }
      }
    },
    [currentUserId]
  );

  return { profile, updateProfile, isReady, isCloudSynced, currentUserId };
}
