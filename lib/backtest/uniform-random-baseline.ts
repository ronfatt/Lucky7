// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Uniform Random Baseline Engine
// File: lib/backtest/uniform-random-baseline.ts
// ==========================================================

export class UniformRandomBaseline {
  /**
   * Deterministic Linear Congruential Generator (LCG) for reproducible baseline testing
   * seed default: 20260913
   */
  public static generateCandidates(count: number = 20, seed: number = 20260913): string[] {
    const candidates: string[] = [];
    const seen = new Set<string>();
    let currentSeed = seed;

    const lcgNext = () => {
      // Numerical Recipes LCG parameters
      currentSeed = (1664525 * currentSeed + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };

    while (candidates.length < count) {
      const num = Math.floor(lcgNext() * 10000);
      const str = num.toString().padStart(4, '0');
      if (!seen.has(str)) {
        seen.add(str);
        candidates.push(str);
      }
    }

    return candidates;
  }
}
