// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Betting Strategy & Budget Engine
// File: lib/lottery/betting-strategy-engine.ts
// Calculates permutations, operator rules (Magnum, DaMaCai, Toto), and budget recommendations
// ==========================================================

export interface PermutationInfo {
  digits: number[];
  uniqueDigitsCount: number;
  patternType: '4_DISTINCT' | '1_PAIR' | '2_PAIRS' | '3_SAME' | '4_SAME';
  patternNameZh: string;
  totalPermutations: number; // 24, 12, 6, 4, 1
}

export interface OperatorOption {
  operatorId: 'MAGNUM' | 'DAMACAI' | 'TOTO';
  operatorNameZh: string;
  recommendedPlay: string;
  straightOption: string;
  boxOptionName: string; // m-Perm, i-Box, i-Perm
  minBudgetRm: number;
}

export interface BettingStrategyRecommendation {
  targetNumber: string;
  windfallScore: number;
  suitabilityLevel: 'HIGH' | 'MODERATE' | 'DEFENSIVE';
  suitabilityTitle: string;
  suitabilityAdvice: string;
  permutationInfo: PermutationInfo;
  primaryPackage: {
    packageName: string;
    totalBudgetRm: number;
    breakdown: string[];
    expectedCoverageZh: string;
  };
  conservativePackage: {
    packageName: string;
    totalBudgetRm: number;
    breakdown: string[];
    expectedCoverageZh: string;
  };
  operators: OperatorOption[];
  responsibleDisclaimer: string;
}

export class BettingStrategyEngine {
  /**
   * Calculates the exact permutation count and classification of a 4D number
   */
  public static analyzePermutations(numberStr: string): PermutationInfo {
    const clean = numberStr.trim().slice(0, 4);
    const digits = clean.split('').map(Number);
    const freq: Record<number, number> = {};
    for (const d of digits) {
      freq[d] = (freq[d] || 0) + 1;
    }

    const counts = Object.values(freq).sort((a, b) => b - a);
    let patternType: PermutationInfo['patternType'] = '4_DISTINCT';
    let patternNameZh = '全单字无重 (24打全门)';
    let totalPermutations = 24;

    if (counts[0] === 4) {
      patternType = '4_SAME';
      patternNameZh = '四同豹子 (仅1门)';
      totalPermutations = 1;
    } else if (counts[0] === 3) {
      patternType = '3_SAME';
      patternNameZh = '三同单张 (4门全保)';
      totalPermutations = 4;
    } else if (counts[0] === 2 && counts[1] === 2) {
      patternType = '2_PAIRS';
      patternNameZh = '两组双胞对子 (6门全保)';
      totalPermutations = 6;
    } else if (counts[0] === 2) {
      patternType = '1_PAIR';
      patternNameZh = '一组对子单双 (12门全保)';
      totalPermutations = 12;
    }

    return {
      digits,
      uniqueDigitsCount: Object.keys(freq).length,
      patternType,
      patternNameZh,
      totalPermutations,
    };
  }

