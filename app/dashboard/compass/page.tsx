'use client';

import React, { useState } from 'react';
import type { BirthProfile } from '@/types/zwtsp';
import { PersonalLuckCompass } from '@/components/compass/PersonalLuckCompass';

export default function DashboardCompassPage() {
  const [profile] = useState<BirthProfile>({
    name: '李知命 (示范档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    birthPlace: '浙江杭州',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 space-y-6">
      <PersonalLuckCompass profile={profile} initialDate="2026-09-13" defaultMode="daily" />
    </div>
  );
}
