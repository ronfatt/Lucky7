// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Core TypeScript Types
// File: types/zwtsp.ts
// ==========================================================

export type WuXingElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type FiveElement = WuXingElement;
export type YinYangPolarity = 'Yang' | 'Yin';

export type CompassDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'Center';

export type OpportunityLevel = 'LOW' | 'WEAK' | 'NORMAL' | 'STRONG' | 'VERY STRONG';

export type BirthTimePrecision = 'EXACT' | 'APPROXIMATE' | 'UNKNOWN';

export interface LuoShuCell {
  digit: number;
  row: number;
  col: number;
  palaceName: string; // 坎, 坤, 震, 巽, 中, 乾, 兑, 艮, 离
  direction: CompassDirection;
  element: WuXingElement;
  gua: string;
}

export interface NumerologyRule {
  id?: string;
  ruleName: string;
  ruleType: 'digit_element' | 'yin_yang' | 'hetu_pair' | 'luoshu_coord' | 'digital_root';
  inputValue: string;
  outputValue: string;
  weight: number;
  version: string;
  source: string;
  active: boolean;
  notes?: string;
}

export interface PalaceDefinition {
  id?: string;
  name: string; // e.g. 命宫, 财帛宫
  meaning: string;
  keywords: string[];
  defaultWeight: number;
  numberSources: number[];
  realityKeywords: string[];
  active: boolean;
  version: string;
}

export interface StarDefinition {
  id?: string;
  name: string; // e.g. 紫微, 天机
  baseElement: WuXingElement;
  yinYang: 'Yang' | 'Yin' | 'Dual';
  meaning: string;
  active: boolean;
}

export interface TransformationDefinition {
  id?: string;
  starName: string;
  transformation: 'Lu' | 'Quan' | 'Ke' | 'Ji';
  meaning: string;
  numberEffect: string;
  weight: number;
  version: string;
  active: boolean;
}

export interface BirthProfile {
  id?: string;
  userId?: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm:ss
  birthTimePrecision: BirthTimePrecision;
  birthPlace?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  calendarType: 'gregorian' | 'lunar';
}

export interface FourPillarsData {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem?: string;
  hourBranch?: string;
  yearElement: WuXingElement;
  monthElement: WuXingElement;
  dayElement: WuXingElement;
  hourElement?: WuXingElement;
  dayMaster: string; // Day Stem
  dayMasterElement: WuXingElement;
  elementDistribution: Record<WuXingElement, number>;
  isHourKnown: boolean;
  calculationVersion: string;
}

export type ZiWeiBureau = '水二局' | '木三局' | '金四局' | '土五局' | '火六局';

export interface StarPlacement {
  starName: string;
  element: WuXingElement;
  brightness?: string; // 庙, 旺, 得, 利, 平, 不, 陷
  isMainStar: boolean;
}

export interface TransformationInstance {
  starName: string;
  transformation: 'Lu' | 'Quan' | 'Ke' | 'Ji';
  label: string; // e.g. "化禄", "化权"
}

export interface ZiWeiPalaceInstance {
  palaceName: string; // 命宫, 兄弟宫...
  branch: string; // 子, 丑, 寅...
  position: number; // 0 to 11
  element: WuXingElement;
  stars: StarPlacement[];
  transformations: TransformationInstance[];
  isLifePalace: boolean;
  isBodyPalace: boolean;
  score: number;
}

export interface ZiWeiChartData {
  bureau: ZiWeiBureau;
  lifePalaceBranch: string;
  lifePalacePosition: number;
  bodyPalaceBranch: string;
  bodyPalacePosition: number;
  palaces: ZiWeiPalaceInstance[];
  calculationVersion: string;
  isComplete: boolean;
  missingDataReason?: string;
}

export interface CalculationTraceStep {
  factor: string;
  description: string;
  points: number;
}

export interface CalculationTrace {
  digit: number;
  element: WuXingElement;
  polarity: YinYangPolarity;
  steps: CalculationTraceStep[];
  finalScore: number;
  classification: 'Core' | 'Support' | 'Weak' | 'Primary' | 'Secondary';
}

