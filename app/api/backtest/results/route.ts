import { NextResponse } from 'next/server';
import type { BirthProfile } from '@/types/zwtsp';
import { DrawImportEngine } from '@/lib/backtest/draw-import-engine';
import { BacktestEngine } from '@/lib/backtest/backtest-engine';
import { AblationEngine } from '@/lib/backtest/ablation-engine';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  try {
    const fixturePath = path.join(process.cwd(), 'tests', 'fixtures', 'backtest', 'historical-draws.json');
    const rawData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const draws = DrawImportEngine.importDraws(rawData, 'GAME_4D');

    const profile: BirthProfile = {
      name: '李知命 (示范档案)',
      gender: 'male',
      birthDate: '1990-05-18',
      birthTime: '09:30:00',
      birthTimePrecision: 'EXACT',
      timezone: 'Asia/Shanghai',
      calendarType: 'gregorian',
    };

    const summary = BacktestEngine.runBacktest(profile, draws, []);
    const ablation = AblationEngine.runAblation(profile, draws, []);

    return NextResponse.json({
      success: true,
      summary,
      ablation,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