  /**
   * Generates rational betting strategy packages and budget breakdowns
   */
  public static generateStrategy(
    numberStr: string,
    windfallScore: number = 75
  ): BettingStrategyRecommendation {
    const perm = this.analyzePermutations(numberStr);

    let suitabilityLevel: 'HIGH' | 'MODERATE' | 'DEFENSIVE' = 'MODERATE';
    let suitabilityTitle = '稳健均衡 · 控制小额理性参与';
    let suitabilityAdvice = '今日偏财气机平稳无大煞，若有灵感契合，建议以 RM2 - RM4 极低成本小额自娱，切勿重注。';

    let primaryBudget = 3.0;
    let conservativeBudget = 2.0;

    if (windfallScore >= 80) {
      suitabilityLevel = 'HIGH';
      suitabilityTitle = '偏财生旺 · 推荐【正字+系统全保】组合';
      suitabilityAdvice = '紫微流日吉化生旺财福线，数理共振强烈。可适度采用【正字大/小 + i-Perm/m-Perm全保】双重覆盖。';
      primaryBudget = 4.0;
      conservativeBudget = 2.0;
    } else if (windfallScore <= 45) {
      suitabilityLevel = 'DEFENSIVE';
      suitabilityTitle = '大凶避耗 · 坚守为上建议投入 RM0';
      suitabilityAdvice = '紫微流日逢煞冲克财福线！易理严正提醒：今日气数阻滞暗漏，极不适合投注，建议观望复盘，严防冲动破财！';
      primaryBudget = 0.0;
      conservativeBudget = 0.0;
    }

    const primaryPackage = {
      packageName:
        suitabilityLevel === 'HIGH'
          ? '吉星强攻组合 (正字双向 + 系统全保)'
          : suitabilityLevel === 'MODERATE'
          ? '标准理性组合 (1大1小 + i-Perm)'
          : '休市蓄力方案 (纯观察记录)',
      totalBudgetRm: primaryBudget,
      breakdown:
        suitabilityLevel === 'DEFENSIVE'
          ? ['今日气运遇煞，不建议下注，投入 RM0']
          : [
              `正字直落【大】 1 注 (RM 1.00) · 覆盖头/二/三/特别/安慰`,
              `正字直落【小】 1 注 (RM 1.00) · 锁定头二三等高赔大奖`,
              perm.totalPermutations > 1
                ? `i-Perm / m-Perm 全保 1 注 (RM 1.00) · 覆盖全部 ${perm.totalPermutations} 门排列`
                : `精选单式 1 注 (RM 1.00)`,
            ],
      expectedCoverageZh:
        suitabilityLevel === 'DEFENSIVE'
          ? '0 风险静观'
          : `兼顾高倍头二三奖与 ${perm.totalPermutations} 门组选防漏`,
    };

    const conservativePackage = {
      packageName: '极低成本微额怡情包',
      totalBudgetRm: conservativeBudget,
      breakdown:
        suitabilityLevel === 'DEFENSIVE'
          ? ['今日休养生息，投入 RM0']
          : [
              `正字直落【大】 1 注 (RM 1.00)`,
              perm.totalPermutations > 1
                ? `i-Perm / m-Perm 全保 1 注 (RM 1.00)`
                : `次选变位码 1 注 (RM 1.00)`,
            ],
      expectedCoverageZh: '仅花两杯奶茶钱，微额参与享受易理推演验证乐趣',
    };

    const operators: OperatorOption[] = [
      {
        operatorId: 'MAGNUM',
        operatorNameZh: '万能 4D (Magnum)',
        recommendedPlay: '4D Classic + m-Perm',
        straightOption: 'Big / Small (大/小)',
        boxOptionName: `m-Perm (${perm.totalPermutations}打仅需 RM 1.00)`,
        minBudgetRm: 2.0,
      },
      {
        operatorId: 'DAMACAI',
        operatorNameZh: '大马彩 1+3D (DaMaCai)',
        recommendedPlay: '1+3D + i-Box',
        straightOption: 'ABC (大万) / A (小万)',
        boxOptionName: `i-Box (${perm.totalPermutations}排列 RM 1.00)`,
        minBudgetRm: 2.0,
      },
      {
        operatorId: 'TOTO',
        operatorNameZh: '多多 4D (Sports Toto)',
        recommendedPlay: 'Toto 4D + i-Perm',
        straightOption: 'Standard (大/小)',
        boxOptionName: `i-Perm (${perm.totalPermutations}门全保 RM 1.00)`,
        minBudgetRm: 2.0,
      },
    ];

    return {
      targetNumber: numberStr.trim().slice(0, 4),
      windfallScore,
      suitabilityLevel,
      suitabilityTitle,
      suitabilityAdvice,
      permutationInfo: perm,
      primaryPackage,
      conservativePackage,
      operators,
      responsibleDisclaimer:
        '【理性博彩底线】任何投注策略均仅用于优化注数结构，无法改变物理独立随机概率。请严格恪守每日娱乐预算上限，切勿借贷追号！',
    };
  }
}
