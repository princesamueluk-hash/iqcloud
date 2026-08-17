import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Info, Lock } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import {
  getClientNetworkTelemetry,
  analyzeVpnIndicators,
  VpnDetectionAnalysis,
} from '../../utils/networkService';

export const VpnDetectionTool: React.FC = () => {
  const { ipResult, webrtc, loading: contextLoading, refreshClientIp } = useIpResult();
  const [analysis, setAnalysis] = useState<VpnDetectionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const freshIp = await refreshClientIp();
      const telem = getClientNetworkTelemetry();
      const result = analyzeVpnIndicators(freshIp, webrtc, telem);
      setAnalysis(result);
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ipResult) {
      const telem = getClientNetworkTelemetry();
      const result = analyzeVpnIndicators(ipResult, webrtc, telem);
      setAnalysis(result);
    }
  }, [ipResult, webrtc]);

  const isBusy = loading || contextLoading;

  return (
    <div id="vpn-detection-tool" className="space-y-8">
      {/* Risk Score Summary Banner */}
      <div className="border-2 border-black bg-white p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black pb-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 block mb-1">
              Multi-Signal Heuristic Analysis
            </span>
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                {isBusy ? 'Analyzing Connection...' : `VPN Risk: ${analysis?.riskLevel.toUpperCase() || 'EVALUATING'}`}
              </h2>
            </div>
            <p className="text-sm text-neutral-700 mt-1 font-medium">
              Tested IP: <strong className="font-mono text-black">{analysis?.ip || ipResult?.ip || 'Detecting...'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-mono text-xs uppercase font-bold text-neutral-600 block">
                Probability Score
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-black text-black">
                {isBusy ? '--' : `${analysis?.riskScore ?? 0}%`}
              </span>
            </div>
            <button
              onClick={runAudit}
              disabled={isBusy}
              className="px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isBusy ? 'animate-spin' : ''}`} />
              <span>Re-Run Audit</span>
            </button>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold text-black">
            <span>Low Risk (Direct / Residential)</span>
            <span>Moderate Anomaly</span>
            <span>High Probability VPN / Datacenter</span>
          </div>
          <div className="w-full h-4 bg-neutral-200 border-2 border-black overflow-hidden relative">
            <div
              className={`h-full transition-all duration-700 ${
                analysis?.riskLevel === 'Low'
                  ? 'bg-black'
                  : analysis?.riskLevel === 'Medium'
                  ? 'bg-amber-600'
                  : 'bg-red-700'
              }`}
              style={{ width: `${isBusy ? 10 : analysis?.riskScore || 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown of Individual Heuristic Signals */}
      {analysis && !isBusy && (
        <div className="border-2 border-black bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h3 className="text-lg font-bold text-black uppercase tracking-wide">
              Diagnostic Signal Breakdown
            </h3>
            <span className="font-mono text-xs font-bold text-neutral-600">
              Heuristic Engine
            </span>
          </div>

          <div className="space-y-4">
            {analysis.signals.map((sig, idx) => {
              const isPositive = sig.status === 'positive';
              return (
                <div
                  key={idx}
                  className={`p-4 border-2 flex items-start justify-between gap-4 ${
                    isPositive ? 'bg-amber-50 border-amber-800' : 'bg-neutral-50 border-neutral-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {isPositive ? (
                      <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-black">
                        {sig.name}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {sig.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-mono font-bold uppercase ${
                        isPositive ? 'bg-amber-800 text-white' : 'bg-neutral-200 text-black'
                      }`}
                    >
                      {isPositive ? 'Anomaly Flagged' : 'Passed'}
                    </span>
                    <span className="block text-[11px] font-mono text-neutral-500 mt-1">
                      Weight: +{sig.scoreWeight} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
