import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Copy,
  Check,
  Server,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import {
  getClientNetworkTelemetry,
  NetworkConnectionTelemetry,
} from '../../utils/networkService';
import { IpLocationDetails } from '../ip/IpLocationDetails';
import { IpNetworkDetails } from '../ip/IpNetworkDetails';
import { IpLocationMap } from '../IpLocationMap';

interface InteractiveNetworkToolProps {
  toolId: string;
}

export const InteractiveNetworkTool: React.FC<InteractiveNetworkToolProps> = ({ toolId }) => {
  const {
    ipResult,
    loading,
    error,
    targetIp,
    lookupIp,
    refreshClientIp,
    latency,
  } = useIpResult();

  const [searchTarget, setSearchTarget] = useState(targetIp || '');
  const [telemetry, setTelemetry] = useState<NetworkConnectionTelemetry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTelemetry(getClientNetworkTelemetry());
  }, []);

  const runToolDiagnostics = async (customTarget?: string) => {
    const query = customTarget !== undefined ? customTarget.trim() : searchTarget.trim();
    try {
      await lookupIp(query, true);
    } catch {
      // Error handled in context
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="interactive-network-tool" className="space-y-8">
      {/* Search and Query Input */}
      <div className="border-2 border-black bg-white p-6 sm:p-8 space-y-4">
        <label htmlFor="network-diagnostic-query-input" className="block text-sm font-bold uppercase tracking-wider text-black">
          Query Target (IP, Domain or ASN)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="network-diagnostic-query-input"
              type="text"
              placeholder="e.g. 8.8.8.8, 1.1.1.1, AS15169, or profieldhub.online"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runToolDiagnostics(searchTarget)}
              className="w-full pl-11 pr-4 py-3 border-2 border-black font-mono text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
          <button
            id="network-diagnostic-run-btn"
            onClick={() => runToolDiagnostics(searchTarget)}
            disabled={loading}
            className="px-8 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Run Diagnostic</span>
          </button>
          <button
            id="network-diagnostic-my-ip-btn"
            onClick={() => {
              setSearchTarget('');
              refreshClientIp();
            }}
            disabled={loading}
            className="px-4 py-3 bg-neutral-100 border-2 border-black text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
            title="Detect My IP"
          >
            My IP
          </button>
        </div>
      </div>

      {loading && (
        <div className="border-2 border-black bg-neutral-50 p-8 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-black" />
          <p className="font-mono text-sm font-bold uppercase tracking-wider text-black">
            Resolving Network Diagnostic & Location Intelligence...
          </p>
          <p className="text-xs text-neutral-600">
            Querying real-time BGP routing tables and multi-source geolocation feeds.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-50 border-2 border-red-700 text-red-900 font-bold text-sm">
          {error}
        </div>
      )}

      {/* Primary Intelligence Output Subscribing to IpResultContext */}
      {ipResult && !loading && (
        <div className="border-2 border-black bg-white">
          {/* Top Banner */}
          <div className="bg-neutral-100 border-b-2 border-black p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-neutral-600 block mb-1">
                Resolved Diagnostic Record
              </span>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-black">
                  {ipResult.ip}
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  {ipResult.asn}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-600 mt-1">
                {ipResult.isp} • {ipResult.city}, {ipResult.country}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => runToolDiagnostics(ipResult.ip)}
                disabled={loading}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Reanalyse</span>
              </button>
              <button
                onClick={() => handleCopy(ipResult.ip)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Subscribed Context Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-black">
            <IpLocationDetails />
            <IpNetworkDetails />
          </div>

          {/* Performance & Telemetry Strip */}
          <div className="p-5 sm:p-6 border-t-2 border-black bg-neutral-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-neutral-600 block">Round-Trip Latency:</span>
              <span className="font-mono font-bold text-black text-base flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-neutral-700" />
                {latency?.latencyMs !== undefined ? `${latency.latencyMs} ms (${latency.status})` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-600 block">Effective Connection:</span>
              <span className="font-mono text-sm font-bold text-black">
                {telemetry?.effectiveType || '4G / Broadband'} (~{telemetry?.downlink || 10} Mbps)
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-600 block">System Timezone:</span>
              <span className="font-mono text-sm font-bold text-black">
                {telemetry?.timezone || ipResult.timezone}
              </span>
            </div>
          </div>

          {/* Interactive Map View (Subscribed to Context) */}
          <div className="p-6 sm:p-8 border-t-2 border-black bg-neutral-50">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> Live Map Coordinates ({ipResult.latitude}, {ipResult.longitude})
            </h3>
            <IpLocationMap />
          </div>
        </div>
      )}
    </div>
  );
};
