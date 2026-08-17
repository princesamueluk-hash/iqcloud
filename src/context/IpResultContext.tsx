import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  IpLookupResult,
  WebRtcLeakResult,
  IpRiskAssessment,
  fetchIpInfo,
  testWebRtcLeak,
  measureLatency,
  calculateIpRiskAssessment,
} from '../utils/networkService';

export interface IpResultContextValue {
  ipResult: IpLookupResult | null;
  loading: boolean;
  error: string | null;
  targetIp: string;
  webrtc: WebRtcLeakResult | null;
  latency: { latencyMs: number; status: string } | null;
  riskAssessment: IpRiskAssessment | null;
  setTargetIp: (ip: string) => void;
  lookupIp: (query?: string, forceRefresh?: boolean) => Promise<IpLookupResult>;
  refreshClientIp: () => Promise<IpLookupResult>;
  clearResult: () => void;
  setIpResult: (result: IpLookupResult | null) => void;
}

const IpResultContext = createContext<IpResultContextValue | undefined>(undefined);

interface IpResultProviderProps {
  children: React.ReactNode;
  autoFetchClientIp?: boolean;
}

export const IpResultProvider: React.FC<IpResultProviderProps> = ({
  children,
  autoFetchClientIp = true,
}) => {
  const [ipResult, setIpResult] = useState<IpLookupResult | null>(null);
  const [targetIp, setTargetIp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [webrtc, setWebrtc] = useState<WebRtcLeakResult | null>(null);
  const [latency, setLatency] = useState<{ latencyMs: number; status: string } | null>(null);

  // Unified lookup function: single source of truth for all IP lookups
  const lookupIp = useCallback(async (query?: string, forceRefresh = true): Promise<IpLookupResult> => {
    const cleanQuery = (query !== undefined ? query : targetIp).trim();
    
    // Clear previous state and set loading immediately to prevent stale location displaying
    setLoading(true);
    setError(null);
    setIpResult(null);

    console.log(`[IpResultContext] Initiating lookup for: ${cleanQuery || 'Self Client IP'}`);

    try {
      const [info, webrtcRes, latencyRes] = await Promise.all([
        fetchIpInfo(cleanQuery, forceRefresh),
        testWebRtcLeak(),
        measureLatency(),
      ]);

      if (info.isUnavailable) {
        setError(`Unable to determine physical location for IP: ${info.ip || cleanQuery || 'current network'}.`);
      }

      console.log(`[IpResultContext] Updating state with new IP intelligence:`, info);
      setIpResult(info);
      setWebrtc(webrtcRes);
      setLatency(latencyRes);
      if (cleanQuery) {
        setTargetIp(cleanQuery);
      } else {
        setTargetIp(info.ip);
      }
      return info;
    } catch (err: any) {
      console.error(`[IpResultContext] Lookup error:`, err);
      const errMsg = err?.message || 'Failed to retrieve IP intelligence.';
      setError(errMsg);
      setIpResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [targetIp]);

  const refreshClientIp = useCallback(async (): Promise<IpLookupResult> => {
    return lookupIp('', true);
  }, [lookupIp]);

  const clearResult = useCallback(() => {
    setIpResult(null);
    setTargetIp('');
    setError(null);
    setWebrtc(null);
    setLatency(null);
  }, []);

  // Compute composite risk assessment reactively from unified state
  const riskAssessment = useMemo(() => {
    return calculateIpRiskAssessment(ipResult, webrtc);
  }, [ipResult, webrtc]);

  // Initial client IP resolution on mount
  useEffect(() => {
    if (autoFetchClientIp) {
      lookupIp('', false).catch(() => {
        // Handled internally in lookupIp
      });
    }
  }, [autoFetchClientIp, lookupIp]);

  const contextValue = useMemo<IpResultContextValue>(() => ({
    ipResult,
    loading,
    error,
    targetIp,
    webrtc,
    latency,
    riskAssessment,
    setTargetIp,
    lookupIp,
    refreshClientIp,
    clearResult,
    setIpResult,
  }), [ipResult, loading, error, targetIp, webrtc, latency, riskAssessment, lookupIp, refreshClientIp, clearResult]);

  return (
    <IpResultContext.Provider value={contextValue}>
      {children}
    </IpResultContext.Provider>
  );
};

export const useIpResult = (): IpResultContextValue => {
  const context = useContext(IpResultContext);
  if (!context) {
    throw new Error('useIpResult must be used within an IpResultProvider');
  }
  return context;
};
