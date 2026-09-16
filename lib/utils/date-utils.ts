// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Real-time Date & Time Utilities
// File: lib/utils/date-utils.ts
// Standardizes timezone-aware real-time dates across frontends, APIs & engines
// ==========================================================

export const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';

/**
 * Returns the current date in YYYY-MM-DD format for a given timezone (defaults to Asia/Kuala_Lumpur UTC+8)
 */
export function getRealtimeDate(timezone: string = DEFAULT_TIMEZONE): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat('en-CA', { timeZone: DEFAULT_TIMEZONE }).format(new Date());
  }
}

/**
 * Returns the current time in HH:mm:ss format for a given timezone
 */
export function getRealtimeTime(timezone: string = DEFAULT_TIMEZONE): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: DEFAULT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  }
}

/**
 * Returns formatted Chinese timestamp: e.g. "2026-09-17 07:45:00 (吉隆坡时间 UTC+8)"
 */
export function getRealtimeDisplayString(timezone: string = DEFAULT_TIMEZONE): string {
  const d = getRealtimeDate(timezone);
  const t = getRealtimeTime(timezone);
  const tzName = timezone === 'Asia/Kuala_Lumpur' ? '吉隆坡' : timezone === 'Asia/Singapore' ? '新加坡' : '中国标准';
  return `${d} ${t} (${tzName}时间 UTC+8)`;
}