export interface PersonalNumberDNA {
  userId?: string;
  coreNumbers: number[]; // Top 3-5
  supportNumbers: number[]; // Middle 3-4
  weakNumbers: number[]; // Bottom 2-3
  scoresByDigit: Record<number, number>; // 0-9 scores (0-100)
  tracesByDigit: Record<number, CalculationTrace>;
  elementDistribution: Record<WuXingElement, number>;
  dominantElement: WuXingElement;
  weakestElement: WuXingElement;
  dnaScore: number;
  algorithmVersion: string;
  createdAt: string;
}

export interface SolarTermInfo {
  currentTerm: string;
  previousTerm: string;
  nextTerm: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'FourSeasonsEnd';
  seasonZh: string;
  termStartDate: string;
  termEndDate: string;
}

export interface DailyTimeSignature {
  date: string;
  timezone: string;
  gregorianDate: string;
  lunarDate: string;
  solarTerm: SolarTermInfo;
  yearStemBranch: string;
  monthStemBranch: string;
  dayStemBranch: string;
  dayStem?: string;
  dayBranch?: string;
  hourStemBranch: string;
  woodScore: number;
  fireScore: number;
  earthScore: number;
  metalScore: number;
  waterScore: number;
  dominantElement: WuXingElement;
  secondaryElement: WuXingElement;
  weakElement: WuXingElement;
  opportunityScore: number;
  opportunityLevel: OpportunityLevel;
  primaryWindow: string;
  secondaryWindow: string;
  avoidWindow: string;
  calculationVersion: string;
}

export interface DailyNumberActivation {
  digit: number;
  personalBaseScore: number;
  elementScore: number;
  timeScore: number;
  palaceScore: number;
  starScore: number;
  transformationScore: number;
  activationScore: number;
  rank: number;
  classification: 'Primary' | 'Secondary' | 'Weak';
  trace: CalculationTraceStep[];
}

export interface DailyPalaceActivation {
  palaceName: string;
  baseScore: number;
  timeScore: number;
  elementScore: number;
  starScore: number;
  transformationScore: number;
  activationScore: number;
  status: OpportunityLevel;
}

export interface NumberFeatures {
  rawDigits: number[];
  digitString: string;
  length: number;
  digitSum: number;
  digitalRoot: number;
  oddCount: number;
  evenCount: number;
  oddEvenRatio: number;
  highCount: number; // 5-9
  lowCount: number;  // 0-4
  highLowRatio: number;
  repeatedDigits: { [digit: number]: number };
  maxRepeatCount: number;
  consecutiveCount: number;
  elementDistribution: { [key in WuXingElement]: number };
  dominantElement: WuXingElement;
  luoShuCoverage: LuoShuCell[];
  heTuPairsFound: Array<{ pair: [number, number]; element: WuXingElement; label: string }>;
  tailPattern: number;
  range: number;
}

export interface WeightConfiguration {
  weightDestiny: number;         // default 15
  weightBazi: number;            // default 15
  weightStars: number;           // default 10
  weightTransformations: number; // default 5
  weightElements: number;        // default 10
  weightLuoshu: number;          // default 10
  weightReality: number;         // default 5
  weightHistorical: number;      // default 20
  weightStructure: number;       // default 10
}

export interface DigitScores {
  digit: number;
  personalScore: number;
  timeScore: number;
  elementScore: number;
  palaceScore: number;
  starScore: number;
  transformationScore: number;
  luoshuScore: number;
  historicalScore: number;
  realityScore: number;
  finalScore: number;
}

export interface OpportunityWindow {
  score: number;
  level: OpportunityLevel;
  primaryTimeWindow: string;
  secondaryTimeWindow: string;
  avoidTimeWindow: string;
  cautionNotice?: string;
}

export interface MotherVariationResult {
  motherCode: string;
  variations: string[];
  derivationMethod: string;
}

// ==========================================================
// Phase 4: Direction & Compass Types
// ==========================================================

export type DirectionCode = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export type DirectionTier = 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'MODEST' | 'CAUTION';

export interface DirectionSector {
  code: DirectionCode;
  nameZh: string;
  nameEn: string;
  degreeCenter: number;
  degreeMin: number;
  degreeMax: number;
  baguaName: string;
  baguaTrigram: string;
  element: WuXingElement;
  luoshuNumber: number;
  earthlyBranches: string[];
}

