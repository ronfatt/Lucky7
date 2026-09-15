// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Digit Extraction Engine
// File: lib/signals/digit-extraction-engine.ts
// ==========================================================

export interface DigitExtractionResult {
  orderedDigits: number[];
  unorderedDigitSet: number[];
  uniqueDigits: number[];
  digitFrequency: Record<number, number>;
  repeatCount: number;
  repeatedDigits: number[];
  digitSum: number;
  digitalRoot: number;
}

export class DigitExtractionEngine {
  /**
   * Computes mathematical digit breakdown, frequencies, sum, and digital root
   */
  public static extract(digits: number[]): DigitExtractionResult {
    const orderedDigits = [...digits];
    const frequency: Record<number, number> = {};
    let sum = 0;

    for (const d of digits) {
      frequency[d] = (frequency[d] || 0) + 1;
      sum += d;
    }

    const uniqueDigits = Object.keys(frequency).map(Number);
    const unorderedDigitSet = [...uniqueDigits].sort((a, b) => a - b);

    const repeatedDigits: number[] = [];
    let repeatCount = 0;
    for (const [digitStr, count] of Object.entries(frequency)) {
      if (count > 1) {
        repeatedDigits.push(Number(digitStr));
        repeatCount += count - 1;
      }
    }

    // Canonical Digital Root (1-9), or 0 if digits empty
    let digitalRoot = 0;
    if (sum > 0) {
      digitalRoot = sum % 9 === 0 ? 9 : sum % 9;
    }

    return {
      orderedDigits,
      unorderedDigitSet,
      uniqueDigits,
      digitFrequency: frequency,
      repeatCount,
      repeatedDigits,
      digitSum: sum,
      digitalRoot,
    };
  }
}
