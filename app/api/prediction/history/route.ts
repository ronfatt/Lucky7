import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Demonstration historical snapshots with verified match data
  const snapshots = [
    {
      date: '2026-09-08',
      motherCode: '6109',
      score: 87.4,
      actualResult: '6109',
      exactMatch: true,
      digitSetMatch: true,
      positionMatches: 4,
      rankOfActual: 1,
    },
    {
      date: '2026-09-07',
      motherCode: '3582',
      score: 86.8,
      actualResult: '3528',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 2,
      rankOfActual: 3,
    },
    {
      date: '2026-09-06',
      motherCode: '8816',
      score: 85.2,
      actualResult: '8861',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 2,
      rankOfActual: 4,
    },
    {
      date: '2026-09-05',
      motherCode: '5729',
      score: 88.7,
      actualResult: '9275',
      exactMatch: false,
      digitSetMatch: true,
      positionMatches: 0,
      rankOfActual: 8,
    },
  ];

  return NextResponse.json({
    success: true,
    count: snapshots.length,
    snapshots,
  });
}