export interface PersonalDirectionScore {
  direction: DirectionCode;
  score: number;
  rank: number;
  elementScore: number;
  numberDnaScore: number;
  lifePalaceScore: number;
  bodyPalaceScore: number;
  luoshuScore: number;
  baguaScore: number;
  bureauScore: number;
  trace: CalculationTraceStep[];
}

export interface PersonalDirectionProfile {
  userId?: string;
  birthProfileId?: string;
  directionScores: Record<DirectionCode, PersonalDirectionScore>;
  bestDirection: DirectionCode;
  secondaryDirection: DirectionCode;
  weakDirection: DirectionCode;
  summary: string;
  calculationTrace: CalculationTraceStep[];
}

export interface DailyDirectionBreakdown {
  personalCompatibility: number;
  elementInteraction: number;
  activatedDigitsScore: number;
  palaceResonance: number;
  timeWindowScore: number;
  starTransScore: number;
}

export interface DailyDirectionSectorScore {
  direction: DirectionCode;
  score: number;
  rank: number;
  tier: DirectionTier;
  breakdown: DailyDirectionBreakdown;
  resonantDigits: number[];
  auspiciousHours: string[];
  description: string;
}

export interface DailyDirectionResult {
  date: string;
  topDirection: DirectionCode;
  secondaryDirection: DirectionCode;
  leastDirection: DirectionCode;
  isContested: boolean;
  contestedReason?: string;
  confidenceScore: number;
  consistencyScore: number;
  directionScores: Record<DirectionCode, DailyDirectionSectorScore>;
  spatialNumberMatrix: Record<DirectionCode, Record<number, number>>;
  calculationTrace: CalculationTraceStep[];
}

// ==========================================================
// Phase 5: Reality Signal Types
// ==========================================================

export type RealitySignalType =
  | 'VEHICLE_PLATE'
  | 'HOUSE_NUMBER'
  | 'RECEIPT_NUMBER'
  | 'ORDER_NUMBER'
  | 'ROOM_NUMBER'
  | 'SEAT_NUMBER'
  | 'FLOOR_NUMBER'
  | 'PHONE_SUFFIX'
  | 'TIME_OBSERVATION'
  | 'TICKET_NUMBER'
  | 'ADDRESS_NUMBER'
  | 'MANUAL_OBSERVATION';

export type SignalContext =
  | 'TRAVEL'
  | 'HOME'
  | 'WORK'
  | 'FOOD'
  | 'SHOPPING'
  | 'EVENT'
  | 'FAMILY'
  | 'SOCIAL'
  | 'TRANSPORT'
  | 'OTHER';

export type SignalPatternType =
  | 'REPEATED_DIGIT'
  | 'DOUBLE_DIGIT'
  | 'TRIPLE_DIGIT'
  | 'ASCENDING'
  | 'DESCENDING'
  | 'MIRROR'
  | 'REVERSE_SEQUENCE'
  | 'PAIR_REPETITION'
  | 'DIGIT_SUM_REPETITION'
  | 'DIGITAL_ROOT_REPETITION';

export interface RealitySignalInput {
  id?: string;
  userId?: string;
  signalType: RealitySignalType;
  rawValue: string;
  normalizedValue?: string;
  sourceDescription?: string;
  observationTime?: string; // HH:mm:ss
  timezone?: string;
  locationLabel?: string;
  direction?: DirectionCode | 'Unknown';
  context?: SignalContext;
  notes?: string;
}

export interface RealitySignalRecord extends RealitySignalInput {
  id: string;
  normalizedDigits: number[];
  normalizedLetters: string[];
  numericValue: string;
  digitCount: number;
  resonanceScore: number;
  qualityScore: number;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  status: OpportunityLevel;
  dnaMatchScore: number;
  dailyMatchScore: number;
  directionMatchScore: number | 'NOT_AVAILABLE';
  timeMatchScore: number | 'NOT_AVAILABLE';
  patternScore: number;
  sourceWeight: number;
  effectiveWeights: Record<string, number>;
  patternsDetected: SignalPatternType[];
  calculationVersion: string;
  createdAt: string;
}

// ==========================================================
// Phase 6: Number Synthesis & Backtest Types
// ==========================================================

