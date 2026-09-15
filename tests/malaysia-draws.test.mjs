// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Malaysian Lottery Operator Tests
// File: tests/malaysia-draws.test.mjs
// ==========================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { MalaysiaLotteryProvider } from '../lib/lottery/malaysia-provider.ts';
import { LotteryPatternEngine } from '../lib/lottery/lottery-pattern-engine.ts';
import { DrawImportEngine } from '../lib/backtest/draw-import-engine.ts';
import { ModelPerformanceEngine } from '../lib/backtest/model-performance-engine.ts';
import { BacktestEngine } from '../lib/backtest/backtest-engine.ts';

test('MalaysiaLotteryProvider - Retrieves operator draws with 23 prizes', () => {
  const allDraws = MalaysiaLotteryProvider.getDraws('ALL');
  assert.ok(allDraws.length >= 9, 'Should have at least 9 verified historical Malaysian draws');

  const magnumDraws = MalaysiaLotteryProvider.getDraws('MAGNUM');
  assert.ok(magnumDraws.length > 0, 'Should have Magnum draws');
  magnumDraws.forEach((d) => {
    assert.equal(d.operator, 'MAGNUM');
    assert.equal(d.allWinningNumbers.length, 23, 'Every Malaysian draw must have 23 winning numbers');
    assert.ok(/^\d{4}$/.test(d.firstPrize));
    assert.ok(/^\d{4}$/.test(d.secondPrize));
    assert.ok(/^\d{4}$/.test(d.thirdPrize));
    assert.equal(d.specialPrizes.length, 10);
    assert.equal(d.consolationPrizes.length, 10);
  });

  const damacaiDraws = MalaysiaLotteryProvider.getDraws('DAMACAI');
  assert.ok(damacaiDraws.length > 0, 'Should have DaMaCai draws');

  const totoDraws = MalaysiaLotteryProvider.getDraws('TOTO');
  assert.ok(totoDraws.length > 0, 'Should have Sports Toto draws');
});

test('MalaysiaLotteryProvider - Finds prize tier hits accurately', () => {
  // '5729' is verified to have hits across multiple operators:
  // - Magnum: 2026-09-13 (1st Prize), 2026-09-06 (Special)
  // - DaMaCai: 2026-09-12 (2nd Prize)
  // - Toto: 2026-09-09 (1st Prize), 2026-09-06 (Consolation)
  const hits = MalaysiaLotteryProvider.findNumberHits('5729', 'ALL');
  assert.ok(hits.length >= 4, `5729 should have multiple historical hits, got ${hits.length}`);

  const hasFirstPrize = hits.some((h) => h.tier === 'FIRST');
  const hasSecondPrize = hits.some((h) => h.tier === 'SECOND');
  const hasSpecial = hits.some((h) => h.tier === 'SPECIAL');
  const hasConsolation = hits.some((h) => h.tier === 'CONSOLATION');

  assert.ok(hasFirstPrize, 'Should detect 1st prize hits');
  assert.ok(hasSecondPrize, 'Should detect 2nd prize hits');
  assert.ok(hasSpecial, 'Should detect Special prize hits');
  assert.ok(hasConsolation, 'Should detect Consolation prize hits');
});

test('LotteryPatternEngine - Computes accurate numerology, elements, and frequency statistics', () => {
  const analysis = LotteryPatternEngine.analyzePattern('5729', 'ALL');

  assert.equal(analysis.targetNumber, '5729');
  assert.ok(analysis.totalHits > 0);
  assert.equal(analysis.sum, 5 + 7 + 2 + 9); // 23
  assert.equal(analysis.digitalRoot, 5); // 2+3 = 5 (五黄中宫土)
  assert.equal(analysis.parityRatio, '3奇1偶'); // 5,7,9 are odd, 2 is even
  assert.equal(analysis.sizeRatio, '3大1小'); // 5,7,9 >= 5, 2 < 5
  assert.equal(analysis.leadingDigit, 5);
  assert.equal(analysis.trailingDigit, 9);
  assert.ok(analysis.primaryElement);
  assert.ok(analysis.hotColdStatus);

  const summary = LotteryPatternEngine.generatePatternSummary(analysis);
  assert.ok(summary.includes('5729'));
  assert.ok(summary.includes('和值23'));
  assert.ok(summary.includes('九宫合数5'));
});

