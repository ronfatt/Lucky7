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
import { CandidateScoringEngine } from '@/lib/synthesis/candidate-scoring-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const numberStr = searchParams.get('number') || '5729';
  const dateStr = searchParams.get('date') || '2026-09-13';

  if (!/^\d{4}$/.test(numberStr)) {
    return NextResponse.json(
      { success: false, error: 'Invalid candidate number (must be 4 digits)' },
      { status: 400 }
    );
  }

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

  const digits = numberStr.split('').map(Number);
  const evalRes = CandidateScoringEngine.evaluateCandidate(
    digits,
    vectors,
    personalDNA,
    activeNumbers,
    dailyDirection,
    realitySignals
  );

  return NextResponse.json({
    success: true,
    number: numberStr,
    score: evalRes.score,
    breakdown: evalRes.breakdown,
    trace: evalRes.trace,
  });
}
