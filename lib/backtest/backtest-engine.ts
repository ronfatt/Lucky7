// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Backtest Engine
// File: lib/backtest/backtest-engine.ts
// ==========================================================

import type {
  BacktestDrawEvaluation,
  BacktestMetricsSummary,
  BirthProfile,
  DrawResultRecord,
  RealitySignalRecord,
} from '../../types/zwtsp.ts';
import { FourPillarsEngine } from '../engines/four-pillars/four-pillars-engine.ts';
import { ZiWeiEngine } from '../engines/ziwei/ziwei-engine.ts';
import { PersonalNumberDNAEngine } from '../engines/personal-dna/personal-dna-engine.ts';
import { DailyEngine } from '../engines/daily/daily-engine.ts';
import { PersonalDirectionEngine } from '../directions/personal-direction-engine.ts';
import { DailyDirectionEngine } from '../directions/daily-direction-engine.ts';
import { DigitFeatureVectorEngine } from '../synthesis/digit-feature-vector-engine.ts';
import { CandidateGenerationEngine } from '../synthesis/candidate-generation-engine.ts';
import { MotherCodeEngine } from '../synthesis/mother-code-engine.ts';
import { AntiLookaheadGuard } from './anti-lookahead-guard.ts';
import { ModelPerformanceEngine } from './model-performance-engine.ts';
import { UniformRandomBaseline } from './uniform-random-baseline.ts';

export class BacktestEngine {
  /**
   * Executes a walk-forward historical simulation over historical draws without future data leakage
   */
  public static runBacktest(
    profile: BirthProfile,
    draws: DrawResultRecord[],
    realitySignals: RealitySignalRecord[] = []
  ): BacktestMetricsSummary {
    if (!draws || draws.length === 0) {
      return {
        gameProfileId: 'GAME_4D',
        startDate: '',
        endDate: '',
        sampleSize: 0,
        exactHitCount: 0,
        exactHitRate: 0,
        top5HitRate: 0,
        top10HitRate: 0,
        top20HitRate: 0,
        avgDigitHits: 0,
        avgPositionHits: 0,
        randomBaselineTop5: 0.05,
        randomBaselineExact: 0.01,
        outperformingBaseline: false,
        evaluations: [],
      };
    }

    // Static personal baseline
    const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
    const ziweiChart = ZiWeiEngine.generateChart(profile);
    const personalDNA = PersonalNumberDNAEngine.generateDNA(profile);
    const personalDirections = PersonalDirectionEngine.calculatePersonalDirections(
      fourPillars,
      ziweiChart,
      personalDNA
    );

    const evaluations: BacktestDrawEvaluation[] = [];
    let exactHits = 0;
    let top5Hits = 0;
    let top10Hits = 0;
    let top20Hits = 0;
    let totalDigitHits = 0;
    let totalPosHits = 0;

    for (const draw of draws) {
      // 1. Zero Look-Ahead Guard: filter reality signals strictly prior to draw
      const validSignals = AntiLookaheadGuard.filterSignalsBeforeDraw(
        realitySignals,
        draw.drawDate,
        draw.drawTime
      );

      // 2. Generate daily time & direction for that historical date
      const dailySig = DailyEngine.generateDailySignature(draw.drawDate, profile.timezone);
      const activePalaces = DailyEngine.activatePalaces(ziweiChart, dailySig);
      const activeNumbers = DailyEngine.activateNumbers(personalDNA, activePalaces, dailySig);
      const dailyDirection = DailyDirectionEngine.calculateDailyDirections(
        draw.drawDate,
        personalDirections,
        dailySig,
        activeNumbers,
        activePalaces
      );

      // 3. Compute 0-9 Digit Feature Vectors
      const vectors = DigitFeatureVectorEngine.computeVectors(
        personalDNA,
        activeNumbers,
        dailyDirection,
        validSignals,
        dailySig.dominantElement
      );

      // 4. Generate Top 20 Candidates
      const candidates = CandidateGenerationEngine.generateCandidates(
        vectors,
        personalDNA,
        activeNumbers,
        dailyDirection,
        validSignals,
        20
      );

      const motherCodeResult = MotherCodeEngine.extractMotherCode(candidates);
      const candStrs = candidates.map((c) => c.number);

      // 5. Evaluate Draw
      const evalRes = ModelPerformanceEngine.evaluateDraw(
        draw.id,
        draw.drawDate,
        draw.resultNumber,
        motherCodeResult.motherCode,
        candStrs,
        draw
      );

      evaluations.push(evalRes);

      if (evalRes.exactMatch) exactHits++;
      if (evalRes.rankOfActual && evalRes.rankOfActual <= 5) top5Hits++;
      if (evalRes.rankOfActual && evalRes.rankOfActual <= 10) top10Hits++;
      if (evalRes.rankOfActual && evalRes.rankOfActual <= 20) top20Hits++;

      totalDigitHits += evalRes.partialDigitHits;
      totalPosHits += evalRes.positionMatches;
    }

    const n = draws.length;
    const exactHitRate = Number(((exactHits / n) * 100).toFixed(2));
    const top5HitRate = Number(((top5Hits / n) * 100).toFixed(2));
    const top10HitRate = Number(((top10Hits / n) * 100).toFixed(2));
    const top20HitRate = Number(((top20Hits / n) * 100).toFixed(2));
    const avgDigitHits = Number((totalDigitHits / n).toFixed(2));
    const avgPositionHits = Number((totalPosHits / n).toFixed(2));

    const top3HitCount = evaluations.filter((e) => e.top3Hit).length;
    const top3HitRate = Number(((top3HitCount / n) * 100).toFixed(2));
    const full23HitCount = evaluations.filter((e) => e.all23Hit).length;
    const full23HitRate = Number(((full23HitCount / n) * 100).toFixed(2));

    // Baseline calculation (e.g. Random 20 draws in 10,000 possibilities has 0.20% probability)
    const randomBaselineTop20 = Number(((20 / 10000) * 100).toFixed(2));
    const randomBaselineTop5 = Number(((5 / 10000) * 100).toFixed(2));
    const randomBaselineExact = Number(((1 / 10000) * 100).toFixed(2));

    const outperformingBaseline = top20HitRate > randomBaselineTop20 || avgDigitHits >= 1.5;

    return {
      gameProfileId: draws[0]?.gameProfileId || 'GAME_4D',
      operator: draws[0]?.operator,
      startDate: draws[0]?.drawDate || '',
      endDate: draws[draws.length - 1]?.drawDate || '',
      sampleSize: n,
      exactHitCount: exactHits,
      exactHitRate,
      top5HitRate,
      top10HitRate,
      top20HitRate,
      top3HitRate,
      full23HitRate,
      avgDigitHits,
      avgPositionHits,
      randomBaselineTop5,
      randomBaselineExact,
      outperformingBaseline,
      evaluations,
    };
  }
}
