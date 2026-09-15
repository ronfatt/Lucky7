// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Variation Code Engine
// File: lib/signals/variation-code-engine.ts
// ==========================================================

import type {
  VariationCodeRecord,
  VariationType,
} from '../../types/zwtsp.ts';

export class VariationCodeEngine {
  /**
   * Generates bounded variations (max 50) for a given Mother Code
   */
  public static generateVariations(
    motherCode: string,
    baseScore: number = 85.0,
    maxLimit: number = 50
  ): VariationCodeRecord[] {
    const variations: VariationCodeRecord[] = [];
    const seen = new Set<string>();
    seen.add(motherCode); // Exclude the exact mother code itself

    const digits = motherCode.split('').map(Number);
    if (digits.length < 2) return [];

    // 1. REVERSE (首尾完全倒置)
    const reversedStr = [...digits].reverse().join('');
    if (!seen.has(reversedStr)) {
      seen.add(reversedStr);
      variations.push({
        parentNumber: motherCode,
        variationType: 'REVERSE',
        resultNumber: reversedStr,
        variationScore: Number((baseScore * 0.96).toFixed(1)),
        rank: 1,
        explanation: '逆序反相：首尾完全对调之镜像形态',
      });
    }

    // 2. ROTATION (环形循环轮转)
    for (let shift = 1; shift < digits.length; shift++) {
      const rot = digits.slice(shift).concat(digits.slice(0, shift)).join('');
      if (!seen.has(rot)) {
        seen.add(rot);
        variations.push({
          parentNumber: motherCode,
          variationType: 'ROTATION',
          resultNumber: rot,
          variationScore: Number((baseScore * 0.94 - shift * 0.5).toFixed(1)),
          rank: 1,
          explanation: `顺时针位移 ${shift} 步之环形轮转码`,
        });
      }
    }

    // 3. PAIR_SWAP (邻位互换)
    for (let i = 0; i < digits.length - 1; i++) {
      const swapped = [...digits];
      const tmp = swapped[i];
      swapped[i] = swapped[i + 1];
      swapped[i + 1] = tmp;
      const swapStr = swapped.join('');
      if (!seen.has(swapStr)) {
        seen.add(swapStr);
        variations.push({
          parentNumber: motherCode,
          variationType: 'PAIR_SWAP',
          resultNumber: swapStr,
          variationScore: Number((baseScore * 0.92 - i * 0.4).toFixed(1)),
          rank: 1,
          explanation: `第 ${i + 1} 位与第 ${i + 2} 位对位互换`,
        });
      }
    }

    // 4. MIRROR (轴对称映射: 前两位复制镜像)
    if (digits.length >= 4) {
      const mirrorA = `${digits[0]}${digits[1]}${digits[1]}${digits[0]}`;
      if (!seen.has(mirrorA)) {
        seen.add(mirrorA);
        variations.push({
          parentNumber: motherCode,
          variationType: 'MIRROR',
          resultNumber: mirrorA,
          variationScore: Number((baseScore * 0.90).toFixed(1)),
          rank: 1,
          explanation: '前二位回文轴对称镜像变体',
        });
      }
      const mirrorB = `${digits[2]}${digits[3]}${digits[3]}${digits[2]}`;
      if (!seen.has(mirrorB)) {
        seen.add(mirrorB);
        variations.push({
          parentNumber: motherCode,
          variationType: 'MIRROR',
          resultNumber: mirrorB,
          variationScore: Number((baseScore * 0.88).toFixed(1)),
          rank: 1,
          explanation: '后二位回文轴对称镜像变体',
        });
      }
    }

    // 5. DIGIT_SUBSTITUTION (末位河图五行替换: 1<->6, 2<->7, 3<->8, 4<->9, 5<->0)
    const hetuMap: Record<number, number> = {
      1: 6, 6: 1,
      2: 7, 7: 2,
      3: 8, 8: 3,
      4: 9, 9: 4,
      5: 0, 0: 5,
    };
    const lastDigit = digits[digits.length - 1];
    if (hetuMap[lastDigit] !== undefined) {
      const subbed = [...digits];
      subbed[digits.length - 1] = hetuMap[lastDigit];
      const subStr = subbed.join('');
      if (!seen.has(subStr)) {
        seen.add(subStr);
        variations.push({
          parentNumber: motherCode,
          variationType: 'DIGIT_SUBSTITUTION',
          resultNumber: subStr,
          variationScore: Number((baseScore * 0.86).toFixed(1)),
          rank: 1,
          explanation: `末位换气：由河图同气数 ${hetuMap[lastDigit]} 替换`,
        });
      }
    }

    // Sort descending by score, assign rank
    variations.sort((a, b) => b.variationScore - a.variationScore);
    variations.forEach((v, idx) => {
      v.rank = idx + 1;
    });

    return variations.slice(0, maxLimit);
  }
}
