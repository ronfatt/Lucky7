// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Reality Signal Store & Service
// File: lib/signals/reality-signal-store.ts
// ==========================================================

import type {
  PersonalNumberDNA,
  RealitySignalInput,
  RealitySignalRecord,
  SignalPatternType,
} from '../../types/zwtsp.ts';
import { SignalNormalizationEngine } from './signal-normalization-engine.ts';
import { DigitExtractionEngine } from './digit-extraction-engine.ts';
import { SignalPatternEngine } from './signal-pattern-engine.ts';

// Source weights (model observational quality)
export const SOURCE_WEIGHTS: Record<string, number> = {
  MANUAL_OBSERVATION: 100,
  VEHICLE_PLATE: 90,
  TIME_OBSERVATION: 85,
  RECEIPT_NUMBER: 75,
  ORDER_NUMBER: 75,
  HOUSE_NUMBER: 70,
  ROOM_NUMBER: 70,
  SEAT_NUMBER: 65,
  FLOOR_NUMBER: 65,
  TICKET_NUMBER: 65,
  PHONE_SUFFIX: 60,
  ADDRESS_NUMBER: 60,
};

// In-memory cache for fast local persistence / user-scoped reality signals
let inMemorySignals: RealitySignalRecord[] = [];

export class RealitySignalStore {
  /**
   * Records a new reality signal and computes all derived traits
   */
  public static createSignal(
    input: RealitySignalInput,
    personalDNA?: PersonalNumberDNA
  ): RealitySignalRecord {
    const norm = SignalNormalizationEngine.normalize(input.rawValue);
    const extraction = DigitExtractionEngine.extract(norm.digits);
    const patternRes = SignalPatternEngine.detectPatterns(norm.digits);

    const sourceWeight = SOURCE_WEIGHTS[input.signalType] || 70;

    // 1. DNA Match Score
    let dnaMatchScore = 60;
    if (personalDNA && norm.digits.length > 0) {
      let sumDna = 0;
      for (const d of norm.digits) {
        sumDna += personalDNA.scoresByDigit ? (personalDNA.scoresByDigit[d] ?? 60) : 60;
      }
      dnaMatchScore = Number((sumDna / norm.digits.length).toFixed(1));
    }

    // 2. Data Quality Score (independent from Resonance!)
    let quality = sourceWeight * 0.5;
    if (input.observationTime) quality += 15;
    if (input.direction && input.direction !== 'Unknown') quality += 15;
    if (input.context) quality += 10;
    if (input.locationLabel) quality += 10;
    const qualityScore = Math.min(100, Number(quality.toFixed(1)));

    // 3. Resonance Score
    const dailyPart = 78.0; // Baseline daily synergy
    const dirPart = input.direction && input.direction !== 'Unknown' ? 82.0 : 65.0;
    const timePart = input.observationTime ? 75.0 : 60.0;
    const patternPart = patternRes.patternScore;

    const resonanceScore = Number(
      (
        dnaMatchScore * 0.30 +
        dailyPart * 0.25 +
        dirPart * 0.15 +
        timePart * 0.10 +
        patternPart * 0.10 +
        sourceWeight * 0.10
      ).toFixed(1)
    );

    const record: RealitySignalRecord = {
      id: input.id || `sig-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: input.userId || 'default-user',
      signalType: input.signalType,
      rawValue: input.rawValue,
      normalizedValue: norm.normalizedValue,
      normalizedDigits: norm.digits,
      normalizedLetters: norm.letters,
      numericValue: norm.numericValue,
      digitCount: norm.digitCount,
      sourceDescription: input.sourceDescription,
      observationTime: input.observationTime,
      timezone: input.timezone || 'Asia/Shanghai',
      locationLabel: input.locationLabel,
      direction: input.direction,
      context: input.context,
      notes: input.notes,
      resonanceScore,
      qualityScore,
      confidence: qualityScore >= 80 ? 'HIGH' : qualityScore >= 60 ? 'MEDIUM' : 'LOW',
      status: resonanceScore >= 85 ? 'VERY STRONG' : resonanceScore >= 70 ? 'STRONG' : 'NORMAL',
      dnaMatchScore,
      dailyMatchScore: dailyPart,
      directionMatchScore: input.direction && input.direction !== 'Unknown' ? dirPart : 'NOT_AVAILABLE',
      timeMatchScore: input.observationTime ? timePart : 'NOT_AVAILABLE',
      patternScore: patternPart,
      sourceWeight,
      effectiveWeights: {
        dna: 0.3,
        daily: 0.25,
        dir: 0.15,
        time: 0.1,
        pat: 0.1,
        src: 0.1,
      },
      patternsDetected: patternRes.patterns,
      calculationVersion: 'SIGNAL-V1.0',
      createdAt: new Date().toISOString(),
    };

    inMemorySignals.unshift(record);
    return record;
  }

  /**
   * Retrieves signals scoped by userId and optionally filtered by date
   */
  public static getSignals(datePrefix?: string, userId?: string): RealitySignalRecord[] {
    let list = [...inMemorySignals];
    if (userId) {
      list = list.filter((s) => s.userId === userId);
    } else {
      list = list.filter((s) => s.userId === 'global');
    }
    if (datePrefix) {
      list = list.filter((s) => s.createdAt.startsWith(datePrefix));
    }
    return list;
  }

  /**
   * Computes 0-9 observational frequency across records
   */
  public static getDigitFrequencies(signals: RealitySignalRecord[]): Record<number, number> {
    const freq: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    };
    for (const s of signals) {
      for (const d of s.normalizedDigits) {
        if (freq[d] !== undefined) {
          freq[d]++;
        }
      }
    }
    return freq;
  }

  /**
   * Delete a signal by ID
   */
  public static deleteSignal(id: string): boolean {
    const beforeLen = inMemorySignals.length;
    inMemorySignals = inMemorySignals.filter((s) => s.id !== id);
    return inMemorySignals.length < beforeLen;
  }
}