test('DrawImportEngine - Imports Malaysian multi-prize records', () => {
  const rawInput = [
    {
      operator: 'MAGNUM',
      drawDate: '2026-09-15',
      drawNo: '649/26',
      firstPrize: '8123',
      secondPrize: '4567',
      thirdPrize: '0981',
      specialPrizes: ['1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '0000'],
      consolationPrizes: ['1212', '2323', '3434', '4545', '5656', '6767', '7878', '8989', '9090', '0101'],
    },
  ];

  const imported = DrawImportEngine.importDraws(rawInput);
  assert.equal(imported.length, 1);
  assert.equal(imported[0].operator, 'MAGNUM');
  assert.equal(imported[0].firstPrize, '8123');
  assert.equal(imported[0].secondPrize, '4567');
  assert.equal(imported[0].thirdPrize, '0981');
  assert.equal(imported[0].allWinningNumbers.length, 23);
});

test('ModelPerformanceEngine - Evaluates Malaysian 23-prize hit tiers', () => {
  const mockDraw = {
    id: 'draw-test',
    gameProfileId: 'MAGNUM_4D',
    operator: 'MAGNUM',
    drawNo: '100/26',
    drawDate: '2026-09-13',
    drawTime: '19:00:00',
    timezone: 'Asia/Kuala_Lumpur',
    resultNumber: '5729',
    digits: [5, 7, 2, 9],
    firstPrize: '5729',
    secondPrize: '1842',
    thirdPrize: '9301',
    specialPrizes: ['0234', '1589'],
    consolationPrizes: ['0712'],
    allWinningNumbers: ['5729', '1842', '9301', '0234', '1589', '0712'],
    source: 'test',
    verified: true,
    createdAt: '',
  };

  // Case A: Candidate matches 1st prize
  const eval1 = ModelPerformanceEngine.evaluateDraw(
    mockDraw.id,
    mockDraw.drawDate,
    mockDraw.resultNumber,
    '5729',
    ['5729', '1111', '2222'],
    mockDraw
  );
  assert.equal(eval1.exactMatch, true);
  assert.equal(eval1.top3Hit, true);
  assert.equal(eval1.all23Hit, true);
  assert.equal(eval1.winningTier, 'FIRST');

  // Case B: Candidate matches 2nd prize
  const eval2 = ModelPerformanceEngine.evaluateDraw(
    mockDraw.id,
    mockDraw.drawDate,
    mockDraw.resultNumber,
    '0000',
    ['1842', '1111'],
    mockDraw
  );
  assert.equal(eval2.exactMatch, false);
  assert.equal(eval2.top3Hit, true);
  assert.equal(eval2.all23Hit, true);
  assert.equal(eval2.winningTier, 'SECOND');

  // Case C: Candidate matches Special prize
  const eval3 = ModelPerformanceEngine.evaluateDraw(
    mockDraw.id,
    mockDraw.drawDate,
    mockDraw.resultNumber,
    '0000',
    ['0234', '9999'],
    mockDraw
  );
  assert.equal(eval3.exactMatch, false);
  assert.equal(eval3.top3Hit, false);
  assert.equal(eval3.all23Hit, true);
  assert.equal(eval3.winningTier, 'SPECIAL');
});

test('BacktestEngine - Runs walk-forward simulation across Malaysian operators', () => {
  const profile = {
    name: '李知命 (回测档案)',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00',
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Kuala_Lumpur',
    calendarType: 'gregorian',
  };

  const magnumDraws = MalaysiaLotteryProvider.getDraws('MAGNUM');
  const summary = BacktestEngine.runBacktest(profile, magnumDraws);

  assert.equal(summary.sampleSize, magnumDraws.length);
  assert.ok(typeof summary.top3HitRate === 'number');
  assert.ok(typeof summary.full23HitRate === 'number');
  assert.ok(summary.evaluations.length === magnumDraws.length);
});

test('MalaysiaLotteryProvider - Ingests and queries East Malaysia & Singapore operators', () => {
  const operators = MalaysiaLotteryProvider.getOperators();
  const opIds = operators.map((o) => o.id);

  assert.ok(opIds.includes('CASHSWEEP'), 'Must include Sarawak CashSweep');
  assert.ok(opIds.includes('SABAH88'), 'Must include Sabah 88');
  assert.ok(opIds.includes('STC'), 'Must include Sandakan STC');
  assert.ok(opIds.includes('SINGAPORE'), 'Must include Singapore Pools 4D');

  const cashSweepDraws = MalaysiaLotteryProvider.getDraws('CASHSWEEP');
  assert.ok(cashSweepDraws.length > 0, 'Should have Sarawak CashSweep draws');
  assert.equal(cashSweepDraws[0].operator, 'CASHSWEEP');

  const sabahDraws = MalaysiaLotteryProvider.getDraws('SABAH88');
  assert.ok(sabahDraws.length > 0, 'Should have Sabah 88 draws');

  const singaporeDraws = MalaysiaLotteryProvider.getDraws('SINGAPORE');
  assert.ok(singaporeDraws.length > 0, 'Should have Singapore Pools draws');
});

test('MalaysiaLotteryProvider - Retrieves nearest historical matches up to 100 records (Direct & Permutation)', () => {
  const recentMatches100 = MalaysiaLotteryProvider.getRecentMatchesForNumber('5729', 100, 'ALL');

  assert.ok(recentMatches100.length > 0, 'Should retrieve historical matches for 5729');
  assert.ok(recentMatches100.length <= 100, 'Must be capped at 100');

  // Verify fields in each match
  for (const match of recentMatches100) {
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(match.drawDate), 'Valid drawDate format');
    assert.ok(match.drawNo, 'Has drawNo');
    assert.ok(match.operator, 'Has operator');
    assert.ok(match.operatorNameZh, 'Has operatorNameZh');
    assert.ok(match.tier, 'Has prize tier');
    assert.ok(['DIRECT', 'PERMUTATION'].includes(match.matchType));
    assert.ok(typeof match.daysAgo === 'number');
  }

  // Matches should be sorted descending by draw date
  for (let i = 0; i < recentMatches100.length - 1; i++) {
    assert.ok(
      recentMatches100[i].drawDate >= recentMatches100[i + 1].drawDate,
      'Matches must be sorted descending by draw date'
    );
  }
});

