import React, { useState, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, ExternalLink, Compass } from 'lucide-react';
import { useIpResult } from '../context/IpResultContext';

interface IpLocationMapProps {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  ip?: string;
  className?: string;
  isLoading?: boolean;
}

export const IpLocationMap: React.FC<IpLocationMapProps> = ({
  latitude: propLat,
  longitude: propLon,
  city: propCity,
  region: propRegion,
  country: propCountry,
  countryCode: propCountryCode,
  ip: propIp,
  className = '',
  isLoading: propLoading,
}) => {
  // Subscribe to context as single source of truth
  const context = useIpResult();
  const ipResult = context.ipResult;
  const contextLoading = context.loading;

  const latitude = propLat !== undefined ? propLat : (ipResult?.latitude ?? 0);
  const longitude = propLon !== undefined ? propLon : (ipResult?.longitude ?? 0);
  const city = propCity !== undefined ? propCity : (ipResult?.city || 'Unknown City');
  const region = propRegion !== undefined ? propRegion : (ipResult?.region || 'Unknown Region');
  const country = propCountry !== undefined ? propCountry : (ipResult?.country || 'Unknown Country');
  const countryCode = propCountryCode !== undefined ? propCountryCode : (ipResult?.countryCode || '');
  const ip = propIp !== undefined ? propIp : (ipResult?.ip || '');
  const isLoading = propLoading !== undefined ? propLoading : contextLoading;

  const [zoomLevel, setZoomLevel] = useState<number>(11);
  const [mapType, setMapType] = useState<'standard' | 'humanitarian'>('standard');

  // Reset zoom on coordinates update
  useEffect(() => {
    setZoomLevel(11);
  }, [latitude, longitude]);

  const hasValidCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    !(latitude === 0 && longitude === 0);

  // Compute bounding box around center coordinates for OpenStreetMap embed
  const delta = Math.max(0.005, 0.4 / Math.pow(2, zoomLevel - 9));
  const minLon = (longitude - delta).toFixed(5);
  const minLat = (latitude - delta).toFixed(5);
  const maxLon = (longitude + delta).toFixed(5);
  const maxLat = (latitude + delta).toFixed(5);

  const embedUrl = hasValidCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=${mapType === 'humanitarian' ? 'hot' : 'mapnik'}&marker=${latitude.toFixed(5)}%2C${longitude.toFixed(5)}`
    : '';

  const externalMapUrl = hasValidCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoomLevel}/${latitude}/${longitude}`
    : 'https://www.openstreetmap.org/';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(18, prev + 1));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(3, prev - 1));

  return (
    <div
      id="ip-location-map-widget"
      className={`border-2 border-black bg-white overflow-hidden ${className}`}
    >
      {/* Map Control Bar */}
      <div className="bg-neutral-100 border-b-2 border-black p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-black shrink-0" />
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black block">
              {isLoading ? 'Updating Map Coordinates...' : `${city}, ${region}, ${country} ${countryCode ? `(${countryCode})` : ''}`}
            </span>
            <span className="font-mono text-[11px] text-neutral-600">
              {isLoading
                ? 'Resolving physical location...'
                : hasValidCoordinates
                ? `LAT: ${latitude.toFixed(4)}° • LON: ${longitude.toFixed(4)}°`
                : 'Coordinates unavailable for this endpoint'}
            </span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!hasValidCoordinates || isLoading}
            className="p-1.5 border border-black bg-white hover:bg-neutral-200 text-black text-xs font-bold disabled:opacity-40 cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in map"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!hasValidCoordinates || isLoading}
            className="p-1.5 border border-black bg-white hover:bg-neutral-200 text-black text-xs font-bold disabled:opacity-40 cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out map"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-black bg-black text-white text-xs font-mono font-bold hover:bg-neutral-800 transition-colors"
            title="Open in full OpenStreetMap"
          >
            <span>OpenStreetMap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Map Display Viewport */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 bg-neutral-100 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center p-6 space-y-2">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              Rendering Geographic Map for {ip || 'Target IP'}...
            </p>
          </div>
        ) : hasValidCoordinates ? (
          <iframe
            key={`${latitude}-${longitude}-${zoomLevel}-${mapType}`}
            title={`Geographic map for ${city}, ${country}`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={embedUrl}
            className="w-full h-full border-0 grayscale-[15%] contrast-[105%]"
          />
        ) : (
          <div className="text-center p-6 space-y-2 text-neutral-600">
            <Compass className="w-8 h-8 mx-auto text-neutral-400" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700">
              No Geographic Map Available for this Target
            </p>
            <p className="text-xs text-neutral-500">
              The target network or IP does not expose physical routing coordinates.
            </p>
          </div>
        )}

        {/* Live Coordinate Overlay HUD */}
        {hasValidCoordinates && !isLoading && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-black px-3 py-1.5 shadow-sm text-black font-mono text-xs">
            <span className="font-bold">LOCATION:</span> {city}, {country} ({latitude.toFixed(4)}, {longitude.toFixed(4)})
          </div>
        )}
      </div>
    </div>
  );
};
