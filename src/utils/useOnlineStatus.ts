import { useState, useEffect, useCallback } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      // Attempt quick fetch with cache busting and short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`/api/health?t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      }).catch(async () => {
        // Fallback check to favicon or root if API route unavailable
        return fetch(`/favicon.ico?t=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);
      const online = Boolean(response && response.ok);
      setIsOnline(online);
      setIsChecking(false);
      return online;
    } catch {
      const browserOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
      setIsOnline(browserOnline);
      setIsChecking(false);
      return browserOnline;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      // Validate with network ping
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  return { isOnline, isChecking, checkConnection };
}
