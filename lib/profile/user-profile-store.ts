// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) User Profile Store
// File: lib/profile/user-profile-store.ts
// ==========================================================

import { useState, useEffect } from 'react';
import type { BirthProfile } from '../../types/zwtsp.ts';

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
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<BirthProfile>(DEFAULT_USER_PROFILE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
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

  const updateProfile = (newProfile: BirthProfile) => {
    setProfile(newProfile);
    saveStoredUserProfile(newProfile);
  };

  return { profile, updateProfile, isReady };
}
