// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Personal Number DNA Engine
// File: lib/engines/personal-dna/personal-dna-engine.ts
// ==========================================================

import type {
  BirthProfile,
  CalculationTrace,
  CalculationTraceStep,
  FourPillarsData,
  PersonalNumberDNA,
  WuXingElement,
  ZiWeiChartData,
} from '../../../types/zwtsp.ts';
import { getDigitElement, getDigitPolarity, evaluateElementRelationship } from '../../numerology/digit-foundation.ts';
import { FourPillarsEngine } from '../four-pillars/four-pillars-engine.ts';
import { FiveElementEngine } from '../five-elements/five-element-engine.ts';
import { ZiWeiEngine } from '../ziwei/ziwei-engine.ts';

export class PersonalNumberDNAEngine {
  public static readonly VERSION = 'DNA-V1.0';

  /**
   * Generates immutable Personal Number DNA from birth profile
   */
  public static generateDNA(profile: BirthProfile): PersonalNumberDNA {
    const fourPillars = FourPillarsEngine.calculateFourPillars(profile);
    const normalizedElements = FourPillarsEngine.normalizeDistribution(fourPillars.elementDistribution);
    const elementAnalysis = FiveElementEngine.analyzeElements(normalizedElements);
    const chart = ZiWeiEngine.generateChart(profile);

    const scoresByDigit: Record<number, number> = {};
    const tracesByDigit: Record<number, CalculationTrace> = {};

    for (let d = 0; d <= 9; d++) {
      const trace = this.computeDigitRelevance(d, fourPillars, normalizedElements, chart);
      scoresByDigit[d] = trace.finalScore;
      tracesByDigit[d] = trace;
    }

    // Rank digits 0-9 descending by final score
    const rankedDigits = Object.keys(scoresByDigit)
      .map(Number)
      .sort((a, b) => scoresByDigit[b] - scoresByDigit[a]);

    const coreNumbers = rankedDigits.slice(0, 4); // Top 4 Core Numbers
    const supportNumbers = rankedDigits.slice(4, 7); // Next 3 Support Numbers
    const weakNumbers = rankedDigits.slice(7, 10); // Bottom 3 Weak Numbers

    // Mark classifications on traces
    for (const d of coreNumbers) tracesByDigit[d].classification = 'Core';
    for (const d of supportNumbers) tracesByDigit[d].classification = 'Support';
    for (const d of weakNumbers) tracesByDigit[d].classification = 'Weak';

    // Average core score as macro DNA index
    const coreAvg = coreNumbers.reduce((acc, d) => acc + scoresByDigit[d], 0) / coreNumbers.length;
    const dnaScore = Number(coreAvg.toFixed(1));

    return {
      userId: profile.userId,
      coreNumbers,
      supportNumbers,
      weakNumbers,
      scoresByDigit,
      tracesByDigit,
      elementDistribution: normalizedElements,
      dominantElement: elementAnalysis.dominantElement,
      weakestElement: elementAnalysis.weakestElement,
      dnaScore,
      algorithmVersion: this.VERSION,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Evaluates the Personal Relevance Score and builds an auditable trace for digit d
   */
  private static computeDigitRelevance(
    digit: number,
    fourPillars: FourPillarsData,
    elements: Record<WuXingElement, number>,
    chart: ZiWeiChartData
  ): CalculationTrace {
    const el = getDigitElement(digit);
    const pol = getDigitPolarity(digit);
    const steps: CalculationTraceStep[] = [];

    let totalPoints = 30; // Baseline points
    steps.push({
      factor: '基准本底 (Baseline)',
      description: '本命数理基准分',
      points: 30,
    });

    // 1. Day Master & Five Elements Affinity
    const dmRel = evaluateElementRelationship(el, fourPillars.dayMasterElement);
    let dmPoints = 0;
    if (dmRel.relation === 'same') dmPoints = 15;
    else if (dmRel.relation === 'generated_by') dmPoints = 20;
    else if (dmRel.relation === 'generates') dmPoints = 12;
    else if (dmRel.relation === 'overcomes') dmPoints = 5;
    else dmPoints = -5;

    totalPoints += dmPoints;
    steps.push({
      factor: `日主五行亲和 (${fourPillars.dayMaster} · ${fourPillars.dayMasterElement})`,
      description: `${el}与日主${fourPillars.dayMasterElement}：${dmRel.label}`,
      points: dmPoints,
    });

    // Element share in chart
    const elShare = elements[el] || 0;
    const sharePoints = Math.round(elShare * 0.3); // up to +30
    totalPoints += sharePoints;
    steps.push({
      factor: `八字五行蓄能 (${el})`,
      description: `本命局${el}行占比 ${elShare}%`,
      points: sharePoints,
    });

    // 2. Zi Wei Chart Resonances (if chart is complete)
    if (chart.isComplete && chart.palaces.length > 0) {
      // Life Palace resonance
      const lifePalace = chart.palaces.find(p => p.isLifePalace);
      if (lifePalace) {
        const lpRel = evaluateElementRelationship(el, lifePalace.element);
        const lpPoints = lpRel.relation === 'same' || lpRel.relation === 'generated_by' ? 10 : 3;
        totalPoints += lpPoints;
        steps.push({
          factor: `命宫地气共振 (${lifePalace.branch} · ${lifePalace.element})`,
          description: `数字${digit}五行${el}与命宫${lifePalace.element}气场相投`,
          points: lpPoints,
        });

        // Main stars in Life or Wealth Palace
        const wealthPalace = chart.palaces.find(p => p.palaceName === '财帛宫');
        const relevantStars = [
          ...(lifePalace.stars || []),
          ...(wealthPalace?.stars || []),
        ];

        const starMatch = relevantStars.find(s => s.element === el);
        if (starMatch) {
          totalPoints += 8;
          steps.push({
            factor: `主星同气吉应 (${starMatch.starName})`,
            description: `${starMatch.starName}五行属${el}，照耀关键宫位`,
            points: 8,
          });
        }

        // Four Transformations
        const allTransforms = chart.palaces.flatMap(p => p.transformations || []);
        for (const tr of allTransforms) {
          if (tr.transformation === 'Lu') {
            totalPoints += 6;
            steps.push({
              factor: `生年化禄催发 (${tr.starName})`,
              description: `${tr.starName}化禄引动吉祥气场`,
              points: 6,
            });
            break;
          } else if (tr.transformation === 'Ji' && el === 'Water') {
            totalPoints -= 5;
            steps.push({
              factor: `生年化忌审慎 (${tr.starName})`,
              description: `${tr.starName}化忌提示克制修整`,
              points: -5,
            });
            break;
          }
        }
      }
    } else {
      steps.push({
        factor: '时柱未知提示',
        description: '出生时间未设定，略过部分星曜与宫位细化加权',
        points: 0,
      });
    }

    const finalScore = Math.min(100, Math.max(0, totalPoints));

    return {
      digit,
      element: el,
      polarity: pol,
      steps,
      finalScore,
      classification: 'Support', // will be finalized by caller
    };
  }
}