export interface GameProfile {
  id: string;
  name: string;
  country: string;
  operator: string;
  digitLength: number;
  minDigit: number;
  maxDigit: number;
  drawFrequency: string;
  active: boolean;
  version: string;
}

export type MalaysianOperator = 'MAGNUM' | 'DAMACAI' | 'TOTO' | 'SABAH88' | 'STC' | 'CASHSWEEP' | 'SINGAPORE' | 'ALL';

export type MalaysianPrizeTier = 'FIRST' | 'SECOND' | 'THIRD' | 'SPECIAL' | 'CONSOLATION';

export interface DrawResultRecord {
  id: string;
  gameProfileId: string;
  operator?: MalaysianOperator;
  drawNo?: string;
  drawDate: string; // YYYY-MM-DD
  drawTime: string; // HH:mm:ss
  timezone: string;
  resultNumber: string; // 1st prize or generic 4D
  digits: number[];
  firstPrize?: string;
  secondPrize?: string;
  thirdPrize?: string;
  specialPrizes?: string[];
  consolationPrizes?: string[];
  allWinningNumbers?: string[];
  source: string;
  verified: boolean;
  createdAt: string;
}

export interface Malaysian4DDrawRecord extends DrawResultRecord {
  operator: MalaysianOperator;
  drawNo: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  specialPrizes: string[];
  consolationPrizes: string[];
  allWinningNumbers: string[];
}

export interface OperatorHitDetail {
  drawDate: string;
  drawNo: string;
  operator: MalaysianOperator;
  tier: MalaysianPrizeTier;
  tierName: string;
  number: string;
}

export interface NumberPatternAnalysis {
  targetNumber: string;
  totalDrawsScanned: number;
  totalHits: number;
  hitRatePercent: number;
  operatorHits: {
    MAGNUM: number;
    DAMACAI: number;
    TOTO: number;
    OTHERS: number;
  };
  tierHits: {
    first: number;
    second: number;
    third: number;
    special: number;
    consolation: number;
  };
  hitRecords: OperatorHitDetail[];
  sum: number;
  digitalRoot: number;
  parity: 'ALL_ODD' | '3_ODD_1_EVEN' | '2_ODD_2_EVEN' | '1_ODD_3_EVEN' | 'ALL_EVEN';
  parityRatio: string;
  sizeRatio: string;
  primaryElement: FiveElement;
  elementComposition: Record<FiveElement, number>;
  leadingDigit: number;
  trailingDigit: number;
  daysSinceLastHit: number | 'NEVER';
  hotColdStatus: 'HOT' | 'WARM' | 'COLD';
  top3Hits?: number;
  top3HitRatePercent?: number;
  omissionStats?: {
    currentOmission: number;
    averageOmission: number;
    maxOmission: number;
    omissionStatus: 'EXTREME_COLD' | 'COLD' | 'WARM' | 'HOT';
  };
  sameStemBranchStats?: {
    dayStem: string;
    stemHitCount: number;
    summary: string;
  };
}


export interface DigitFeatureVector {
  digit: number;
  personalDnaScore: number;
  dailyActivationScore: number;
  realityResonanceScore: number | 'NOT_AVAILABLE';
  directionScore: number;
  frequencyScore: number;
  patternScore: number;
  elementScore: number;
  overallDigitScore: number;
  rank: number;
  availableFeatures: string[];
  effectiveWeights: Record<string, number>;
}

export interface CandidateScoreBreakdown {
  digitStrength: number;
  dnaScore: number;
  dailyScore: number;
  realityScore: number;
  directionScore: number;
  patternScore: number;
  canonScore: number;
  canonVerdict?: string;
  bodyUseRelation?: string;
  sum: number;
  digitalRoot: number;
}

export interface PredictionCandidate {
  number: string;
  rank: number;
  score: number;
  breakdown: CandidateScoreBreakdown;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  generationMethod: 'PRIMARY_PERMUTATION' | 'REPEATED_COMBO' | 'SECONDARY_SUBSTITUTED' | 'DIRECT_SYNTHESIS';
  parentNumber?: string;
  trace: CalculationTraceStep[];
}

