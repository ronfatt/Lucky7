// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Admin User Deep-Dive Detail API
// File: app/api/admin/analytics/user-detail/route.ts
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { localLogBuffer } from '@/lib/telemetry/log-buffer';
import { CalendarConversionEngine } from '@/lib/engines/calendar/calendar-engine';
import { SolarTermEngine } from '@/lib/engines/calendar/solar-terms';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import type { BirthProfile } from '@/types/zwtsp';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email')?.toLowerCase();

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: '缺少用户标识 userId 或 email' }, { status: 400 });
    }

    // 1. Fetch User Profile
    let profile: any = null;
    try {
      let query = supabaseAdmin.from('user_profiles').select('*');
      if (userId) query = query.eq('id', userId);
      else if (email) query = query.ilike('email', email);
      const { data } = await query.maybeSingle();
      profile = data;
    } catch {}

    // Calculate Metaphysics Dossier (BaZi, Lunar, SolarTerm, ZiWei, PersonalDNA)
    let metaphysics: any = null;
    if (profile?.birth_date) {
      try {
        const birthDate = profile.birth_date;
        const birthTime = profile.birth_time || '12:00:00';
        const isHourKnown = Boolean(profile.birth_time);
        const gender = profile.gender || 'male';

        const birthProfile: BirthProfile = {
          name: profile.name || '命主',
          gender,
          birthDate,
          birthTime,
          birthTimePrecision: isHourKnown ? 'EXACT' : 'APPROXIMATE',
          timezone: profile.timezone || 'Asia/Kuala_Lumpur',
          calendarType: 'gregorian',
        };

        const fourPillars = CalendarConversionEngine.getFourPillars(birthDate, birthTime, isHourKnown);
        const lunar = CalendarConversionEngine.toLunarDate(birthDate);
        const solarTerm = SolarTermEngine.getSolarTermInfo(birthDate);
        const solarLon = CalendarConversionEngine.getSolarLongitude(
          parseInt(birthDate.slice(0, 4), 10),
          parseInt(birthDate.slice(5, 7), 10),
          parseInt(birthDate.slice(8, 10), 10),
          isHourKnown ? parseInt(birthTime.slice(0, 2), 10) : 12
        );
        const ziwei = ZiWeiEngine.generateChart(birthProfile);
        const personalDna = PersonalNumberDNAEngine.generateDNA(birthProfile);

        metaphysics = {
          fourPillars: {
            year: `${fourPillars.yearStem}${fourPillars.yearBranch}`,
            month: `${fourPillars.monthStem}${fourPillars.monthBranch}`,
            day: `${fourPillars.dayStem}${fourPillars.dayBranch}`,
            hour: fourPillars.hourStem && fourPillars.hourBranch ? `${fourPillars.hourStem}${fourPillars.hourBranch}` : '未知',
            yearStem: fourPillars.yearStem,
            yearBranch: fourPillars.yearBranch,
            monthStem: fourPillars.monthStem,
            monthBranch: fourPillars.monthBranch,
            dayStem: fourPillars.dayStem,
            dayBranch: fourPillars.dayBranch,
            hourStem: fourPillars.hourStem,
            hourBranch: fourPillars.hourBranch,
            yearElement: fourPillars.yearElement,
            monthElement: fourPillars.monthElement,
            dayElement: fourPillars.dayElement,
            hourElement: fourPillars.hourElement,
            dayMaster: fourPillars.dayMaster,
            dayMasterElement: fourPillars.dayMasterElement,
            elementDistribution: fourPillars.elementDistribution,
          },
          lunar: {
            lunarYear: lunar.lunarYear,
            lunarMonth: lunar.lunarMonth,
            lunarDay: lunar.lunarDay,
            isLeapMonth: lunar.isLeapMonth,
            lunarString: lunar.lunarString,
          },
          solarTerm: {
            currentTerm: solarTerm.currentTerm,
            solarLongitude: Number(solarLon.toFixed(2)),
            termStartDate: solarTerm.termStartDate,
            termEndDate: solarTerm.termEndDate,
            seasonZh: solarTerm.seasonZh,
          },
          ziwei: {
            bureau: ziwei.bureau,
            lifePalaceBranch: ziwei.lifePalaceBranch,
            lifePalaceStemBranch: ziwei.lifePalaceStemBranch || `${ziwei.lifePalaceBranch}位`,
            bodyPalaceBranch: ziwei.bodyPalaceBranch,
            bodyPalaceStemBranch: ziwei.bodyPalaceStemBranch || `${ziwei.bodyPalaceBranch}位`,
            isComplete: ziwei.isComplete,
            keyPalaces: ziwei.palaces.filter(p => p.isLifePalace || p.palaceName === '财帛宫' || p.palaceName === '官禄宫' || p.palaceName === '迁移宫' || p.isBodyPalace).map(p => ({
              name: p.palaceName,
              branch: p.branch,
              stemBranch: p.stemBranch,
              element: p.element,
              stars: p.stars.map(s => s.starName),
              transformations: p.transformations.map(t => t.label),
            })),
          },
          personalDna: {
            coreNumbers: personalDna.coreNumbers,
            supportNumbers: personalDna.supportNumbers,
            weakNumbers: personalDna.weakNumbers,
            dominantElement: personalDna.dominantElement,
            weakestElement: personalDna.weakestElement,
          }
        };
      } catch (metaErr) {
        console.error('[UserDetailAPI] Metaphysics calculation error:', metaErr);
      }
    }

    // 2. Fetch User's Logs
    let userLogs = localLogBuffer.filter(
      (l) => (userId && l.user_id === userId) || (email && l.user_email?.toLowerCase() === email)
    );

    try {
      let logQuery = supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (userId) logQuery = logQuery.eq('user_id', userId);
      else if (email) logQuery = logQuery.ilike('user_email', email);

      const { data: dbLogs } = await logQuery;
      if (dbLogs && dbLogs.length > 0) {
        const idSet = new Set(userLogs.map((l) => l.id));
        for (const item of dbLogs) {
          if (!idSet.has(item.id)) userLogs.push(item);
        }
      }
    } catch {}

    userLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 3. Fetch User's Saved Predictions
    let savedPredictions: any[] = [];
    if (userId) {
      try {
        const { data: saves } = await supabaseAdmin
          .from('saved_predictions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
        if (saves) savedPredictions = saves;
      } catch {}
    }

    // 4. Fetch User's Ledger
    let ledgerRecords: any[] = [];
    if (userId) {
      try {
        const { data: ledger } = await supabaseAdmin
          .from('prediction_ledger')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(50);
        if (ledger) ledgerRecords = ledger;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        metaphysics,
        activityTimeline: userLogs,
        savedPredictions,
        ledgerRecords,
        stats: {
          totalActions: userLogs.length,
          loginCount: userLogs.filter((l) => l.event_type === 'auth.login').length,
          savedCount: savedPredictions.length,
          ledgerCount: ledgerRecords.length,
        },
      },
    });
  } catch (err: any) {
    console.error('[UserDetailAPI] Error:', err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
