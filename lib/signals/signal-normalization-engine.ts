// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Signal Normalization Engine
// File: lib/signals/signal-normalization-engine.ts
// ==========================================================

export interface NormalizedSignalOutput {
  rawValue: string;
  normalizedValue: string;
  digits: number[];
  letters: string[];
  numericValue: string;
  digitCount: number;
}

export class SignalNormalizationEngine {
  /**
   * Normalizes raw observational input without destroying the original text
   * Separates alphabetic characters from numerical digits
   */
  public static normalize(rawValue: string): NormalizedSignalOutput {
    if (!rawValue || typeof rawValue !== 'string') {
      return {
        rawValue: '',
        normalizedValue: '',
        digits: [],
        letters: [],
        numericValue: '',
        digitCount: 0,
      };
    }

    const trimmed = rawValue.trim();

    // Extract letters (A-Z, a-z)
    const letterMatches = trimmed.match(/[a-zA-Z]/g) || [];
    const letters = letterMatches.map((l) => l.toUpperCase());

    // Extract numeric digits (0-9) preserving original order
    const digitMatches = trimmed.match(/\d/g) || [];
    const digits = digitMatches.map(Number);
    const numericValue = digitMatches.join('');

    // Reconstructed clean normalized string
    const normalizedValue = letters.length > 0 && digits.length > 0
      ? `${letters.join('')} ${numericValue}`
      : numericValue || letters.join('') || trimmed;

    return {
      rawValue,
      normalizedValue,
      digits,
      letters,
      numericValue,
      digitCount: digits.length,
    };
  }
}
