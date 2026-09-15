// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Personal Direction Engine
// File: lib/directions/personal-direction-engine.ts
// ==========================================================

import type {
  CalculationTraceStep,
  DirectionCode,
  FourPillarsData,
  PersonalDirectionProfile,
  PersonalDirectionScore,
  PersonalNumberDNA,
  WuXingElement,
  ZiWeiChartData,
} from '../../types/zwtsp.ts';
import {
  ALL_DIRECTION_CODES,
  DIRECTION_SECTORS,
  evaluateElementAffinityScore,
} from './direction-models.ts';

// Branch relationships for Astrological Alignment
const BRANCH_TRINITIES: Record<string, string[]> = {
  申: ['子', '辰'],
  子: ['申', '辰'],
  辰: ['申', '子'],
  巳: ['酉', '丑'],
  酉: ['巳', '丑'],
  丑: ['巳', '酉'],
  寅: ['午', '戌'],
  午: ['寅', '戌'],
  戌: ['寅', '午'],
  亥: ['卯', '未'],
  卯: ['亥', '未'],
  未: ['亥', '卯'],
};

const BRANCH_HARMONIES: Record<string, string> = {
  子: '丑',
  丑: '子',
  寅: '亥',
  亥: '寅',
  卯: '戌',
  戌: '卯',
  辰: '酉',
  酉: '辰',
  巳: '申',
  申: '巳',
  午: '未',
  未: '午',
};

const BRANCH_CLASHES: Record<string, string> = {
  子: '午',
  午: '子',
  丑: '未',
  未: '丑',
  寅: '申',
  申: '寅',
  卯: '酉',
  酉: '卯',
  辰: '戌',
  戌: '辰',
  巳: '亥',
  亥: '巳',
};

export class PersonalDirectionEngine {
  public static readonly VERSION = 'DIR-PERS-V1.0';

