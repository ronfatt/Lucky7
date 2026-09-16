// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Candidate Generation Engine
// File: lib/synthesis/candidate-generation-engine.ts
// ==========================================================

import type {
  DailyDirectionResult,
  DailyNumberActivation,
  DigitFeatureVector,
  PersonalNumberDNA,
  PredictionCandidate,
  RealitySignalRecord,
  FourPillarsData,
} from '../../types/zwtsp.ts';
import { CandidateScoringEngine } from './candidate-scoring-engine.ts';

// Helper to generate unique permutations of an array of numbers
function getPermutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const results: number[][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const subPerms = getPermutations(remaining);

    for (const sub of subPerms) {
      const candidate = [current, ...sub];
      const key = candidate.join('');
      if (!seen.has(key)) {
        seen.add(key);
        results.push(candidate);
      }
    }
  }
  return results;
}

export class CandidateGenerationEngine {
  /**
   * Generates and scores a deterministic pool of 4-digit candidates from ranked digit vectors
   */
  public static generateCandidates(
    vectors: DigitFeatureVector[],
    personalDNA: PersonalNumberDNA,
    dailyActivatedDigits: DailyNumberActivation[],
    dailyDirection?: DailyDirectionResult,
    realitySignals: RealitySignalRecord[] = [],
    limit: number = 50,
    fourPillars?: FourPillarsData,
    birthDate?: string
  ): PredictionCandidate[] {
    const top4 = vectors.slice(0, 4).map((v) => v.digit); // Primary Top 4
    const next2 = vectors.slice(4, 6).map((v) => v.digit); // Secondary Support

    const candidatePool: Array<{ digits: number[]; method: PredictionCandidate['generationMethod'] }> = [];
    const seenCombos = new Set<string>();

    // 1. Primary Permutations of Top 4 digits (up to 24)
    const primaryPerms = getPermutations(top4);
    for (const p of primaryPerms) {
      const numStr = p.join('');
      if (!seenCombos.has(numStr)) {
        seenCombos.add(numStr);
        candidatePool.push({ digits: p, method: 'PRIMARY_PERMUTATION' });
      }
    }

    // 2. Repeated combos of Top 3 digits (e.g. 5772, 5572, 5722)
    if (top4.length >= 3) {
      const [d0, d1, d2] = top4;
      const repeatedSets = [
        [d0, d1, d1, d2],
        [d0, d0, d1, d2],
        [d0, d1, d2, d2],
        [d1, d1, d0, d2],
        [d2, d2, d0, d1],
      ];
      for (const set of repeatedSets) {
        const perms = getPermutations(set);
        for (const p of perms.slice(0, 4)) {
          const numStr = p.join('');
          if (!seenCombos.has(numStr)) {
            seenCombos.add(numStr);
            candidatePool.push({ digits: p, method: 'REPEATED_COMBO' });
          }
        }
      }
    }

    // 3. Combinations across Top 5 / Top 6 vectors (Secondary Substituted)
    const top6 = vectors.slice(0, 6).map((v) => v.digit);
    if (top6.length >= 5) {
      const combos = [
        [top6[0], top6[1], top6[2], top6[4]],
        [top6[0], top6[1], top6[3], top6[4]],
        [top6[0], top6[2], top6[3], top6[4]],
        [top6[1], top6[2], top6[3], top6[4]],
      ];
      if (top6.length >= 6) {
        combos.push([top6[0], top6[1], top6[2], top6[5]]);
        combos.push([top6[0], top6[3], top6[4], top6[5]]);
      }
      for (const combo of combos) {
        const perms = getPermutations(combo);
        for (const p of perms.slice(0, 6)) {
          const numStr = p.join('');
          if (!seenCombos.has(numStr)) {
            seenCombos.add(numStr);
            candidatePool.push({ digits: p, method: 'SECONDARY_SUBSTITUTED' });
          }
        }
      }
    }

    // Evaluate each candidate
    const evaluated: PredictionCandidate[] = [];
    for (const item of candidatePool) {
      const evalRes = CandidateScoringEngine.evaluateCandidate(
        item.digits,
        vectors,
        personalDNA,
        dailyActivatedDigits,
        dailyDirection,
        realitySignals,
        fourPillars,
        birthDate
      );

      evaluated.push({
        number: item.digits.join(''),
        rank: 1, // Updated below
        score: evalRes.score,
        breakdown: evalRes.breakdown,
        confidence: evalRes.score >= 82 ? 'HIGH' : evalRes.score >= 65 ? 'MEDIUM' : 'LOW',
        generationMethod: item.method,
        trace: evalRes.trace,
      });
    }

    // Deterministic sorting: by score descending, then by number ascending
    evaluated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.number.localeCompare(b.number);
    });

    evaluated.forEach((c, idx) => {
      c.rank = idx + 1;
    });

    return evaluated.slice(0, limit);
  }
}
