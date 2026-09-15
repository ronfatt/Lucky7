// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Digit Foundation
// File: lib/numerology/digit-foundation.ts
// ==========================================================

import type { LuoShuCell, WuXingElement, YinYangPolarity } from '../../types/zwtsp.ts';
import { globalRuleEngine, RuleEngine } from '../rules/rule-engine.ts';

export const LUOSHU_GRID: Record<number, LuoShuCell> = {
  4: { digit: 4, row: 0, col: 0, palaceName: '巽宫', direction: 'SE', element: 'Wood', gua: '巽' },
  9: { digit: 9, row: 0, col: 1, palaceName: '离宫', direction: 'S',  element: 'Fire', gua: '离' },
  2: { digit: 2, row: 0, col: 2, palaceName: '坤宫', direction: 'SW', element: 'Earth', gua: '坤' },
  3: { digit: 3, row: 1, col: 0, palaceName: '震宫', direction: 'E',  element: 'Wood', gua: '震' },
  5: { digit: 5, row: 1, col: 1, palaceName: '中宫', direction: 'Center', element: 'Earth', gua: '中' },
  7: { digit: 7, row: 1, col: 2, palaceName: '兑宫', direction: 'W',  element: 'Metal', gua: '兑' },
  8: { digit: 8, row: 2, col: 0, palaceName: '艮宫', direction: 'NE', element: 'Earth', gua: '艮' },
  1: { digit: 1, row: 2, col: 1, palaceName: '坎宫', direction: 'N',  element: 'Water', gua: '坎' },
  6: { digit: 6, row: 2, col: 2, palaceName: '乾宫', direction: 'NW', element: 'Metal', gua: '乾' },
  0: { digit: 0, row: 1, col: 1, palaceName: '中宫寄位', direction: 'Center', element: 'Earth', gua: '玄' }
};

export const ELEMENT_LABELS: Record<WuXingElement, { zh: string; color: string; bg: string; text: string }> = {
  Wood:  { zh: '木', color: '#10B981', bg: 'bg-emerald-950/60 border-emerald-500/30', text: 'text-emerald-400' },
  Fire:  { zh: '火', color: '#EF4444', bg: 'bg-red-950/60 border-red-500/30', text: 'text-red-400' },
  Earth: { zh: '土', color: '#D97706', bg: 'bg-amber-950/60 border-amber-500/30', text: 'text-amber-400' },
  Metal: { zh: '金', color: '#94A3B8', bg: 'bg-slate-800/60 border-slate-400/30', text: 'text-slate-300' },
  Water: { zh: '水', color: '#38BDF8', bg: 'bg-sky-950/60 border-sky-500/30', text: 'text-sky-400' },
};

export const DIRECTION_LABELS: Record<string, string> = {
  N: '正北方 (坎)',
  NE: '东北方 (艮)',
  E: '正东方 (震)',
  SE: '东南方 (巽)',
  S: '正南方 (离)',
  SW: '西南方 (坤)',
  W: '正西方 (兑)',
  NW: '西北方 (乾)',
  Center: '中央 (中宫)'
};

/**
 * Returns the Five-Element for a single digit (0-9)
 */
export function getDigitElement(digit: number, ruleEngine: RuleEngine = globalRuleEngine): WuXingElement {
  return ruleEngine.getDigitElement(digit);
}

/**
 * Returns the Yin/Yang polarity for a single digit (0-9)
 */
export function getDigitPolarity(digit: number, ruleEngine: RuleEngine = globalRuleEngine): YinYangPolarity {
  return ruleEngine.getDigitPolarity(digit);
}

/**
 * Returns Luo Shu cell details for a digit
 */
export function getLuoShuCell(digit: number): LuoShuCell {
  const d = Math.abs(digit) % 10;
  return LUOSHU_GRID[d];
}

/**
 * Returns He Tu partner for a digit (1-6, 2-7, 3-8, 4-9, 5-0)
 */
export function getHeTuPartner(digit: number, ruleEngine: RuleEngine = globalRuleEngine): number {
  return ruleEngine.getHeTuPartner(digit);
}

/**
 * Evaluates relationship between two Five Elements
 * Returns: { relation: 'same' | 'generates' | 'generated_by' | 'overcomes' | 'overcome_by', label: string, score: number }
 */
export function evaluateElementRelationship(e1: WuXingElement, e2: WuXingElement): {
  relation: 'same' | 'generates' | 'generated_by' | 'overcomes' | 'overcome_by';
  label: string;
  score: number;
} {
  if (e1 === e2) {
    return { relation: 'same', label: '比和 (同气相求)', score: 85 };
  }

  const generatesMap: Record<WuXingElement, WuXingElement> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  };

  if (generatesMap[e1] === e2) {
    return { relation: 'generates', label: `${ELEMENT_LABELS[e1].zh}生${ELEMENT_LABELS[e2].zh} (生出脱秀)`, score: 90 };
  }
  if (generatesMap[e2] === e1) {
    return { relation: 'generated_by', label: `${ELEMENT_LABELS[e2].zh}生${ELEMENT_LABELS[e1].zh} (得生受生)`, score: 100 };
  }

  const overcomesMap: Record<WuXingElement, WuXingElement> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood'
  };

  if (overcomesMap[e1] === e2) {
    return { relation: 'overcomes', label: `${ELEMENT_LABELS[e1].zh}克${ELEMENT_LABELS[e2].zh} (我克制衡)`, score: 50 };
  }
  return { relation: 'overcome_by', label: `${ELEMENT_LABELS[e2].zh}克${ELEMENT_LABELS[e1].zh} (受制滞碍)`, score: 30 };
}
