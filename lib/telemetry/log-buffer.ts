// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) In-Memory Telemetry Log Buffer
// File: lib/telemetry/log-buffer.ts
// Fault-tolerant memory buffer for telemetry logs
// ==========================================================

export const MEMORY_LOG_LIMIT = 500;

// Global singleton buffer across hot reloads in Next.js
declare global {
  var __zwtsp_log_buffer__: Array<any> | undefined;
}

if (!global.__zwtsp_log_buffer__) {
  global.__zwtsp_log_buffer__ = [];
}

export const localLogBuffer: Array<any> = global.__zwtsp_log_buffer__;

export function addLogToBuffer(entry: any) {
  localLogBuffer.unshift(entry);
  if (localLogBuffer.length > MEMORY_LOG_LIMIT) {
    localLogBuffer.pop();
  }
}
