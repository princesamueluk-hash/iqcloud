import React from 'react';
import { Network, Server, Shield, Database, Radio, Globe } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import { IpLookupResult } from '../../utils/networkService';

interface IpNetworkDetailsProps {
  data?: IpLookupResult | null;
  loading?: boolean;
  className?: string;
}

export const IpNetworkDetails: React.FC<IpNetworkDetailsProps> = ({
  data: propData,
  loading: propLoading,
  className = '',
}) => {
  const context = useIpResult();
  const data = propData !== undefined ? propData : context.ipResult;
  const loading = propLoading !== undefined ? propLoading : context.loading;

  if (loading) {
    return (
      <div className={`p-6 sm:p-8 space-y-4 animate-pulse ${className}`}>
        <div className="flex items-center space-x-2 border-b-2 border-neutral-300 pb-2">
          <div className="w-4 h-4 bg-neutral-300 rounded"></div>
          <div className="h-4 w-48 bg-neutral-300 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div id="ip-network-details" className={`p-6 sm:p-8 space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
          <Network className="w-4 h-4" /> Network & Routing Infrastructure
        </h3>
        <span className="font-mono text-[11px] text-neutral-600">
          BGP Autonomous System Data
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
        <div>
          <span className="text-xs text-neutral-600 block">Internet Service Provider (ISP):</span>
          <span className="font-bold text-black text-base flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-neutral-700" />
            {data.isp || 'Unavailable'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Organization / Entity:</span>
          <span className="font-semibold text-black text-base flex items-center gap-1.5">
            <Server className="w-4 h-4 text-neutral-700" />
            {data.org || 'Same as ISP'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Autonomous System (ASN):</span>
          <span className="font-mono font-bold text-black text-sm bg-neutral-100 px-2 py-0.5 border border-neutral-300 inline-block">
            {data.asn || 'N/A'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Hostname / Reverse PTR:</span>
          <span className="font-mono text-xs font-semibold text-neutral-800 break-all">
            {data.hostname || 'No reverse PTR record detected'}
          </span>
        </div>

        <div className="sm:col-span-2">
          <span className="text-xs text-neutral-600 block mb-2">Network Classification & Privacy Flags:</span>
          <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
            <span
              className={`px-2.5 py-1 border ${
                data.isVpn
                  ? 'bg-amber-100 border-amber-800 text-amber-900'
                  : 'bg-neutral-200 border-neutral-400 text-black'
              }`}
            >
              VPN: {data.isVpn ? 'DETECTED' : 'NOT DETECTED'}
            </span>

            <span
              className={`px-2.5 py-1 border ${
                data.isProxy
                  ? 'bg-amber-100 border-amber-800 text-amber-900'
                  : 'bg-neutral-200 border-neutral-400 text-black'
              }`}
            >
              PROXY: {data.isProxy ? 'DETECTED' : 'NOT DETECTED'}
            </span>

            <span
              className={`px-2.5 py-1 border ${
                data.isDatacenter
                  ? 'bg-neutral-800 text-white border-black'
                  : 'bg-black text-white border-black'
              }`}
            >
              TYPE: {data.isDatacenter ? 'DATACENTER / HOSTING' : 'RESIDENTIAL / BROADBAND'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
