import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DrawImportEngine } from '../lib/backtest/draw-import-engine.ts';
import { ModelPerformanceEngine } from '../lib/backtest/model-performance-engine.ts';
import { AntiLookaheadGuard } from '../lib/backtest/anti-lookahead-guard.ts';
import { UniformRandomBaseline } from '../lib/backtest/uniform-random-baseline.ts';
import { BacktestEngine } from '../lib/backtest/backtest-engine.ts';
import { AblationEngine } from '../lib/backtest/ablation-engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Backtest Engine - Draw Import Validation & Parsing', () => {
  const fixturePath = path.join(__dirname, 'fixtures', 'backtest', 'historical-draws.json');
  const rawData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  const imported = DrawImportEngine.importDraws(rawData, 'GAME_4D');
  assert.equal(imported.length, 8);
  for (const draw of imported) {
    assert.equal(draw.digits.length, 4);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(draw.drawDate));
    assert.equal(draw.verified, true);
  }
});

test('Backtest Engine - Hit Definition Verification (Exact, Position, Digit Set, Partial)', () => {
  // Case 1: Exact Match (5729 vs 5729)
  const eval1 = ModelPerformanceEngine.evaluateDraw(
    'draw-1',
    '2026-09-01',
    '5729',
    '5729',
    ['5729', '1234', '8888']
  );
  assert.equal(eval1.exactMatch, true);
  assert.equal(eval1.positionMatches, 4);
  assert.equal(eval1.digitSetMatch, true);
  assert.equal(eval1.rankOfActual, 1);

  // Case 2: Unordered Set Match (5729 vs 5279)
  const eval2 = ModelPerformanceEngine.evaluateDraw(
    'draw-2',
    '2026-09-02',
    '5279',
    '5729',
    ['5729']
  );
  assert.equal(eval2.exactMatch, false);
  assert.equal(eval2.digitSetMatch, true);
  assert.equal(eval2.positionMatches, 2); // '5' and '9' match at index 0 and 3

  // Case 3: Partial Hits (5729 vs 7752) -> hits 5, 7, 2 (3 unique digits)
  const eval3 = ModelPerformanceEngine.evaluateDraw(
    'draw-3',
    '2026-09-03',
    '7752',
    '5729',
    ['5729']
  );
  assert.equal(eval3.partialDigitHits, 3);
});

test('Backtest Engine - Critical Anti-Lookahead Leakage Guard', () => {
  const drawDate = '2026-09-01';
  const drawTime = '19:00:00';

  const mockSignals = [
    {
      id: 'sig-valid',
      signalType: 'VEHICLE_PLATE',
      rawValue: '5729',
      normalizedDigits: [5, 7, 2, 9],
      normalizedLetters: [],
      numericValue: '5729',
      digitCount: 4,
      observationTime: '15:30:00',
      createdAt: '2026-09-01T15:30:00Z',
    },
    {
      id: 'sig-future-leak',
      signalType: 'VEHICLE_PLATE',
      rawValue: '9999',
      normalizedDigits: [9, 9, 9, 9],
      normalizedLetters: [],
      numericValue: '9999',
      digitCount: 4,
      observationTime: '21:30:00', // After draw at 19:00:00!
      createdAt: '2026-09-01T21:30:00Z',
    },
    {
      id: 'sig-future-next-day',
      signalType: 'VEHICLE_PLATE',
      rawValue: '8888',
      normalizedDigits: [8, 8, 8, 8],
      normalizedLetters: [],
      numericValue: '8888',
      digitCount: 4,
      observationTime: '10:00:00',
      createdAt: '2026-09-02T10:00:00Z', // Next day!
    },
  ];

  const filtered = AntiLookaheadGuard.filterSignalsBeforeDraw(
    mockSignals,
    drawDate,
    drawTime
  );

  // Must only retain the signal prior to 19:00 on 2026-09-01
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'sig-valid');
});

test('Backtest Engine - Reproducible Fixed-Seed Random Baseline', () => {
  const base1 = UniformRandomBaseline.generateCandidates(20, 20260913);
  const base2 = UniformRandomBaseline.generateCandidates(20, 20260913);
  const base3 = UniformRandomBaseline.generateCandidates(20, 99999999);

  assert.deepEqual(base1, base2, 'Fixed seed must produce identical baseline');
  assert.notDeepEqual(base1, base3, 'Different seed produces different baseline');
  assert.equal(base1.length, 20);
});

test('Backtest Engine - Walk-Forward Simulation and Ablation Comparison', () => {
  const fixturePath = path.join(__dirname, 'fixtures', 'backtest', 'historical-draws.json');
  const rawData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const draws = DrawImportEngine.importDraws(rawData, 'GAME_4D');

  const profile = {
    name: '李知命',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };

  // Run walk-forward backtest
  const summary = BacktestEngine.runBacktest(profile, draws, []);
  assert.equal(summary.sampleSize, 8);
  assert.equal(summary.evaluations.length, 8);
  assert.ok(summary.avgDigitHits >= 0 && summary.avgDigitHits <= 4);

  // Run ablation comparison
  const ablation = AblationEngine.runAblation(profile, draws, []);
  assert.ok(ablation.length >= 4);
  assert.ok(ablation.some((a) => a.modelName.includes('Full Model')));
  assert.ok(ablation.some((a) => a.modelName.includes('Uniform Random')));
});
