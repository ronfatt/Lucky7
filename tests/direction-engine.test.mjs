import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getSectorFromAzimuth,
  normalizeAzimuth,
  DIRECTION_SECTORS,
  evaluateElementAffinityScore,
} from '../lib/directions/direction-models.ts';
import { PersonalDirectionEngine } from '../lib/directions/personal-direction-engine.ts';
import { DailyDirectionEngine } from '../lib/directions/daily-direction-engine.ts';
import { SpatialNumberMatrix } from '../lib/directions/spatial-number-matrix.ts';
import { FourPillarsEngine } from '../lib/engines/four-pillars/four-pillars-engine.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { PersonalNumberDNAEngine } from '../lib/engines/personal-dna/personal-dna-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Direction Engine - Boundary Angles & Azimuth Normalization', () => {
  const fixturePath = path.join(__dirname, 'fixtures', 'direction', 'synthetic-directions.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  for (const item of fixture.boundaryAngles) {
    const sector = getSectorFromAzimuth(item.input);
    assert.equal(
      sector.code,
      item.expectedSector,
      `Azimuth ${item.input} should resolve to ${item.expectedSector}, but got ${sector.code}`
    );
  }

  assert.equal(normalizeAzimuth(0), 0);
  assert.equal(normalizeAzimuth(360), 0);
  assert.equal(normalizeAzimuth(-90), 270);
  assert.equal(normalizeAzimuth(450), 90);
});

test('Direction Engine - Five Element Affinity Scores', () => {
  // Wood generates Fire -> 95
  assert.equal(evaluateElementAffinityScore('Wood', 'Fire'), 95);
  // Same elements -> 85
  assert.equal(evaluateElementAffinityScore('Water', 'Water'), 85);
  // Wood controls Earth -> 48
  assert.equal(evaluateElementAffinityScore('Wood', 'Earth'), 48);
  // Earth controlled by Wood -> 30
  assert.equal(evaluateElementAffinityScore('Earth', 'Wood'), 30);
});

test('Direction Engine - Personal Direction Profile Calculation', () => {
  const profile = {
    name: '测试甲男',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '14:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };
  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const ziweiChart = ZiWeiEngine.generateChart(profile);
  const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);

  const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
    fourPillars,
    ziweiChart,
    personalDNA
  );

  assert.ok(personalDirections.bestDirection);
  assert.ok(personalDirections.secondaryDirection);
  assert.ok(personalDirections.weakDirection);
  assert.notEqual(personalDirections.bestDirection, personalDirections.weakDirection);

  const scores = Object.values(personalDirections.directionScores);
  assert.equal(scores.length, 8);

  // Check ranks 1 through 8 are strictly present
  const ranks = scores.map((s) => s.rank).sort((a, b) => a - b);
  assert.deepEqual(ranks, [1, 2, 3, 4, 5, 6, 7, 8]);

  // Scores should be between 0 and 100
  for (const s of scores) {
    assert.ok(s.score >= 0 && s.score <= 100, `Score ${s.score} out of bounds`);
    assert.ok(s.trace.length >= 7, 'Must have at least 7 trace steps');
  }
});

test('Direction Engine - Spatial Number Matrix 8x10 Generation', () => {
  const matrix = SpatialNumberMatrix.buildMatrix();
  const dirKeys = Object.keys(matrix);
  assert.equal(dirKeys.length, 8);

  for (const dir of dirKeys) {
    const digits = Object.keys(matrix[dir]);
    assert.equal(digits.length, 10);
    for (let d = 0; d <= 9; d++) {
      const score = matrix[dir][d];
      assert.ok(score >= 10 && score <= 99);
    }

    const top3 = SpatialNumberMatrix.getTopDigitsForDirection(matrix, dir, 3);
    assert.equal(top3.length, 3);
    assert.ok(matrix[dir][top3[0]] >= matrix[dir][top3[1]]);
    assert.ok(matrix[dir][top3[1]] >= matrix[dir][top3[2]]);
  }
});

test('Direction Engine - Daily Direction Calculation & Contested Flag', () => {
  const profile = {
    name: '测试乙女',
    gender: 'female',
    birthDate: '1988-11-08',
    birthTime: '08:15:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };
  const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
  const ziweiChart = ZiWeiEngine.generateChart(profile);
  const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);
  const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
    fourPillars,
    ziweiChart,
    personalDNA
  );

  const testDate = '2026-09-13';
  const dailySig = DailyEngine.generateDailySignature(testDate);
  const dailyPalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
  const dailyDigits = DailyEngine.activateNumbers(personalDNA, dailyPalaces, dailySig);

  const dailyDirResult = DailyDirectionEngine.calculateDailyDirections(
    testDate,
    personalDirections,
    dailySig,
    dailyDigits,
    dailyPalaces
  );

  assert.equal(dailyDirResult.date, testDate);
  assert.ok(dailyDirResult.topDirection);
  assert.ok(dailyDirResult.secondaryDirection);
  assert.ok(dailyDirResult.leastDirection);
  assert.ok(dailyDirResult.confidenceScore >= 60 && dailyDirResult.confidenceScore <= 100);
  assert.ok(dailyDirResult.consistencyScore >= 50 && dailyDirResult.consistencyScore <= 100);

  const scores = Object.values(dailyDirResult.directionScores);
  assert.equal(scores.length, 8);

  const top1 = dailyDirResult.directionScores[dailyDirResult.topDirection];
  const top2 = dailyDirResult.directionScores[dailyDirResult.secondaryDirection];
  const diff = top1.score - top2.score;

  if (diff <= 2.0) {
    assert.equal(dailyDirResult.isContested, true);
    assert.ok(dailyDirResult.contestedReason);
  } else {
    assert.equal(dailyDirResult.isContested, false);
  }
});
