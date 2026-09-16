// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) 全息用户行为遥测与习惯追踪 SDK
// File: lib/telemetry/tracker.ts
// ==========================================================

export interface TelemetryPayload {
  eventType: string;
  eventLabel: string;
  pagePath?: string;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  sessionId?: string;
  metadata?: Record<string, any>;
  durationSeconds?: number;
}

class TelemetryTracker {
  private sessionId: string = '';
  private sessionStartTime: number = Date.now();
  private pageStartTime: number = Date.now();
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSession();
    }
  }

  private initSession() {
    if (this.initialized) return;
    try {
      let existingSession = sessionStorage.getItem('zwtsp_session_id');
      if (!existingSession) {
        existingSession = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
        sessionStorage.setItem('zwtsp_session_id', existingSession);
        sessionStorage.setItem('zwtsp_session_start', String(Date.now()));
      }
      this.sessionId = existingSession;
      this.sessionStartTime = Number(sessionStorage.getItem('zwtsp_session_start') || Date.now());
      this.pageStartTime = Date.now();
      this.initialized = true;

      // Handle page unload / visibility change
      window.addEventListener('beforeunload', () => {
        const pageDuration = Math.round((Date.now() - this.pageStartTime) / 1000);
        this.sendBeaconEvent({
          eventType: 'page.leave',
          eventLabel: '用户离开当前页面',
          pagePath: window.location.pathname,
          durationSeconds: pageDuration,
        });
      });
    } catch {
      this.sessionId = 'sess_' + Date.now();
    }
  }

  public getDeviceInfo() {
    if (typeof window === 'undefined') {
      return { device: 'unknown', os: 'unknown', browser: 'unknown' };
    }
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMac = /Macintosh/i.test(ua);
    const isWindows = /Windows/i.test(ua);

    let os = 'Unknown';
    if (isIOS) os = 'iOS';
    else if (isAndroid) os = 'Android';
    else if (isMac) os = 'macOS';
    else if (isWindows) os = 'Windows';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'Unknown';
    if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edge|Edg/i.test(ua)) browser = 'Edge';

    return {
      device: isMobile ? (isIOS ? 'iPhone / iOS' : 'Android Mobile') : 'Desktop',
      isMobile,
      os,
      browser,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language || 'zh-CN',
    };
  }

  public track(payload: TelemetryPayload) {
    if (typeof window === 'undefined') return;
    this.initSession();

    const deviceInfo = this.getDeviceInfo();
    const enrichedPayload: TelemetryPayload = {
      ...payload,
      pagePath: payload.pagePath || window.location.pathname,
      sessionId: this.sessionId,
      metadata: {
        ...deviceInfo,
        ...(payload.metadata || {}),
        timestampIso: new Date().toISOString(),
      },
    };

    // Send asynchronously without blocking main thread
    this.send(enrichedPayload);
  }

  public trackLogin(user: { id: string; email?: string; name?: string }) {
    this.sessionStartTime = Date.now();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('zwtsp_session_start', String(Date.now()));
    }
    this.track({
      eventType: 'auth.login',
      eventLabel: '会员安全登录',
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: {
        loginAt: new Date().toISOString(),
      },
    });
  }

  public trackLogout(user?: { id?: string; email?: string; name?: string } | null) {
    const sessionDuration = Math.round((Date.now() - this.sessionStartTime) / 1000);
    const payload: TelemetryPayload = {
      eventType: 'auth.logout',
      eventLabel: '会员安全退出登录',
      userId: user?.id,
      userEmail: user?.email,
      userName: user?.name,
      durationSeconds: sessionDuration,
      metadata: {
        sessionDurationSeconds: sessionDuration,
        logoutAt: new Date().toISOString(),
      },
    };

    // For logout, prefer sendBeacon so it fires reliably even during page refresh/redirect
    this.sendBeaconEvent(payload);
  }

  public trackPageView(path: string, title?: string) {
    this.pageStartTime = Date.now();
    this.track({
      eventType: 'page.view',
      eventLabel: `访问页面: ${title || path}`,
      pagePath: path,
      metadata: {
        pageTitle: title || path,
      },
    });
  }

  public trackPrediction(number: string, score?: number, extra?: Record<string, any>) {
    this.track({
      eventType: 'prediction.generate',
      eventLabel: `推演出号码 [${number}]`,
      metadata: {
        motherCode: number,
        score,
        ...(extra || {}),
      },
    });
  }

  public trackBookmark(number: string, operator?: string) {
    this.track({
      eventType: 'prediction.save',
      eventLabel: `收藏心水号码 [${number}]`,
      metadata: {
        number,
        operator: operator || '万能/多多/大马彩',
      },
    });
  }

  public trackCompass(hour: string, direction: string, wealthGod?: string) {
    this.track({
      eventType: 'compass.query',
      eventLabel: `查阅时空吉位罗盘 [${hour} · ${direction}]`,
      metadata: {
        hour,
        direction,
        wealthGod,
      },
    });
  }

  private send(payload: TelemetryPayload) {
    try {
      fetch('/api/telemetry/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => {
        console.debug('[Telemetry] Fetch notice:', err);
      });
    } catch (e) {
      console.debug('[Telemetry] Send error:', e);
    }
  }

  private sendBeaconEvent(payload: TelemetryPayload) {
    if (typeof window === 'undefined') return;
    try {
      const data = JSON.stringify({
        ...payload,
        sessionId: this.sessionId,
        pagePath: payload.pagePath || window.location.pathname,
        metadata: {
          ...this.getDeviceInfo(),
          ...(payload.metadata || {}),
          timestampIso: new Date().toISOString(),
        },
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('/api/telemetry/log', blob);
      } else {
        this.send(payload);
      }
    } catch {
      this.send(payload);
    }
  }
}

export const tracker = new TelemetryTracker();
