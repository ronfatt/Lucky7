// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Candidate Scoring Engine
// File: lib/synthesis/candidate-scoring-engine.ts
// ==========================================================

import type {
  CalculationTraceStep,
  CandidateScoreBreakdown,
  DailyDirectionResult,
  DailyNumberActivation,
  DigitFeatureVector,
  PersonalNumberDNA,
  RealitySignalRecord,
  FourPillarsData,
  WuXingElement,
} from '../../types/zwtsp.ts';
import { DigitExtractionEngine } from '../signals/digit-extraction-engine.ts';
import { PlumBlossomEngine } from '../literature/plum-blossom-engine.ts';

const BRANCH_ELEMENT_MAP: Record<string, WuXingElement> = {
  子: 'Water', 亥: 'Water',
  寅: 'Wood', 卯: 'Wood',
  巳: 'Fire', 午: 'Fire',
  申: 'Metal', 酉: 'Metal',
  辰: 'Earth', 戌: 'Earth', 丑: 'Earth', 未: 'Earth',
};

const STEM_ELEMENT_MAP: Record<string, WuXingElement> = {
  甲: 'Wood', 乙: 'Wood',
  丙: 'Fire', 丁: 'Fire',
  戊: 'Earth', 己: 'Earth',
  庚: 'Metal', 辛: 'Metal',
  壬: 'Water', 癸: 'Water',
};

const getDigitEl = (d: number): WuXingElement =>
  (d === 1 || d === 6) ? 'Water' : (d === 2 || d === 7) ? 'Fire' : (d === 3 || d === 8) ? 'Wood' : (d === 4 || d === 9) ? 'Metal' : 'Earth';

export interface CandidateEvaluationResult {
  score: number;
  breakdown: CandidateScoreBreakdown;
  trace: CalculationTraceStep[];
}

