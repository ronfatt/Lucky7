// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Direction Domain Models & Standards
// File: lib/directions/direction-models.ts
// ==========================================================

import type {
  DirectionCode,
  DirectionSector,
  DirectionTier,
  WuXingElement,
} from '../../types/zwtsp.ts';

export const DIRECTION_SECTORS: Record<DirectionCode, DirectionSector> = {
  N: {
    code: 'N',
    nameZh: '正北',
    nameEn: 'North',
    degreeCenter: 0.0,
    degreeMin: 337.5,
    degreeMax: 22.5,
    baguaName: '坎',
    baguaTrigram: '☵',
    element: 'Water',
    luoshuNumber: 1,
    earthlyBranches: ['子'],
  },
  NE: {
    code: 'NE',
    nameZh: '东北',
    nameEn: 'North-East',
    degreeCenter: 45.0,
    degreeMin: 22.5,
    degreeMax: 67.5,
    baguaName: '艮',
    baguaTrigram: '☶',
    element: 'Earth',
    luoshuNumber: 8,
    earthlyBranches: ['丑', '寅'],
  },
  E: {
    code: 'E',
    nameZh: '正东',
    nameEn: 'East',
    degreeCenter: 90.0,
    degreeMin: 67.5,
    degreeMax: 112.5,
    baguaName: '震',
    baguaTrigram: '☳',
    element: 'Wood',
    luoshuNumber: 3,
    earthlyBranches: ['卯'],
  },
  SE: {
    code: 'SE',
    nameZh: '东南',
    nameEn: 'South-East',
    degreeCenter: 135.0,
    degreeMin: 112.5,
    degreeMax: 157.5,
    baguaName: '巽',
    baguaTrigram: '☴',
    element: 'Wood',
    luoshuNumber: 4,
    earthlyBranches: ['辰', '巳'],
  },
  S: {
    code: 'S',
    nameZh: '正南',
    nameEn: 'South',
    degreeCenter: 180.0,
    degreeMin: 157.5,
    degreeMax: 202.5,
    baguaName: '离',
    baguaTrigram: '☲',
    element: 'Fire',
    luoshuNumber: 9,
    earthlyBranches: ['午'],
  },
  SW: {
    code: 'SW',
    nameZh: '西南',
    nameEn: 'South-West',
    degreeCenter: 225.0,
    degreeMin: 202.5,
    degreeMax: 247.5,
    baguaName: '坤',
    baguaTrigram: '☷',
    element: 'Earth',
    luoshuNumber: 2,
    earthlyBranches: ['未', '申'],
  },
  W: {
    code: 'W',
    nameZh: '正西',
    nameEn: 'West',
    degreeCenter: 270.0,
    degreeMin: 247.5,
    degreeMax: 292.5,
    baguaName: '兑',
    baguaTrigram: '☱',
    element: 'Metal',
    luoshuNumber: 7,
    earthlyBranches: ['酉'],
  },
  NW: {
    code: 'NW',
    nameZh: '西北',
    nameEn: 'North-West',
    degreeCenter: 315.0,
    degreeMin: 292.5,
    degreeMax: 337.5,
    baguaName: '乾',
    baguaTrigram: '☰',
    element: 'Metal',
    luoshuNumber: 6,
    earthlyBranches: ['戌', '亥'],
  },
};

export const ALL_DIRECTION_CODES: DirectionCode[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/**
 * Normalizes any azimuth degree into standard [0, 360) range
 */
export function normalizeAzimuth(degree: number): number {
  let normalized = degree % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return Number(normalized.toFixed(1));
}

/**
 * Resolves a given compass azimuth degree (0° = North, clockwise) to the corresponding 45° sector
 */
export function getSectorFromAzimuth(degree: number): DirectionSector {
  const norm = normalizeAzimuth(degree);

  // Sector N wraps around 0 / 360 (337.5 <= deg < 360 or 0 <= deg < 22.5)
  if (norm >= 337.5 || norm < 22.5) {
    return DIRECTION_SECTORS.N;
  }
  if (norm >= 22.5 && norm < 67.5) {
    return DIRECTION_SECTORS.NE;
  }
  if (norm >= 67.5 && norm < 112.5) {
    return DIRECTION_SECTORS.E;
  }
  if (norm >= 112.5 && norm < 157.5) {
    return DIRECTION_SECTORS.SE;
  }
  if (norm >= 157.5 && norm < 202.5) {
    return DIRECTION_SECTORS.S;
  }
  if (norm >= 202.5 && norm < 247.5) {
    return DIRECTION_SECTORS.SW;
  }
  if (norm >= 247.5 && norm < 292.5) {
    return DIRECTION_SECTORS.W;
  }
  return DIRECTION_SECTORS.NW;
}

/**
 * Categorize raw score into display tiers
 */
export function getDirectionTier(score: number): DirectionTier {
  if (score >= 82) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 55) return 'NEUTRAL';
  if (score >= 40) return 'MODEST';
  return 'CAUTION';
}

/**
 * Five Elements Interaction Score (0-100)
 * Source (A) interacting with Target (B)
 */
export function evaluateElementAffinityScore(source: WuXingElement, target: WuXingElement): number {
  if (source === target) return 85; // 同气相求

  // Generating cycle: Wood -> Fire -> Earth -> Metal -> Water -> Wood
  const generates: Record<WuXingElement, WuXingElement> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood',
  };

  // Controlling cycle: Wood -> Earth -> Water -> Fire -> Metal -> Wood
  const controls: Record<WuXingElement, WuXingElement> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood',
  };

  if (generates[source] === target) {
    return 95; // Source generates Target (生出/相生)
  }
  if (generates[target] === source) {
    return 90; // Target generates Source (受生/生我)
  }
  if (controls[source] === target) {
    return 48; // Source controls Target (我克)
  }
  if (controls[target] === source) {
    return 30; // Target controls Source (克我/受制)
  }

  return 60;
}
