import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Download, MapPin, Building, Globe } from 'lucide-react';

interface GeneratedLocation {
  id: string;
  streetNumber: string;
  streetName: string;
  district: string;
  city: string;
  countyOrState: string;
  country: string;
  postcode: string;
  latitude: number;
  longitude: number;
  housingType: string;
  timezone: string;
}

const UK_STREET_NAMES = [
  'High Street',
  'Station Road',
  'Church Lane',
  'Victoria Road',
  'Park Avenue',
  'Queens Road',
  'King Street',
  'Mill Lane',
  'Manor Way',
  'Green Lane',
  'Albert Road',
  'St. John’s Way',
  'Bridge Street',
  'Meadow Close',
];

const UK_REGIONAL_CITIES = [
  { city: 'London', county: 'Greater London', country: 'England', prefix: 'SW1A', lat: 51.5074, lng: -0.1278 },
  { city: 'Manchester', county: 'Greater Manchester', country: 'England', prefix: 'M1', lat: 53.4808, lng: -2.2426 },
  { city: 'Birmingham', county: 'West Midlands', country: 'England', prefix: 'B1', lat: 52.4862, lng: -1.8904 },
  { city: 'Edinburgh', county: 'Midlothian', country: 'Scotland', prefix: 'EH1', lat: 55.9533, lng: -3.1883 },
  { city: 'Glasgow', county: 'Lanarkshire', country: 'Scotland', prefix: 'G1', lat: 55.8642, lng: -4.2518 },
  { city: 'Cardiff', county: 'South Glamorgan', country: 'Wales', prefix: 'CF10', lat: 51.4816, lng: -3.1791 },
  { city: 'Belfast', county: 'County Antrim', country: 'Northern Ireland', prefix: 'BT1', lat: 54.5973, lng: -5.9301 },
  { city: 'Leeds', county: 'West Yorkshire', country: 'England', prefix: 'LS1', lat: 53.8008, lng: -1.5491 },
  { city: 'Bristol', county: 'City of Bristol', country: 'England', prefix: 'BS1', lat: 51.4545, lng: -2.5879 },
  { city: 'Liverpool', county: 'Merseyside', country: 'England', prefix: 'L1', lat: 53.4084, lng: -2.9916 },
];

const HOUSING_TYPES = [
  'Detached House',
  'Semi-Detached House',
  'Terraced Townhouse',
  'Modern Apartment',
  'Converted Flat',
  'Maisonette',
];

export const LocationGeneratorTool: React.FC = () => {
  const [targetRegion, setTargetRegion] = useState<'All UK' | 'England' | 'Scotland' | 'Wales' | 'Northern Ireland'>('All UK');
  const [locations, setLocations] = useState<GeneratedLocation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateLocations = (count = 4) => {
    const list: GeneratedLocation[] = [];
    for (let i = 0; i < count; i++) {
      let pool = UK_REGIONAL_CITIES;
      if (targetRegion !== 'All UK') {
        pool = UK_REGIONAL_CITIES.filter((c) => c.country === targetRegion);
      }
      const cityPick = pool[Math.floor(Math.random() * pool.length)] || pool[0];
      const streetNum = String(Math.floor(Math.random() * 180) + 1);
      const streetName = UK_STREET_NAMES[Math.floor(Math.random() * UK_STREET_NAMES.length)];
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const incSuffix = `${Math.floor(Math.random() * 9) + 1}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
      const postcode = `${cityPick.prefix} ${incSuffix}`;
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;

      list.push({
        id: `LOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        streetNumber: streetNum,
        streetName,
        district: `${cityPick.city} Central District`,
        city: cityPick.city,
        countyOrState: cityPick.county,
        country: cityPick.country,
        postcode,
        latitude: parseFloat((cityPick.lat + latOffset).toFixed(5)),
        longitude: parseFloat((cityPick.lng + lngOffset).toFixed(5)),
        housingType: HOUSING_TYPES[Math.floor(Math.random() * HOUSING_TYPES.length)],
        timezone: 'Europe/London (GMT/BST)',
      });
    }
    setLocations(list);
  };

  React.useEffect(() => {
    generateLocations(4);
  }, [targetRegion]);

  const handleCopyFormatted = (loc: GeneratedLocation) => {
    const formatted = `${loc.streetNumber} ${loc.streetName}, ${loc.district}, ${loc.city}, ${loc.countyOrState}, ${loc.postcode}, ${loc.country} (Coordinates: ${loc.latitude}, ${loc.longitude})`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(loc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(locations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netwho-locations-${targetRegion.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Generator Controls */}
      <div className="border-2 border-black bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 block mb-1">
              Synthetic Geographic Synthesis
            </span>
            <h2 className="text-2xl font-black text-black">
              Location & Address Configuration
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateLocations(4)}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Set</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-5 py-3 border-2 border-black bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase text-neutral-600">
            Target Territory:
          </span>
          {(['All UK', 'England', 'Scotland', 'Wales', 'Northern Ireland'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setTargetRegion(reg)}
              className={`px-4 py-2 text-xs font-bold uppercase border-2 transition-colors cursor-pointer ${
                targetRegion === reg
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-neutral-400 hover:border-black'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="border-2 border-black bg-white p-6 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                  {loc.id}
                </span>
                <span className="font-mono text-xs font-bold text-neutral-700">
                  {loc.country}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xl text-black">
                  {loc.streetNumber} {loc.streetName}
                </h3>
                <p className="text-sm font-semibold text-neutral-800">
                  {loc.district}, {loc.city}
                </p>
                <p className="text-xs text-neutral-600 font-mono mt-0.5">
                  {loc.countyOrState} • <strong className="text-black font-bold">{loc.postcode}</strong>
                </p>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-300 space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-600">Coordinates:</span>
                  <span className="font-bold text-black">{loc.latitude}, {loc.longitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Housing Type:</span>
                  <span className="font-semibold text-black">{loc.housingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Timezone:</span>
                  <span className="font-mono text-black">{loc.timezone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <button
                onClick={() => handleCopyFormatted(loc)}
                className="w-full py-2.5 bg-neutral-100 hover:bg-black hover:text-white text-black border border-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedId === loc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === loc.id ? 'Copied Full Address' : 'Copy Formatted Address'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
