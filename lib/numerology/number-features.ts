// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Number Feature Engine
// File: lib/numerology/number-features.ts
// ==========================================================

import type { NumberFeatures, WuXingElement } from '../../types/zwtsp.ts';
import { getDigitElement, getLuoShuCell, getHeTuPartner } from './digit-foundation.ts';
import { globalRuleEngine, RuleEngine } from '../rules/rule-engine.ts';

/**
 * Calculates digital root (1-9 reduction, or 0 if input sum is 0)
 */
export function calculateDigitalRoot(sum: number): number {
  if (sum <= 0) return 0;
  const mod = sum % 9;
  return mod === 0 ? 9 : mod;
}

/**
 * Extracts comprehensive numerology and statistical features from a number string or integer array
 * e.g., '5729', 5729, or [5, 7, 2, 9]
 */
export function extractNumberFeatures(
  input: string | number | number[],
  ruleEngine: RuleEngine = globalRuleEngine
): NumberFeatures {
  let digits: number[] = [];

  if (Array.isArray(input)) {
    digits = input.map(n => Math.abs(Math.floor(n)) % 10);
  } else if (typeof input === 'number') {
    digits = Math.abs(Math.floor(input))
      .toString()
      .split('')
      .map(Number);
  } else if (typeof input === 'string') {
    digits = input
      .replace(/\D/g, '')
      .split('')
      .map(Number);
  }

  // Handle empty edge case
  if (digits.length === 0) {
    digits = [0];
  }

  const length = digits.length;
  const digitString = digits.join('');
  const digitSum = digits.reduce((acc, d) => acc + d, 0);
  const digitalRoot = calculateDigitalRoot(digitSum);

  // Odd / Even Analysis
  let oddCount = 0;
  let evenCount = 0;
  for (const d of digits) {
    if (d % 2 === 1) oddCount++;
    else evenCount++;
  }
  const oddEvenRatio = length > 0 ? Number((oddCount / length).toFixed(2)) : 0.5;

  // High (5-9) / Low (0-4) Analysis
  let highCount = 0;
  let lowCount = 0;
  for (const d of digits) {
    if (d >= 5) highCount++;
    else lowCount++;
  }
  const highLowRatio = length > 0 ? Number((highCount / length).toFixed(2)) : 0.5;

  // Repeated Digits & Max Repetition
  const repeatedDigits: { [digit: number]: number } = {};
  for (const d of digits) {
    repeatedDigits[d] = (repeatedDigits[d] || 0) + 1;
  }
  const maxRepeatCount = Math.max(...Object.values(repeatedDigits));

  // Consecutive Digits Count (e.g. 1-2, 7-8, 2-3)
  let consecutiveCount = 0;
  for (let i = 0; i < length - 1; i++) {
    if (Math.abs(digits[i] - digits[i + 1]) === 1) {
      consecutiveCount++;
    }
  }

  // Element Distribution
  const elementDistribution: { [key in WuXingElement]: number } = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  for (const d of digits) {
    const el = getDigitElement(d, ruleEngine);
    elementDistribution[el]++;
  }

  // Dominant Element
  let dominantElement: WuXingElement = 'Earth';
  let maxElementCount = -1;
  for (const [el, count] of Object.entries(elementDistribution) as [WuXingElement, number][]) {
    if (count > maxElementCount) {
      maxElementCount = count;
      dominantElement = el;
    }
  }

  // Luo Shu Palace Coverage
  const luoShuCoverage = digits.map(d => getLuoShuCell(d));

  // He Tu Pairs Found within the digits
  const heTuPairsFound: Array<{ pair: [number, number]; element: WuXingElement; label: string }> = [];
  const digitSet = new Set(digits);
  const checkedPartners = new Set<string>();

  for (const d of digits) {
    const partner = getHeTuPartner(d, ruleEngine);
    if (digitSet.has(partner) && partner !== d) {
      const pairKey = [Math.min(d, partner), Math.max(d, partner)].join('-');
      if (!checkedPartners.has(pairKey)) {
        checkedPartners.add(pairKey);
        const el = getDigitElement(d, ruleEngine);
        heTuPairsFound.push({
          pair: [Math.min(d, partner), Math.max(d, partner)],
          element: el,
          label: `${Math.min(d, partner)}/${Math.max(d, partner)} 合化${el}`
        });
      }
    }
  }

  // Tail Pattern and Range
  const tailPattern = digits[length - 1];
  const maxVal = Math.max(...digits);
  const minVal = Math.min(...digits);
  const range = maxVal - minVal;

  return {
    rawDigits: digits,
    digitString,
    length,
    digitSum,
    digitalRoot,
    oddCount,
    evenCount,
    oddEvenRatio,
    highCount,
    lowCount,
    highLowRatio,
    repeatedDigits,
    maxRepeatCount,
    consecutiveCount,
    elementDistribution,
    dominantElement,
    luoShuCoverage,
    heTuPairsFound,
    tailPattern,
    range,
  };
}
