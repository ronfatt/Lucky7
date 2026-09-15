'use client';

import React from 'react';
import { DailyDashboardView } from '@/components/daily/DailyDashboardView';
import type { BirthProfile } from '@/types/zwtsp';

const DEFAULT_PROFILE: BirthProfile = {
  name: '李知命 (示范档案)',
  gender: 'male',
  birthDate: '1990-05-18',
  birthTime: '09:30:00',
  birthTimePrecision: 'EXACT',
  birthPlace: '浙江杭州',
  timezone: 'Asia/Shanghai',
  calendarType: 'gregorian',
};

export default function TodayPage() {
  return <DailyDashboardView profile={DEFAULT_PROFILE} />;
}
