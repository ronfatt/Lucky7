// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Signal Pattern Engine
// File: lib/signals/signal-pattern-engine.ts
// ==========================================================

import type { SignalPatternType } from '../../types/zwtsp.ts';

export interface PatternDetectionResult {
  patterns: SignalPatternType[];
  patternScore: number;
  isMirror: boolean;
  isAscending: boolean;
  isDescending: boolean;
  hasDouble: boolean;
  hasTriple: boolean;
}

export class SignalPatternEngine {
  /**
   * Detects topological & structural patterns in a digit sequence
   */
  public static detectPatterns(digits: number[]): PatternDetectionResult {
    const patterns: SignalPatternType[] = [];
    if (!digits || digits.length < 2) {
      return {
        patterns: [],
        patternScore: 50,
        isMirror: false,
        isAscending: false,
        isDescending: false,
        hasDouble: false,
        hasTriple: false,
      };
    }

    // 1. Mirror Pattern (Palindrome check, e.g. 1221, 5775)
    let isMirror = true;
    for (let i = 0; i < Math.floor(digits.length / 2); i++) {
      if (digits[i] !== digits[digits.length - 1 - i]) {
        isMirror = false;
        break;
      }
    }
    if (isMirror) {
      patterns.push('MIRROR');
    }

    // 2. Ascending Pattern (e.g. 1234)
    let isAscending = true;
    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i + 1] !== digits[i] + 1) {
        isAscending = false;
        break;
      }
    }
    if (isAscending) {
      patterns.push('ASCENDING');
    }

    // 3. Descending Pattern (e.g. 4321)
    let isDescending = true;
    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i + 1] !== digits[i] - 1) {
        isDescending = false;
        break;
      }
    }
    if (isDescending) {
      patterns.push('DESCENDING');
    }

    // 4. Consecutive Double & Triple Digits
    let hasDouble = false;
    let hasTriple = false;
    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i] === digits[i + 1]) {
        hasDouble = true;
        if (i < digits.length - 2 && digits[i] === digits[i + 2]) {
          hasTriple = true;
        }
      }
    }
    if (hasTriple) {
      patterns.push('TRIPLE_DIGIT');
    } else if (hasDouble) {
      patterns.push('DOUBLE_DIGIT');
    }

    // 5. General Repeated Digit
    const freq = new Set(digits);
    if (freq.size < digits.length) {
      patterns.push('REPEATED_DIGIT');
    }

    // 6. Pair Repetition (e.g. 5757)
    if (digits.length === 4 && digits[0] === digits[2] && digits[1] === digits[3]) {
      patterns.push('PAIR_REPETITION');
    }

    // Calculate neutral baseline pattern score (60-95)
    let baseScore = 65;
    if (isMirror) baseScore += 18;
    if (isAscending || isDescending) baseScore += 15;
    if (hasDouble) baseScore += 10;
    if (hasTriple) baseScore += 12;

    const patternScore = Math.min(98, Math.max(40, baseScore));

    return {
      patterns,
      patternScore,
      isMirror,
      isAscending,
      isDescending,
      hasDouble,
      hasTriple,
    };
  }

  /**
   * Checks if sequence B is the exact reverse of sequence A (e.g. 5729 vs 9275)
   */
  public static isReverseSequence(seqA: number[], seqB: number[]): boolean {
    if (seqA.length !== seqB.length || seqA.length === 0) return false;
    for (let i = 0; i < seqA.length; i++) {
      if (seqA[i] !== seqB[seqA.length - 1 - i]) {
        return false;
      }
    }
    return true;
  }
}