export interface MotherCodeResult {
  motherCode: string;
  score: number;
  rank: 1;
  breakdown: CandidateScoreBreakdown;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  resonantDigits: number[];
  summary: string;
}

export type VariationType =
  | 'PERMUTATION'
  | 'REVERSE'
  | 'MIRROR'
  | 'ROTATION'
  | 'PAIR_SWAP'
  | 'DIGIT_SUBSTITUTION';

export interface VariationCodeRecord {
  parentNumber: string;
  variationType: VariationType;
  resultNumber: string;
  variationScore: number;
  rank: number;
  explanation: string;
}

export interface DailyPredictionSnapshot {
  id?: string;
  userId?: string;
  gameProfileId: string;
  predictionDate: string;
  motherCode: MotherCodeResult;
  topCandidates: PredictionCandidate[];
  variations: VariationCodeRecord[];
  digitRanking: DigitFeatureVector[];
  dataQualityScore: number;
  modelConsistency: 'LOW' | 'NORMAL' | 'HIGH';
  calculationVersion: string;
  createdAt: string;
}

export interface BacktestDrawEvaluation {
  drawId: string;
  drawDate: string;
  operator?: MalaysianOperator;
  drawNo?: string;
  actualNumber: string;
  motherCode: string;
  topCandidates: string[];
  exactMatch: boolean;
  positionMatches: number;
  digitSetMatch: boolean;
  partialDigitHits: number;
  rankOfActual?: number;
  top3Hit?: boolean;
  winningTier?: MalaysianPrizeTier;
  all23Hit?: boolean;
}

export interface BacktestMetricsSummary {
  gameProfileId: string;
  operator?: MalaysianOperator;
  startDate: string;
  endDate: string;
  sampleSize: number;
  exactHitCount: number;
  exactHitRate: number;
  top5HitRate: number;
  top10HitRate: number;
  top20HitRate: number;
  top3HitRate?: number;
  full23HitRate?: number;
  avgDigitHits: number;
  avgPositionHits: number;
  randomBaselineTop5: number;
  randomBaselineExact: number;
  outperformingBaseline: boolean;
  evaluations: BacktestDrawEvaluation[];
}

export interface AblationTestResult {
  modelName: string;
  featuresUsed: string[];
  exactHitRate: number;
  top5HitRate: number;
  top10HitRate: number;
  top20HitRate: number;
  avgDigitHits: number;
}

export type LiteratureLineage =
  | 'QIN_TIAN'
  | 'FEI_XING'
  | 'XIANG_SHU'
  | 'MEI_HUA'
  | 'LI_QI'
  | 'PRACTICAL';

export interface LiteratureChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  keyQuotes: string[];
  keywords: string[];
}

export interface ClassicalLiterature {
  id: string;
  title: string;
  author: string;
  lineage: LiteratureLineage;
  lineageName: string;
  pageCount: number;
  fileName: string;
  summary: string;
  coreTheories: string[];
  tags: string[];
  chapters: LiteratureChapter[];
}

export interface MetaphysicalCitation {
  id: string;
  sourceLiteratureId: string;
  sourceTitle: string;
  author: string;
  chapterTitle?: string;
  originalQuote: string;
  metaphysicalInterpretation: string;
  appliedAspect: 'NUMBER' | 'TIME' | 'DIRECTION' | 'TRANSFORMATION' | 'PALACE';
  relatedDigits?: number[];
  relatedElements?: FiveElement[];
  relatedTransformations?: ('LU' | 'QUAN' | 'KE' | 'JI')[];
}

export interface PlumBlossomTrigramMapping {
  digit: number; // 1-8 (0 mapped to 8 or earth)
  trigram: 'QIAN' | 'DUI' | 'LI' | 'ZHEN' | 'XUN' | 'KAN' | 'GEN' | 'KUN';
  trigramZh: string;
  nature: string;
  element: FiveElement;
  yinYang: 'Yang' | 'Yin';
  bodyUseMeaning: string;
}

export interface FlyingStarSiHuaPattern {
  id: string;
  fromPalace: string;
  siHuaType: 'LU' | 'QUAN' | 'KE' | 'JI';
  siHuaName: string;
  toPalace: string;
  canonicalMeaning: string;
  numberImplication: string;
  sourceLiterature: string;
}
