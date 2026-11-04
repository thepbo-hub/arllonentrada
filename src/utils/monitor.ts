/**
 * Lightweight Client Performance & Health Diagnostics Monitor
 * Captures non-intrusive Web Vitals and global errors without exposing sensitive data.
 */

export interface SystemHealthReport {
  status: 'healthy' | 'degraded';
  timestamp: string;
  viewport: { width: number; height: number };
  memory?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
  };
  navigation?: {
    domComplete?: number;
    loadTime?: number;
  };
}

export function initGlobalErrorMonitoring() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    // Structured console logging for debugging without exposing secrets
    console.warn('[Monitor] Unhandled Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString(),
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Monitor] Unhandled Promise Rejection:', {
      reason: event.reason instanceof Error ? event.reason.message : String(event.reason),
      timestamp: new Date().toISOString(),
    });
  });
}

export function getSystemHealth(): SystemHealthReport {
  const isBrowser = typeof window !== 'undefined';
  const width = isBrowser ? window.innerWidth : 0;
  const height = isBrowser ? window.innerHeight : 0;

  let memoryInfo: SystemHealthReport['memory'] = undefined;
  if (isBrowser && 'performance' in window && 'memory' in (window.performance as unknown as Record<string, unknown>)) {
    const mem = (window.performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
    memoryInfo = {
      usedJSHeapSize: Math.round(mem.usedJSHeapSize / (1024 * 1024)),
      totalJSHeapSize: Math.round(mem.totalJSHeapSize / (1024 * 1024)),
    };
  }

  let navInfo: SystemHealthReport['navigation'] = undefined;
  if (isBrowser && 'performance' in window) {
    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (timing) {
      navInfo = {
        domComplete: Math.round(timing.domComplete),
        loadTime: Math.round(timing.loadEventEnd),
      };
    }
  }

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    viewport: { width, height },
    memory: memoryInfo,
    navigation: navInfo,
  };
}
