// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Prediction Data Quality Engine
// File: lib/synthesis/prediction-quality-engine.ts
// ==========================================================

import type {
  DailyDirectionResult,
  DailyTimeSignature,
  PersonalNumberDNA,
  RealitySignalRecord,
} from '../../types/zwtsp.ts';

export interface DataQualityReport {
  score: number;
  isLowSignalCondition: boolean;
  warningNotice?: string;
  missingFeatures: string[];
  presentFeatures: string[];
}

export class PredictionDataQualityEngine {
  /**
   * Assesses data completeness and sufficiency before generating prediction candidates
   */
  public static evaluateDataQuality(
    personalDNA?: PersonalNumberDNA,
    dailySig?: DailyTimeSignature,
    dailyDirection?: DailyDirectionResult,
    realitySignals?: RealitySignalRecord[]
  ): DataQualityReport {
    const presentFeatures: string[] = [];
    const missingFeatures: string[] = [];
    let score = 0;

    // 1. Personal DNA available (+35)
    if (personalDNA && personalDNA.coreNumbers?.length > 0) {
      score += 35;
      presentFeatures.push('Personal DNA (先天气象)');
    } else {
      missingFeatures.push('Personal DNA (未排定出生盘)');
    }

    // 2. Daily Signature available (+25)
    if (dailySig && dailySig.dominantElement) {
      score += 25;
      presentFeatures.push('Daily Signature (流日时辰节气)');
    } else {
      missingFeatures.push('Daily Signature (缺少当日干支)');
    }

    // 3. Direction available (+20)
    if (dailyDirection && dailyDirection.topDirection) {
      score += 20;
      presentFeatures.push('Direction Compass (空间八方罗盘)');
    } else {
      missingFeatures.push('Direction Compass (未计算流日方位)');
    }

    // 4. Reality Signals available (+20)
    if (realitySignals && realitySignals.length > 0) {
      score += 20;
      presentFeatures.push(`Reality Signals (${realitySignals.length} 条现实信号)`);
    } else {
      missingFeatures.push('Reality Signals (今日无观察信号录入)');
    }

    const isLowSignalCondition = score < 45;
    let warningNotice: string | undefined;

    if (isLowSignalCondition) {
      warningNotice = '今日模型信号不足（基础气场或时空输入不齐备），不建议生成高置信度候选号码。';
    } else if (missingFeatures.includes('Reality Signals (今日无观察信号录入)')) {
      warningNotice = '提示：今日尚未录入现实数字信号，模型已自动使用先天气场与流日方位进行重归一化推演。';
    }

    return {
      score: Math.min(100, score),
      isLowSignalCondition,
      warningNotice,
      missingFeatures,
      presentFeatures,
    };
  }
}