  /**
   * Computes static Personal Direction Profile based on birth & destiny data
   */
  public static calculatePersonalDirections(
    fourPillars: FourPillarsData,
    ziweiChart: ZiWeiChartData,
    personalDNA: PersonalNumberDNA
  ): PersonalDirectionProfile {
    const traceSteps: CalculationTraceStep[] = [];
    const scoresRecord: Partial<Record<DirectionCode, PersonalDirectionScore>> = {};

    // 1. Locate Life Palace & Body Palace branches
    const lifePalace = ziweiChart.palaces?.find((p) => p.isLifePalace || p.palaceName === '命宫');
    const bodyPalace = ziweiChart.palaces?.find((p) => p.isBodyPalace);
    const lifeBranch = lifePalace ? lifePalace.branch : (ziweiChart.lifePalaceBranch || fourPillars.dayBranch);
    const bodyBranch = bodyPalace ? bodyPalace.branch : (ziweiChart.bodyPalaceBranch || lifeBranch);

    const dayMasterElement = fourPillars.dayMasterElement;
    const bureau = ziweiChart.bureau || '水二局';
    const bureauElement: WuXingElement = bureau.includes('水')
      ? 'Water'
      : bureau.includes('木')
      ? 'Wood'
      : bureau.includes('金')
      ? 'Metal'
      : bureau.includes('火')
      ? 'Fire'
      : 'Earth';

    for (const code of ALL_DIRECTION_CODES) {
      const sector = DIRECTION_SECTORS[code];
      const sectorTrace: CalculationTraceStep[] = [];

      // 1. Element Affinity (30%)
      const elementScore = evaluateElementAffinityScore(dayMasterElement, sector.element);
      sectorTrace.push({
        factor: '日主五行生克',
        points: Number((elementScore * 0.30).toFixed(1)),
        description: `日主五行【${dayMasterElement}】与方位【${sector.nameZh}(${sector.baguaName})·${sector.element}】生克指数: ${elementScore.toFixed(1)}分 (权重30%)`,
      });

      // 2. Personal Number DNA Resonance (20%)
      const luoshuDigit = sector.luoshuNumber;
      const numberDnaScore = personalDNA.scoresByDigit ? (personalDNA.scoresByDigit[luoshuDigit] ?? 60) : 60;
      sectorTrace.push({
        factor: '数理DNA共振',
        points: Number((numberDnaScore * 0.20).toFixed(1)),
        description: `方位九宫洛书数【${luoshuDigit}】在个人数理DNA亲和力: ${numberDnaScore.toFixed(1)}分 (权重20%)`,
      });

      // 3. Zi Wei Life Palace Alignment (15%)
      let lifePalaceScore = 60;
      if (sector.earthlyBranches.includes(lifeBranch)) {
        lifePalaceScore = 98;
      } else if (sector.earthlyBranches.some((b) => BRANCH_HARMONIES[lifeBranch] === b)) {
        lifePalaceScore = 90;
      } else if (sector.earthlyBranches.some((b) => (BRANCH_TRINITIES[lifeBranch] || []).includes(b))) {
        lifePalaceScore = 85;
      } else if (sector.earthlyBranches.some((b) => BRANCH_CLASHES[lifeBranch] === b)) {
        lifePalaceScore = 32;
      }
      sectorTrace.push({
        factor: '命宫地支映射',
        points: Number((lifePalaceScore * 0.15).toFixed(1)),
        description: `命宫地支【${lifeBranch}】与方位地支[${sector.earthlyBranches.join(',')}]映射分: ${lifePalaceScore.toFixed(1)}分 (权重15%)`,
      });

      // 4. Zi Wei Body Palace Alignment (10%)
      let bodyPalaceScore = 60;
      if (sector.earthlyBranches.includes(bodyBranch)) {
        bodyPalaceScore = 95;
      } else if (sector.earthlyBranches.some((b) => BRANCH_HARMONIES[bodyBranch] === b)) {
        bodyPalaceScore = 88;
      } else if (sector.earthlyBranches.some((b) => (BRANCH_TRINITIES[bodyBranch] || []).includes(b))) {
        bodyPalaceScore = 82;
      } else if (sector.earthlyBranches.some((b) => BRANCH_CLASHES[bodyBranch] === b)) {
        bodyPalaceScore = 35;
      }
      sectorTrace.push({
        factor: '身宫地支映射',
        points: Number((bodyPalaceScore * 0.10).toFixed(1)),
        description: `身宫地支【${bodyBranch}】与方位地支[${sector.earthlyBranches.join(',')}]映射分: ${bodyPalaceScore.toFixed(1)}分 (权重10%)`,
      });

      // 5. Luo Shu Core Trigram Affinity (10%)
      let luoshuScore = 55;
      const coreNums = personalDNA.coreNumbers || [];
      const supportNums = personalDNA.supportNumbers || [];
      const weakNums = personalDNA.weakNumbers || [];

      if (coreNums.includes(luoshuDigit)) {
        luoshuScore = 95;
      } else if (supportNums.includes(luoshuDigit)) {
        luoshuScore = 78;
      } else if (weakNums.includes(luoshuDigit)) {
        luoshuScore = 40;
      }
      sectorTrace.push({
        factor: '核心数理契合',
        points: Number((luoshuScore * 0.10).toFixed(1)),
        description: `方位洛书数【${luoshuDigit}】契合级别: ${luoshuScore.toFixed(1)}分 (权重10%)`,
      });

      // 6. Bagua Alignment (10%)
      const isDayYang = ['甲', '丙', '戊', '庚', '壬'].includes(fourPillars.dayStem);
      const isBaguaYang = ['乾', '震', '坎', '艮'].includes(sector.baguaName);
      const baguaScore = (isDayYang !== isBaguaYang) ? 88 : 78;
      sectorTrace.push({
        factor: '八卦阴阳合德',
        points: Number((baguaScore * 0.10).toFixed(1)),
        description: `八卦【${sector.baguaName}】与日干阴阳合德度: ${baguaScore.toFixed(1)}分 (权重10%)`,
      });

      // 7. Bureau Element Bonus (5%)
      const bureauScore = evaluateElementAffinityScore(bureauElement, sector.element);
      sectorTrace.push({
        factor: '五行局象加成',
        points: Number((bureauScore * 0.05).toFixed(1)),
        description: `五行局【${bureau}】与方位属性感应: ${bureauScore.toFixed(1)}分 (权重5%)`,
      });

      // Weighted Sum
      const totalScore = Number(
        (
          elementScore * 0.30 +
          numberDnaScore * 0.20 +
          lifePalaceScore * 0.15 +
          bodyPalaceScore * 0.10 +
          luoshuScore * 0.10 +
          baguaScore * 0.10 +
          bureauScore * 0.05
        ).toFixed(2)
      );

      scoresRecord[code] = {
        direction: code,
        score: totalScore,
        rank: 1, // updated below
        elementScore,
        numberDnaScore,
        lifePalaceScore,
        bodyPalaceScore,
        luoshuScore,
        baguaScore,
        bureauScore,
        trace: sectorTrace,
      };
    }

    // Rank the 8 sectors
    const sorted = Object.values(scoresRecord).sort((a, b) => b!.score - a!.score);
    sorted.forEach((item, index) => {
      item!.rank = index + 1;
    });

    const bestDirection = sorted[0]!.direction;
    const secondaryDirection = sorted[1]!.direction;
    const weakDirection = sorted[sorted.length - 1]!.direction;

    const summary = `先天先利【${DIRECTION_SECTORS[bestDirection].nameZh}(${DIRECTION_SECTORS[bestDirection].baguaName})】，次吉【${DIRECTION_SECTORS[secondaryDirection].nameZh}】；避忌【${DIRECTION_SECTORS[weakDirection].nameZh}】气场克耗。`;

    traceSteps.push({
      factor: '先天方位定序',
      points: sorted[0]!.score,
      description: summary,
    });

    return {
      directionScores: scoresRecord as Record<DirectionCode, PersonalDirectionScore>,
      bestDirection,
      secondaryDirection,
      weakDirection,
      summary,
      calculationTrace: traceSteps,
    };
  }
}