export class CandidateScoringEngine {
  /**
   * Scores a 4-digit candidate sequence using the dynamic 7-pillar classical formula
   * Classical canon literature (Plum Blossom Body/Use + He Luo 15 Central Earth) is given top priority
   */
  public static evaluateCandidate(
    digits: number[],
    vectors: DigitFeatureVector[],
    personalDNA: PersonalNumberDNA,
    dailyActivatedDigits: DailyNumberActivation[],
    dailyDirection?: DailyDirectionResult,
    realitySignals: RealitySignalRecord[] = [],
    fourPillars?: FourPillarsData,
    birthDate?: string
  ): CandidateEvaluationResult {
    const vectorMap = new Map<number, DigitFeatureVector>();
    for (const v of vectors) {
      vectorMap.set(v.digit, v);
    }

    const hasReality = realitySignals.length > 0;
    const extraction = DigitExtractionEngine.extract(digits);

    // 1. Digit Strength (25%)
    let sumDigitStrength = 0;
    for (const d of digits) {
      sumDigitStrength += vectorMap.get(d)?.overallDigitScore ?? 60.0;
    }
    const digitStrength = Number((sumDigitStrength / digits.length).toFixed(1));

    // 2. Classical Canon Priority (15%) - 《梅花易数体用大全》李科儒 + 《象数心学》刘金府
    const numStr = digits.join('');
    const plumAnalysis = PlumBlossomEngine.analyzeNumber(numStr);

    let canonBase = 65.0;
    switch (plumAnalysis.relation) {
      case 'YONG_SHENG_TI': // 用生体 (大吉，客来生主，得天独厚)
        canonBase = 95.0;
        break;
      case 'BI_HE':         // 体用比和 (吉，五行同气，内外贯通)
        canonBase = 88.0;
        break;
      case 'TI_KE_YONG':   // 体克用 (次吉，我克彼成，克制致胜)
        canonBase = 76.0;
        break;
      case 'TI_SHENG_YONG': // 体生用 (平凶，主去生客，气机耗散)
        canonBase = 58.0;
        break;
      case 'YONG_KE_TI':   // 用克体 (凶，客来侵我，气场受制)
        canonBase = 42.0;
        break;
      default:
        canonBase = 65.0;
    }

    // 刘金府《象数心学紫微斗数》河洛十五数与中宫皇极五黄数
    let canonBonus = 0;
    if (
      extraction.digitSum === 15 ||
      extraction.digitSum === 25 ||
      extraction.digitSum === 35 ||
      extraction.digitalRoot === 5
    ) {
      canonBonus += 4.0; // 皇极十五中数共振加成
    }
    // 阴阳合十对偶 (首尾合十或中二合十: 1-9, 2-8, 3-7, 4-6, 5-5)
    if (digits[0] + digits[3] === 10 || digits[1] + digits[2] === 10) {
      canonBonus += 3.0; // 阴阳对偶天地合十加成
    }

    const canonScore = Math.min(99.0, Number((canonBase + canonBonus).toFixed(1)));
    const canonVerdict = `《梅花》${plumAnalysis.relationZh}（${plumAnalysis.tiTrigram.trigramZh}体${plumAnalysis.yongTrigram.trigramZh}用）${canonBonus > 0 ? '·河洛合吉' : ''}`;

    // 3. Personal DNA (15%)
    const coreNums = personalDNA.coreNumbers || [];
    let coreHits = 0;
    for (const d of digits) {
      if (coreNums.includes(d)) coreHits++;
    }
    const dnaScore = Number((50 + (coreHits / digits.length) * 45).toFixed(1));

    // 4. Daily Activation (15%)
    let sumDaily = 0;
    for (const d of digits) {
      const act = dailyActivatedDigits.find((a) => a.digit === d);
      sumDaily += act ? act.activationScore : 55.0;
    }
    const dailyScore = Number((sumDaily / digits.length).toFixed(1));

    // 5. Reality Signal (15%)
    let realityScore = 60.0;
    if (hasReality) {
      let sumR = 0;
      for (const d of digits) {
        const v = vectorMap.get(d)?.realityResonanceScore;
        sumR += typeof v === 'number' ? v : 50.0;
      }
      realityScore = Number((sumR / digits.length).toFixed(1));
    }

    // 6. Direction Match (10%)
    let directionScore = 60.0;
    if (dailyDirection?.spatialNumberMatrix) {
      const topDir = dailyDirection.topDirection;
      let sumDir = 0;
      for (const d of digits) {
        sumDir += dailyDirection.spatialNumberMatrix[topDir]?.[d] ?? 60.0;
      }
      directionScore = Number((sumDir / digits.length).toFixed(1));
    }

    // 7. Pattern Balance (5%)
    let patternScore = 65.0;
    if (extraction.digitalRoot === 8 || extraction.digitalRoot === 9) patternScore += 12.0;
    if (extraction.repeatCount === 1) patternScore += 8.0; // Moderate double digit resonance
    if (digits[0] === digits[3]) patternScore += 6.0; // Flanking balance
    patternScore = Math.min(98.0, patternScore);

    // 8. Four Pillars Personal Alignment (Fine-grained person-to-person differentiation)
    let personalBonus = 0;
    if (fourPillars) {
      // Leading digit (体卦首位): Day Master affinity (体卦归元)
      if (getDigitEl(digits[0]) === fourPillars.dayMasterElement) personalBonus += 6.0;
      // Second digit (坐基生旺): Day Branch affinity
      if (fourPillars.dayBranch && getDigitEl(digits[1]) === BRANCH_ELEMENT_MAP[fourPillars.dayBranch]) personalBonus += 4.5;
      // Third digit (节令根基): Month Branch or Year Stem affinity
      if (
        (fourPillars.monthBranch && getDigitEl(digits[2]) === BRANCH_ELEMENT_MAP[fourPillars.monthBranch]) ||
        (fourPillars.yearStem && getDigitEl(digits[2]) === STEM_ELEMENT_MAP[fourPillars.yearStem])
      ) {
        personalBonus += 3.5;
      }
      // Ending digit (用象纳气): Hour Branch affinity
      if (fourPillars.hourBranch && getDigitEl(digits[3]) === BRANCH_ELEMENT_MAP[fourPillars.hourBranch]) personalBonus += 5.0;

      // Birth Day numerology root
      if (birthDate) {
        const dayNum = parseInt(birthDate.split('-')[2] || '1', 10);
        const dayRoot = (dayNum % 9) || 9;
        if (digits.includes(dayRoot)) personalBonus += 3.0;
      }
    }

    // Dynamic re-normalization weights
    const wDigit = 0.25;
    const wCanon = 0.15;
    const wDna = 0.15;
    const wDaily = 0.15;
    const wReality = hasReality ? 0.15 : 0.0;
    const wDir = 0.10;
    const wPat = 0.05;

    const wSum = wDigit + wCanon + wDna + wDaily + wReality + wDir + wPat;

    const rawScore = Number(
      (
        (digitStrength * wDigit +
          canonScore * wCanon +
          dnaScore * wDna +
          dailyScore * wDaily +
          (hasReality ? realityScore * wReality : 0) +
          directionScore * wDir +
          patternScore * wPat) /
        wSum
      ).toFixed(1)
    );

    const finalScore = Math.min(99.8, Number((rawScore + personalBonus).toFixed(1)));

    const breakdown: CandidateScoreBreakdown = {
      digitStrength,
      dnaScore,
      dailyScore,
      realityScore: hasReality ? realityScore : 0,
      directionScore,
      patternScore,
      canonScore,
      canonVerdict,
      bodyUseRelation: plumAnalysis.relationZh,
      sum: extraction.digitSum,
      digitalRoot: extraction.digitalRoot,
    };

    const trace: CalculationTraceStep[] = [
      {
        factor: '单字综合实力 (25%)',
        points: Number((digitStrength * (wDigit / wSum)).toFixed(1)),
        description: `包含数字[${digits.join(',')}]在0-9特征矩阵中综合均分: ${digitStrength}分`,
      },
      {
        factor: '易理典籍优先 (15%)',
        points: Number((canonScore * (wCanon / wSum)).toFixed(1)),
        description: `李科儒《梅花易数》【${plumAnalysis.relationZh}】(${canonBase}分)${canonBonus > 0 ? ` + 刘金府《象数心学》河洛数合吉(${canonBonus}分)` : ''} -> 易理底蕴得分: ${canonScore}分`,
      },
      {
        factor: '先天DNA重叠 (15%)',
        points: Number((dnaScore * (wDna / wSum)).toFixed(1)),
        description: `与个人核心DNA数字[${coreNums.join(',')}]重合度: ${coreHits}/${digits.length} (${dnaScore}分)`,
      },
      {
        factor: '流日时空激活 (15%)',
        points: Number((dailyScore * (wDaily / wSum)).toFixed(1)),
        description: `流日干支激活系统协同分: ${dailyScore}分`,
      },
      {
        factor: '空间方位契合 (10%)',
        points: Number((directionScore * (wDir / wSum)).toFixed(1)),
        description: `首选吉方【${dailyDirection?.topDirection || 'N'}】8x10空间数理矩阵共振: ${directionScore}分`,
      },
      {
        factor: '形态数理平衡 (5%)',
        points: Number((patternScore * (wPat / wSum)).toFixed(1)),
        description: `数字和=${extraction.digitSum}, 数字根=${extraction.digitalRoot}, 形态评分: ${patternScore}分`,
      },
    ];

    if (hasReality) {
      trace.push({
        factor: '现实信号共振 (15%)',
        points: Number((realityScore * (wReality / wSum)).toFixed(1)),
        description: `与今日现实观察数字（车牌/订单等）共振均分: ${realityScore}分`,
      });
    }

    return {
      score: finalScore,
      breakdown,
      trace,
    };
  }
}
