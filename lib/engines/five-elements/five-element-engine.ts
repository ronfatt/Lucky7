// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Five Elements Engine
// File: lib/engines/five-elements/five-element-engine.ts
// ==========================================================

import type { WuXingElement } from '../../../types/zwtsp.ts';
import { evaluateElementRelationship } from '../../numerology/digit-foundation.ts';

export interface FiveElementAnalysisResult {
  scores: Record<WuXingElement, number>;
  dominantElement: WuXingElement;
  weakestElement: WuXingElement;
  balancedElements: WuXingElement[];
  relationships: Array<{
    pair: [WuXingElement, WuXingElement];
    label: string;
    score: number;
  }>;
}

export class FiveElementEngine {
  public static readonly VERSION = 'WUXING-V1.0';

  /**
   * Evaluates deep Five-Element distribution and affinity relationships
   */
  public static analyzeElements(distribution: Record<WuXingElement, number>): FiveElementAnalysisResult {
    const elements: WuXingElement[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

    let maxEl: WuXingElement = 'Earth';
    let minEl: WuXingElement = 'Water';
    let maxVal = -1;
    let minVal = 9999;

    for (const el of elements) {
      const val = distribution[el] || 0;
      if (val > maxVal) {
        maxVal = val;
        maxEl = el;
      }
      if (val < minVal) {
        minVal = val;
        minEl = el;
      }
    }

    const balancedElements = elements.filter(el => {
      const val = distribution[el] || 0;
      return val >= 15 && val <= 30;
    });

    const relationships = [];
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const rel = evaluateElementRelationship(elements[i], elements[j]);
        relationships.push({
          pair: [elements[i], elements[j]] as [WuXingElement, WuXingElement],
          label: rel.label,
          score: rel.score,
        });
      }
    }

    return {
      scores: distribution,
      dominantElement: maxEl,
      weakestElement: minEl,
      balancedElements,
      relationships,
    };
  }
}
