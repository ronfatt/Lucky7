import { NextResponse } from 'next/server';
import type { BirthProfile } from '@/types/zwtsp';
import { FourPillarsEngine } from '@/lib/engines/four-pillars/four-pillars-engine';
import { ZiWeiEngine } from '@/lib/engines/ziwei/ziwei-engine';
import { PersonalNumberDNAEngine } from '@/lib/engines/personal-dna/personal-dna-engine';
import { DailyEngine } from '@/lib/engines/daily/daily-engine';
import { PersonalDirectionEngine } from '@/lib/directions/personal-direction-engine';
import { DailyDirectionEngine } from '@/lib/directions/daily-direction-engine';
import { RealitySignalStore } from '@/lib/signals/reality-signal-store';
import { DigitFeatureVectorEngine } from '@/lib/synthesis/digit-feature-vector-engine';
import { CandidateGenerationEngine } from '@/lib/synthesis/candidate-generation-engine';
import { getRealtimeDate } from '@/lib/utils/date-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || getRealtimeDate();
  const limit = Math.min(50, Math.max(5, Number(searchParams.get('limit')) || 20));

  const profile: BirthProfile = {
    name: '李知命 (示范档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };

  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const ziweiChart = ZiWeiEngine.generateChart(profile);
  const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);

  const dailySig = DailyEngine.generateDailySignature(dateStr, profile.timezone);
  const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
  const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);

  const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
    fourPillars,
    ziweiChart,
    personalDNA
  );
  const dailyDirection = DailyDirectionEngine.calculateDailyDirections(
    dateStr,
    personalDirections,
    dailySig,
    activeNumbers,
    activePalaces
  );

  const realitySignals = RealitySignalStore.getSignals();

  const vectors = DigitFeatureVectorEngine.computeVectors(
    personalDNA,
    activeNumbers,
    dailyDirection,
    realitySignals,
    dailySig.dominantElement
  );

  const candidates = CandidateGenerationEngine.generateCandidates(
    vectors,
    personalDNA,
    activeNumbers,
    dailyDirection,
    realitySignals,
    limit
  );

  return NextResponse.json({
    success: true,
    count: candidates.length,
    candidates,
  });
}
