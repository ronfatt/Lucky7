import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PersonalNumberDNAEngine } from '../lib/engines/personal-dna/personal-dna-engine.ts';
import { ZiWeiEngine } from '../lib/engines/ziwei/ziwei-engine.ts';
import { DailyEngine } from '../lib/engines/daily/daily-engine.ts';

describe('ZWTSP Personal DNA & Daily Activation Engine Verification', () => {
  const profile = {
    name: '测试甲男',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };

  test('Personal DNA produces complete 0-9 scores and traceable core numbers', () => {
    const dna = PersonalNumberDNAEngine.generateDNA(profile);

    // Verify 0-9 all have non-negative scores
    for (let d = 0; d <= 9; d++) {
      assert.ok(typeof dna.scoresByDigit[d] === 'number');
      assert.ok(dna.scoresByDigit[d] >= 0 && dna.scoresByDigit[d] <= 100);
      assert.ok(dna.tracesByDigit[d]);
      assert.ok(dna.tracesByDigit[d].steps.length > 0);
    }

    assert.equal(dna.coreNumbers.length, 4);
    assert.equal(dna.supportNumbers.length, 3);
    assert.equal(dna.weakNumbers.length, 3);
  });

  test('Calculation is strictly deterministic: identical input generates identical DNA', () => {
    const dna1 = PersonalNumberDNAEngine.generateDNA(profile);
    const dna2 = PersonalNumberDNAEngine.generateDNA(profile);

    assert.deepEqual(dna1.coreNumbers, dna2.coreNumbers);
    assert.deepEqual(dna1.scoresByDigit, dna2.scoresByDigit);
    assert.equal(dna1.dnaScore, dna2.dnaScore);
  });

  test('Daily Activation Engine combines static DNA with dynamic Time Signature', () => {
    const dna = PersonalNumberDNAEngine.generateDNA(profile);
    const chart = ZiWeiEngine.generateChart(profile);
    const dailySig = DailyEngine.generateDailySignature('2026-09-13', 'Asia/Shanghai');

    assert.ok(dailySig.woodScore >= 0 && dailySig.woodScore <= 100);
    assert.ok(dailySig.metalScore >= 0 && dailySig.metalScore <= 100);

    const activePalaces = DailyEngine.activatePalaces(chart, dailySig);
    assert.equal(activePalaces.length, 12);

    const activeNumbers = DailyEngine.activateNumbers(dna, activePalaces, dailySig);
    assert.equal(activeNumbers.length, 10);

    const primaryNumbers = activeNumbers.filter(n => n.classification === 'Primary');
    assert.equal(primaryNumbers.length, 3);

    // Each activated digit has transparent calculation trace
    for (const act of activeNumbers) {
      assert.ok(act.activationScore >= 0 && act.activationScore <= 100);
      assert.ok(act.trace.length >= 4);
    }
  });

  test('Opportunity Score correctly triggers caution guard when < 40', () => {
    const normal = DailyEngine.calculateOpportunityScore(75, 70, []);
    assert.equal(normal.cautionNotice, undefined);

    const low = DailyEngine.calculateOpportunityScore(25, 30, []);
    assert.equal(low.level, 'LOW');
    assert.ok(low.cautionNotice?.includes('今日模型状态偏低'));
  });
});
