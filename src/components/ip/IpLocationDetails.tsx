import React from 'react';
import { MapPin, Globe, Compass, Clock, DollarSign, Phone } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import { IpLocationIndicator } from '../IpLocationIndicator';
import { IpLookupResult } from '../../utils/networkService';

interface IpLocationDetailsProps {
  data?: IpLookupResult | null;
  loading?: boolean;
  className?: string;
}

export const IpLocationDetails: React.FC<IpLocationDetailsProps> = ({
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
          <div className="h-4 w-44 bg-neutral-300 rounded"></div>
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
    <div id="ip-location-details" className={`p-6 sm:p-8 space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Physical & Geographic Location
        </h3>
        <span className="font-mono text-[11px] text-neutral-600">
          Derived from BGP & ISP Registries
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
        <div>
          <span className="text-xs text-neutral-600 block">Country:</span>
          <span className="font-bold text-black text-base flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-neutral-700" />
            {data.country || 'Unavailable'} {data.countryCode ? `(${data.countryCode})` : ''}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">City & Region:</span>
          <span className="font-semibold text-black text-base">
            {data.city || '—'}, {data.region || '—'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Postal / Zip Code:</span>
          <span className="font-mono font-bold text-black text-sm">
            {data.postal || 'N/A'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Latitude / Longitude Coordinates:</span>
          <span className="font-mono font-bold text-black text-sm flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-neutral-600" />
            {data.latitude !== undefined && data.longitude !== undefined ? `${data.latitude}, ${data.longitude}` : 'N/A'}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Timezone:</span>
          <span className="font-semibold text-black text-sm flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-600" />
            {data.timezone || '—'} {data.utcOffset ? `(${data.utcOffset})` : ''}
          </span>
        </div>

        <div>
          <span className="text-xs text-neutral-600 block">Currency & Calling Code:</span>
          <span className="font-semibold text-black text-sm flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-neutral-600" />
            {data.currency || 'N/A'}
            <span className="mx-1 text-neutral-400">•</span>
            <Phone className="w-3.5 h-3.5 text-neutral-600" />
            {data.callingCode || 'N/A'}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <IpLocationIndicator />
      </div>
    </div>
  );
};
