// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Rule Engine
// File: lib/rules/rule-engine.ts
// ==========================================================

import type { NumerologyRule, WuXingElement, YinYangPolarity } from '../../types/zwtsp.ts';

export const DEFAULT_NUMEROLOGY_RULES: NumerologyRule[] = [
  // 0-9 Element Mappings
  { ruleName: '0_element', ruleType: 'digit_element', inputValue: '0', outputValue: 'Earth', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '1_element', ruleType: 'digit_element', inputValue: '1', outputValue: 'Water', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '2_element', ruleType: 'digit_element', inputValue: '2', outputValue: 'Fire',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '3_element', ruleType: 'digit_element', inputValue: '3', outputValue: 'Wood',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '4_element', ruleType: 'digit_element', inputValue: '4', outputValue: 'Metal', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '5_element', ruleType: 'digit_element', inputValue: '5', outputValue: 'Earth', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '6_element', ruleType: 'digit_element', inputValue: '6', outputValue: 'Water', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '7_element', ruleType: 'digit_element', inputValue: '7', outputValue: 'Fire',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '8_element', ruleType: 'digit_element', inputValue: '8', outputValue: 'Wood',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '9_element', ruleType: 'digit_element', inputValue: '9', outputValue: 'Metal', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },

  // Yin / Yang Polarity
  { ruleName: '0_polarity', ruleType: 'yin_yang', inputValue: '0', outputValue: 'Yin',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '1_polarity', ruleType: 'yin_yang', inputValue: '1', outputValue: 'Yang', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '2_polarity', ruleType: 'yin_yang', inputValue: '2', outputValue: 'Yin',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '3_polarity', ruleType: 'yin_yang', inputValue: '3', outputValue: 'Yang', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '4_polarity', ruleType: 'yin_yang', inputValue: '4', outputValue: 'Yin',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '5_polarity', ruleType: 'yin_yang', inputValue: '5', outputValue: 'Yang', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '6_polarity', ruleType: 'yin_yang', inputValue: '6', outputValue: 'Yin',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '7_polarity', ruleType: 'yin_yang', inputValue: '7', outputValue: 'Yang', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '8_polarity', ruleType: 'yin_yang', inputValue: '8', outputValue: 'Yin',  weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },
  { ruleName: '9_polarity', ruleType: 'yin_yang', inputValue: '9', outputValue: 'Yang', weight: 1.0, version: '1.0', source: 'ZWTSP Standard', active: true },

  // He Tu Pairs (10 -> 0 default)
  { ruleName: 'hetu_1_6', ruleType: 'hetu_pair', inputValue: '1', outputValue: '6', weight: 1.2, version: '1.0', source: 'He Tu Tradition', active: true, notes: '天一生水，地六成之' },
  { ruleName: 'hetu_2_7', ruleType: 'hetu_pair', inputValue: '2', outputValue: '7', weight: 1.2, version: '1.0', source: 'He Tu Tradition', active: true, notes: '地二生火，天七成之' },
  { ruleName: 'hetu_3_8', ruleType: 'hetu_pair', inputValue: '3', outputValue: '8', weight: 1.2, version: '1.0', source: 'He Tu Tradition', active: true, notes: '天三生木，地八成之' },
  { ruleName: 'hetu_4_9', ruleType: 'hetu_pair', inputValue: '4', outputValue: '9', weight: 1.2, version: '1.0', source: 'He Tu Tradition', active: true, notes: '地四生金，天九成之' },
  { ruleName: 'hetu_5_0', ruleType: 'hetu_pair', inputValue: '5', outputValue: '0', weight: 1.2, version: '1.0', source: 'He Tu Tradition', active: true, notes: '天五生土，地十成之 (10映射为0)' },
];

export class RuleEngine {
  private rules: Map<string, NumerologyRule> = new Map();
  private version: string = '1.0';

  constructor(customRules?: NumerologyRule[]) {
    this.loadRules(customRules || DEFAULT_NUMEROLOGY_RULES);
  }

  public loadRules(rules: NumerologyRule[]): void {
    this.rules.clear();
    for (const rule of rules) {
      if (rule.active) {
        const key = `${rule.ruleType}:${rule.inputValue}`;
        this.rules.set(key, rule);
      }
    }
  }

  public getDigitElement(digit: number): WuXingElement {
    const key = `digit_element:${digit % 10}`;
    const rule = this.rules.get(key);
    if (rule) {
      return rule.outputValue as WuXingElement;
    }
    // Strict fallback per specification
    const defaultMap: Record<number, WuXingElement> = {
      0: 'Earth', 1: 'Water', 2: 'Fire', 3: 'Wood', 4: 'Metal',
      5: 'Earth', 6: 'Water', 7: 'Fire', 8: 'Wood', 9: 'Metal'
    };
    return defaultMap[digit % 10] || 'Earth';
  }

  public getDigitPolarity(digit: number): YinYangPolarity {
    const key = `yin_yang:${digit % 10}`;
    const rule = this.rules.get(key);
    if (rule) {
      return rule.outputValue as YinYangPolarity;
    }
    return (digit % 2 === 1) ? 'Yang' : 'Yin';
  }

  public getHeTuPartner(digit: number): number {
    const d = digit % 10;
    // Check forward
    const forward = this.rules.get(`hetu_pair:${d}`);
    if (forward) return parseInt(forward.outputValue, 10);
    // Check backward
    for (const [, rule] of this.rules.entries()) {
      if (rule.ruleType === 'hetu_pair' && rule.outputValue === String(d)) {
        return parseInt(rule.inputValue, 10);
      }
    }
    // Default fallback (1-6, 2-7, 3-8, 4-9, 5-0)
    const pairs: Record<number, number> = {
      1: 6, 6: 1, 2: 7, 7: 2, 3: 8, 8: 3, 4: 9, 9: 4, 5: 0, 0: 5
    };
    return pairs[d] ?? d;
  }

  public getAllActiveRules(): NumerologyRule[] {
    return Array.from(this.rules.values());
  }

  public getVersion(): string {
    return this.version;
  }
}

// Global default singleton instance
export const globalRuleEngine = new RuleEngine();
