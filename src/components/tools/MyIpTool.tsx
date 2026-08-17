import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, MapPin, Terminal } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import {
  getClientNetworkTelemetry,
  NetworkConnectionTelemetry,
} from '../../utils/networkService';
import { IpLocationDetails } from '../ip/IpLocationDetails';
import { IpNetworkDetails } from '../ip/IpNetworkDetails';
import { IpRiskSummary } from '../ip/IpRiskSummary';
import { IpLocationIndicator } from '../IpLocationIndicator';
import { IpLocationMap } from '../IpLocationMap';

export const MyIpTool: React.FC = () => {
  const {
    ipResult,
    loading,
    error,
    refreshClientIp,
    latency,
    webrtc,
    riskAssessment,
  } = useIpResult();

  const [telemetry, setTelemetry] = useState<NetworkConnectionTelemetry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTelemetry(getClientNetworkTelemetry());
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webrtcSummary = (() => {
    if (!webrtc || webrtc.status === 'checking') {
      return {
        title: 'Checking WebRTC...',
        detail: 'Searching for WebRTC candidates...',
      };
    }

    if (webrtc.status === 'unavailable') {
      return {
        title: 'WebRTC Check Unavailable',
        detail: webrtc.error || 'This browser does not expose the required WebRTC API.',
      };
    }

    if (webrtc.totalCount > 0) {
      return {
        title: 'WebRTC Candidates Found',
        detail: `Local: ${webrtc.localIps.length} candidate(s)`,
      };
    }

    return {
      title: 'No WebRTC Candidates Detected',
      detail: 'Local: 0 candidate(s)',
    };
  })();

  return (
    <div id="my-ip-tool" className="space-y-8">
      {/* Primary IP Hero Card */}
      <div className="border-2 border-black bg-white p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 block mb-1">
              Active Public IP Address
            </span>
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-black">
                {loading ? 'Detecting...' : ipResult?.ip || 'Unavailable'}
              </h2>
              {ipResult && !loading && (
                <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-1">
                  {ipResult.type}
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-neutral-600 mt-2">
              ISP: <strong className="text-black font-semibold">{loading ? 'Resolving...' : ipResult?.isp || 'Unknown'}</strong> • ASN: <strong className="text-black font-semibold">{loading ? 'Resolving...' : ipResult?.asn || 'N/A'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => ipResult && handleCopy(ipResult.ip)}
              disabled={loading || !ipResult || ipResult.isUnavailable}
              className="px-5 py-3 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy IP'}</span>
            </button>

            <button
              onClick={() => refreshClientIp()}
              disabled={loading}
              className="px-5 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Testing...' : 'Re-Test Network'}</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 border-2 border-neutral-300 bg-neutral-50">
            <span className="font-mono text-[11px] uppercase font-bold text-neutral-600 block mb-1">
              Round-Trip Time (RTT)
            </span>
            <span className="font-mono text-lg font-bold text-black block">
              {loading ? '...' : latency?.latencyMs !== undefined ? `${latency.latencyMs} ms` : 'N/A'}
            </span>
            <span className="text-xs font-semibold text-neutral-700">
              Rating: {latency?.status || 'N/A'}
            </span>
          </div>

          <div className="p-4 border-2 border-neutral-300 bg-neutral-50">
            <span className="font-mono text-[11px] uppercase font-bold text-neutral-600 block mb-1">
              Geographic Region
            </span>
            <span className="font-sans text-base font-bold text-black block truncate">
              {loading ? '...' : ipResult ? (ipResult.isUnavailable ? 'Unavailable' : `${ipResult.city}, ${ipResult.countryCode}`) : 'Unavailable'}
            </span>
            <span className="text-xs font-mono text-neutral-700 block mb-2">
              Postal: {loading ? '...' : ipResult?.postal || 'N/A'}
            </span>
            <IpLocationIndicator />
          </div>

          <div className="p-4 border-2 border-neutral-300 bg-neutral-50">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[11px] uppercase font-bold text-neutral-600 block">
                WebRTC IP Leak
              </span>
            </div>
            <span className={`font-mono text-base font-bold block ${webrtc?.status === 'unavailable' ? 'text-red-700' : webrtc?.totalCount ? 'text-amber-800' : 'text-black'}`}>
              {webrtcSummary.title}
            </span>
            <span className="text-xs font-semibold text-neutral-700 block mt-1">
              {webrtcSummary.detail}
            </span>
            {webrtc && webrtc.status === 'complete' && webrtc.totalCount > 0 && (
              <div className="mt-2 text-[10px] font-mono uppercase tracking-wide text-neutral-600 space-y-1">
                <div>Public: {webrtc.publicIps.length} candidate(s)</div>
                <div>Relay: {webrtc.relayIps.length} candidate(s)</div>
              </div>
            )}
          </div>

          <div className="p-4 border-2 border-neutral-300 bg-neutral-50">
            <span className="font-mono text-[11px] uppercase font-bold text-neutral-600 block mb-1">
              Connection Speed Class
            </span>
            <span className="font-mono text-base font-bold text-black block uppercase">
              {telemetry?.effectiveType || '4G / Broadband'}
            </span>
            <span className="text-xs font-semibold text-neutral-700">
              Est. {telemetry?.downlink || 10} Mbps
            </span>
          </div>
        </div>
      </div>

      {error && !loading && (
        <div className="p-4 bg-red-50 border-2 border-red-700 text-red-900 font-bold text-sm">
          {error}
        </div>
      )}

      {/* Autonomous Threat & Risk Assessment */}
      {riskAssessment && riskAssessment.available && !loading && (
        <IpRiskSummary />
      )}

      {/* Location and Network Grid Subscribing to IpResultContext */}
      {ipResult && !loading && (
        <div className="border-2 border-black bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-black">
            <IpLocationDetails />
            <IpNetworkDetails />
          </div>

          {/* Interactive Geographic Map */}
          <div className="p-6 sm:p-8 border-t-2 border-black bg-neutral-50">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> Live Map Coordinates ({ipResult.latitude}, {ipResult.longitude})
            </h3>
            <IpLocationMap />
          </div>
        </div>
      )}

      {/* Deep Browser & Client Stack Inspection */}
      <div className="border-2 border-black bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <h3 className="text-lg font-bold text-black uppercase tracking-wide flex items-center gap-2">
            <Terminal className="w-5 h-5" /> Client Browser & Network Telemetry
          </h3>
          <span className="font-mono text-xs font-bold text-neutral-600">
            Live DOM Query
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">User Agent Platform:</span>
              <span className="font-mono font-bold text-black text-right truncate max-w-[200px]">{telemetry?.platform}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">System Timezone:</span>
              <span className="font-mono font-bold text-black">{telemetry?.timezone}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">Screen Resolution:</span>
              <span className="font-mono font-bold text-black">{telemetry?.screenResolution}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">Browser Language:</span>
              <span className="font-mono font-bold text-black">{telemetry?.language}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">Do Not Track (DNT):</span>
              <span className="font-mono font-bold text-black">{telemetry?.doNotTrack ? 'Enabled (1)' : 'Disabled / Unset'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-1.5">
              <span className="text-neutral-600 font-medium">Cookies Active:</span>
              <span className="font-mono font-bold text-black">{telemetry?.cookiesEnabled ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
