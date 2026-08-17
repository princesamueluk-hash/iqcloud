import React, { useState } from 'react';
import { Search, Copy, Check, MapPin, Shield, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import { IpLocationDetails } from '../ip/IpLocationDetails';
import { IpNetworkDetails } from '../ip/IpNetworkDetails';
import { IpRiskSummary } from '../ip/IpRiskSummary';
import { IpLocationMap } from '../IpLocationMap';

export const IpLookupTool: React.FC = () => {
  const {
    ipResult,
    loading,
    error,
    targetIp,
    lookupIp,
    refreshClientIp,
    riskAssessment,
  } = useIpResult();

  const [inputIp, setInputIp] = useState(targetIp || '');
  const [copied, setCopied] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const handleLookup = async (target?: string) => {
    if (loading) return;
    const query = target !== undefined ? target.trim() : inputIp.trim();
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
    <div id="ip-lookup-tool" className="space-y-8">
      {/* Search Input Bar */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 space-y-4">
        <label htmlFor="ip-lookup-search-input" className="block text-sm font-bold uppercase tracking-wider text-black">
          Enter IPv4 or IPv6 Address
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="ip-lookup-search-input"
              type="text"
              placeholder="e.g. 8.8.8.8, 1.1.1.1, or 2001:4860:4860::8888"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(inputIp)}
              className="w-full pl-11 pr-4 py-3 border-2 border-black font-mono text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
          <button
            id="ip-lookup-submit-btn"
            onClick={() => handleLookup(inputIp)}
            disabled={loading}
            className="px-8 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Analysing IP...' : 'Lookup IP'}</span>
          </button>
          <button
            id="ip-lookup-detect-my-ip-btn"
            onClick={() => {
              setInputIp('');
              refreshClientIp();
            }}
            disabled={loading}
            className="px-4 py-3 bg-neutral-100 border-2 border-black text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
            title="Detect My IP"
          >
            Detect My IP
          </button>
        </div>
      </div>

      {loading && (
        <div className="border-2 border-black bg-neutral-50 p-8 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-black" />
          <p className="font-mono text-sm font-bold uppercase tracking-wider text-black">
            Analysing IP & Updating Geographic Intelligence...
          </p>
          <p className="text-xs text-neutral-600">
            Querying network routing registries and location providers for this specific IP.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-50 border-2 border-red-700 text-red-900 font-bold text-sm">
          {error}
        </div>
      )}

      {/* Results View - Powered by Unified IpResultContext */}
      {ipResult && !loading && (
        <div className="border-2 border-black bg-white">
          {/* Header Banner */}
          <div className="bg-neutral-100 border-b-2 border-black p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  {ipResult.type}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-black">
                  {ipResult.ip}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-600">
                {ipResult.hostname || 'No reverse PTR hostname record found'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLookup(ipResult.ip)}
                disabled={loading}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Reanalyse IP</span>
              </button>
              <button
                onClick={() => handleCopy(ipResult.ip)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy IP'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Security Risk Assessment */}
          {riskAssessment && riskAssessment.available && (
            <div className="border-b-2 border-black bg-neutral-50">
              <button
                onClick={() => setShowAssessment(!showAssessment)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-black" />
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-black block">
                      Autonomous Threat & Risk Analysis
                    </span>
                    <span className="text-xs text-neutral-600">
                      Evaluated Level: <strong className="text-black">{riskAssessment.riskLevel}</strong> (Score: {riskAssessment.score}/100)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-500">
                    {showAssessment ? 'Hide Details' : 'View Risk Breakdown'}
                  </span>
                  {showAssessment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {showAssessment && (
                <div className="p-4 sm:p-6 border-t border-neutral-300">
                  <IpRiskSummary />
                </div>
              )}
            </div>
          )}

          {/* Subscribed Context Components: Location & Network Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-black">
            {/* Component 1: Geographic & Physical Location (Subscribed to Context) */}
            <IpLocationDetails />

            {/* Component 2: Network & ISP Infrastructure (Subscribed to Context) */}
            <IpNetworkDetails />
          </div>

          {/* Component 3: Live Map Widget (Subscribed to Context) */}
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
