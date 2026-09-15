import { NextResponse } from 'next/server';
import { DrawImportEngine, type RawDrawInput } from '@/lib/backtest/draw-import-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawDraws: RawDrawInput[] = Array.isArray(body) ? body : body.draws || [];

    const imported = DrawImportEngine.importDraws(rawDraws, body.gameProfileId || 'GAME_4D');

    return NextResponse.json({
      success: true,
      count: imported.length,
      imported,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
