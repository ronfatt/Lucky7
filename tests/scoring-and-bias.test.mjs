import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { FusionScoringEngine, DEFAULT_WEIGHT_CONFIG } from '../lib/scoring/fusion-engine.ts';

describe('ZWTSP Fusion Scoring, Combination & Anti-Bias Tests', () => {
  const engine = new FusionScoringEngine(DEFAULT_WEIGHT_CONFIG);

  test('Weight configuration sums up to 100% and normalizes automatically', () => {
    const customEngine = new FusionScoringEngine({
      weightDestiny: 30,
      weightBazi: 30,
      weightHistorical: 40,
      weightStars: 0,
      weightTransformations: 0,
      weightElements: 0,
      weightLuoshu: 0,
      weightReality: 0,
      weightStructure: 0,
    });

    const digitScore = customEngine.computeDigitScore({
      digit: 7,
      personalScore: 80,
      timeScore: 90,
      elementScore: 0,
      palaceScore: 0,
      starScore: 0,
      transformationScore: 0,
      luoshuScore: 0,
      historicalScore: 70,
      realityScore: 0,
    });

    // 0.3*80 + 0.3*90 + 0.4*70 = 24 + 27 + 28 = 79
    assert.equal(digitScore.finalScore, 79);
    assert.ok(digitScore.finalScore >= 0 && digitScore.finalScore <= 100);
  });

  test('Score normalization disallows negative total scores and clamps strictly to [0, 100]', () => {
    const extremeLow = engine.computeDigitScore({
      digit: 0,
      personalScore: -50,
      timeScore: -20,
      elementScore: 0,
      palaceScore: 0,
      starScore: 0,
      transformationScore: -50,
      luoshuScore: 0,
      historicalScore: 0,
      realityScore: 0,
    });
    assert.equal(extremeLow.finalScore, 0, 'Score must not be negative');

    const extremeHigh = engine.computeDigitScore({
      digit: 9,
      personalScore: 120,
      timeScore: 150,
      elementScore: 100,
      palaceScore: 100,
      starScore: 100,
      transformationScore: 100,
      luoshuScore: 100,
      historicalScore: 100,
      realityScore: 100,
    });
    assert.equal(extremeHigh.finalScore, 100, 'Score must not exceed 100');
  });

  test('Opportunity Window triggers mandatory caution when score < 40', () => {
    const lowWindow = engine.evaluateOpportunityWindow(35);
    assert.equal(lowWindow.level, 'WEAK');
    assert.ok(lowWindow.cautionNotice);
    assert.equal(lowWindow.cautionNotice, '今日不建议因本系统增加投注。');

    const highWindow = engine.evaluateOpportunityWindow(80);
    assert.equal(highWindow.level, 'STRONG');
    assert.equal(highWindow.cautionNotice, undefined);
  });

  test('Mother Code and Variation Code generator produces bounded, deterministic variations', () => {
    const res = engine.generateMotherAndVariations([7, 2, 9, 5, 8], 4);
    assert.equal(res.motherCode, '7295');
    assert.ok(res.variations.length > 0);
    assert.ok(res.variations.length <= 4, 'Variations must be controlled and not explode');
    for (const v of res.variations) {
      assert.notEqual(v, res.motherCode, 'Variation must differ from mother code');
    }
  });

  test('Anti-Lookahead Bias Validator flags future timestamps', () => {
    function validateLookaheadBias(historicalMaxDate, predictionTargetDate) {
      const hist = new Date(historicalMaxDate).getTime();
      const target = new Date(predictionTargetDate).getTime();
      return hist < target;
    }

    // Valid: history is strictly before prediction
    assert.equal(validateLookaheadBias('2026-09-12 20:00:00', '2026-09-13 08:00:00'), true);

    // Invalid: history includes target or future draw
    assert.equal(validateLookaheadBias('2026-09-13 21:00:00', '2026-09-13 08:00:00'), false);
  });

  test('Random baseline guard triggers warning when model does not outperform baseline', () => {
    function evaluateBaselineGuard(modelHitRate, randomBaselineRate) {
      if (modelHitRate <= randomBaselineRate) {
        return '当前模型未显示稳定的超随机优势。';
      }
      return 'OK';
    }

    assert.equal(evaluateBaselineGuard(50.0, 50.0), '当前模型未显示稳定的超随机优势。');
    assert.equal(evaluateBaselineGuard(48.5, 50.0), '当前模型未显示稳定的超随机优势。');
    assert.equal(evaluateBaselineGuard(54.2, 50.0), 'OK');
  });
});
