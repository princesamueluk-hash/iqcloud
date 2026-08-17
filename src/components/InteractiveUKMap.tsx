import React, { useState, useMemo } from 'react';
import { UKCountry } from '../types';
import { Check, MapPin, ChevronRight, Globe, Compass } from 'lucide-react';

interface InteractiveUKMapProps {
  selectedCountry: UKCountry | 'Any';
  onSelectCountry: (country: UKCountry | 'Any') => void;
  className?: string;
}

interface CountryMeta {
  id: UKCountry;
  name: string;
  capital: string;
  sampleRegions: string[];
  samplePostcodes: string[];
  populationDesc: string;
  path: string;
  labelX: number;
  labelY: number;
  badgeX: number;
  badgeY: number;
}

// Crisp, accurate, highly readable vector cartography of the United Kingdom
// ViewBox: 0 0 520 620
export const UK_MAP_DATA: CountryMeta[] = [
  {
    id: 'Scotland',
    name: 'Scotland',
    capital: 'Edinburgh',
    sampleRegions: [
      'Glasgow',
      'Edinburgh',
      'Aberdeen',
      'Dundee',
      'Inverness',
      'Stirling',
      'Perth',
      'Dumfries',
    ],
    samplePostcodes: ['EH1', 'G1', 'AB10', 'DD1', 'IV1', 'FK1', 'PH1', 'DG1'],
    populationDesc: '5.5 Million • 32 Council Areas',
    // Scotland main outline & major isles
    path: `
      M 210,32
      L 245,18 L 270,32 L 260,52 L 290,48 L 305,78 L 345,98 L 365,138 L 350,158 L 370,188
      L 350,218 L 332,228 L 312,212 L 298,228 L 282,242
      L 262,252
      L 242,246 L 212,256 L 182,242 L 162,212 L 178,182 L 162,166 L 178,136 L 198,146 L 208,122 L 188,96 L 202,66 Z
      M 320,12 L 338,18 L 328,36 L 314,26 Z
      M 334,42 L 352,56 L 342,72 L 328,52 Z
      M 142,82 L 162,96 L 152,142 L 138,122 Z
    `,
    labelX: 260,
    labelY: 135,
    badgeX: 260,
    badgeY: 165,
  },
  {
    id: 'Northern Ireland',
    name: 'Northern Ireland',
    capital: 'Belfast',
    sampleRegions: [
      'Belfast',
      'Derry / Londonderry',
      'Lisburn',
      'Newry',
      'Armagh',
      'Coleraine',
      'Bangor',
      'Craigavon',
    ],
    samplePostcodes: ['BT1', 'BT7', 'BT48', 'BT28', 'BT34', 'BT52', 'BT20'],
    populationDesc: '1.9 Million • 6 Historic Counties',
    // Northern Ireland outline
    path: `
      M 112,248
      L 155,242 L 172,264 L 168,296 L 152,318 L 124,328 L 94,312 L 88,286 L 102,264 Z
    `,
    labelX: 130,
    labelY: 285,
    badgeX: 130,
    badgeY: 310,
  },
  {
    id: 'Wales',
    name: 'Wales',
    capital: 'Cardiff',
    sampleRegions: [
      'Cardiff',
      'Swansea',
      'Newport',
      'Wrexham',
      'Bangor',
      'Bridgend',
      'Barry',
      'Aberystwyth',
    ],
    samplePostcodes: ['CF10', 'SA1', 'NP20', 'LL11', 'LL57', 'CF31', 'SY23'],
    populationDesc: '3.1 Million • 22 Principal Areas',
    // Wales outline
    path: `
      M 205,372
      L 236,366 L 246,396 L 236,436 L 242,466 L 216,488 L 182,482 L 172,456 L 182,432 L 166,412 L 182,386 Z
    `,
    labelX: 206,
    labelY: 426,
    badgeX: 206,
    badgeY: 450,
  },
  {
    id: 'England',
    name: 'England',
    capital: 'London',
    sampleRegions: [
      'Greater London',
      'Greater Manchester',
      'West Midlands',
      'West Yorkshire',
      'Merseyside',
      'Kent',
      'Essex',
      'Hampshire',
      'Lancashire',
      'Devon & Cornwall',
      'Bristol & Avon',
    ],
    samplePostcodes: ['SW1A', 'M1', 'B1', 'LS1', 'L1', 'CT1', 'CM1', 'SO14', 'PR1', 'BS1'],
    populationDesc: '56.5 Million • 9 Government Regions',
    // England outline & southwest peninsula
    path: `
      M 262,252
      L 282,242 L 298,228 L 312,212 L 332,228 L 350,218
      L 364,262 L 380,298 L 420,358 L 440,408 L 414,458 L 394,494 L 364,524 L 312,528 L 262,518 L 216,488
      L 242,466 L 236,436 L 246,396 L 236,366 L 205,372 L 212,346 L 236,326 L 246,286 Z
      M 160,538 L 196,518 L 216,532 L 176,554 Z
    `,
    labelX: 326,
    labelY: 376,
    badgeX: 326,
    badgeY: 408,
  },
];

export const InteractiveUKMap: React.FC<InteractiveUKMapProps> = ({
  selectedCountry,
  onSelectCountry,
  className = '',
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<UKCountry | null>(null);

  const activeCountryMeta = useMemo(() => {
    if (selectedCountry === 'Any') return null;
    return UK_MAP_DATA.find((c) => c.id === selectedCountry) || null;
  }, [selectedCountry]);

  const handleCountryToggle = (country: UKCountry) => {
    if (selectedCountry === country) {
      onSelectCountry('Any');
    } else {
      onSelectCountry(country);
    }
  };

  return (
    <div
      id="interactive-uk-map-container"
      className={`w-full bg-white border-2 border-black p-5 sm:p-7 space-y-6 ${className}`}
    >
      {/* Map Section Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 font-mono font-semibold">
            <span>Visual Territory Selector</span>
            <span>•</span>
            <span className="text-black font-bold">4 Constituent Countries</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight mt-0.5">
            Interactive United Kingdom Map
          </h3>
        </div>

        {/* Selected Country Badge Indicator */}
        <div className="flex items-center gap-2">
          {selectedCountry !== 'Any' ? (
            <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 text-xs font-mono font-bold border-2 border-black">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>✓ {selectedCountry} Selected</span>
              <button
                type="button"
                onClick={() => onSelectCountry('Any')}
                className="ml-2 text-neutral-300 hover:text-white underline text-[11px] cursor-pointer"
                title="Reset UK Country to Any"
                aria-label="Reset selection to Any UK Country"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 text-neutral-700 px-3.5 py-1.5 text-xs font-mono font-bold">
              <Compass className="w-3.5 h-3.5 text-neutral-500" />
              <span>Any UK Country (Nationwide)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Responsive SVG Vector Map on Left / Top, 4 Action Cards on Right / Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Vector UK Map */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center relative bg-neutral-50 border-2 border-black p-3 sm:p-5">
          {/* Subtle Map Legend / Prompt */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-600 mb-2 border-b border-neutral-200 pb-1.5">
            <span>CLICK TO SELECT CONSTITUENT COUNTRY</span>
            <span className="font-bold text-black">
              {hoveredCountry ? `Hovering: ${hoveredCountry}` : selectedCountry !== 'Any' ? `Active: ${selectedCountry}` : 'All 4 Available'}
            </span>
          </div>

          <svg
            viewBox="0 0 500 580"
            className="w-full max-w-[430px] h-auto drop-shadow-sm transition-all select-none"
            role="region"
            aria-label="Interactive map of the United Kingdom showing England, Scotland, Wales, and Northern Ireland"
          >
            {/* Background boundary guide frame */}
            <rect
              x="2"
              y="2"
              width="496"
              height="576"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Country vector elements */}
            {UK_MAP_DATA.map((item) => {
              const isSelected = selectedCountry === item.id;
              const isHovered = hoveredCountry === item.id;

              return (
                <g
                  key={item.id}
                  id={`uk-map-path-group-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  className="cursor-pointer transition-all duration-150 outline-none"
                  onClick={() => handleCountryToggle(item.id)}
                  onMouseEnter={() => setHoveredCountry(item.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onFocus={() => setHoveredCountry(item.id)}
                  onBlur={() => setHoveredCountry(null)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`Select ${item.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCountryToggle(item.id);
                    }
                  }}
                >
                  {/* Country Polygon Landmass */}
                  <path
                    d={item.path}
                    className={`transition-all duration-150 ${
                      isSelected
                        ? 'fill-black stroke-black stroke-[3]'
                        : isHovered
                        ? 'fill-neutral-200 stroke-black stroke-[2.5]'
                        : 'fill-white stroke-black stroke-[2]'
                    }`}
                  />

                  {/* High-Contrast Large Accessible Nameplate Label */}
                  <g transform={`translate(${item.labelX}, ${item.labelY})`}>
                    <rect
                      x={-56}
                      y={-14}
                      width={112}
                      height={28}
                      rx={0}
                      className={`transition-all duration-150 ${
                        isSelected
                          ? 'fill-white stroke-white stroke-2'
                          : isHovered
                          ? 'fill-black stroke-black stroke-2'
                          : 'fill-white stroke-black stroke-2'
                      }`}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-[12px] font-mono font-bold tracking-wider uppercase select-none pointer-events-none ${
                        isSelected
                          ? 'fill-black font-extrabold'
                          : isHovered
                          ? 'fill-white font-bold'
                          : 'fill-black'
                      }`}
                    >
                      {item.name}
                    </text>
                  </g>

                  {/* Visual Selected Checkmark Pin */}
                  {isSelected && (
                    <g transform={`translate(${item.badgeX}, ${item.badgeY})`}>
                      <rect
                        x={-12}
                        y={-12}
                        width={24}
                        height={24}
                        className="fill-emerald-500 stroke-white stroke-2"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[13px] fill-white font-bold font-mono pointer-events-none"
                      >
                        ✓
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-3 pt-2 border-t border-neutral-200">
            <span>4 CONSTITUENT NATIONS</span>
            <span>OSGB36 GRID ALIGNED</span>
          </div>
        </div>

        {/* 4 Clickable Country Selection Controls & Location Explorer on Right */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-neutral-600 tracking-wider block">
              Quick Country Selection
            </span>
            <p className="text-xs text-neutral-600 mt-0.5">
              Click any card below or tap directly on the map to filter generated profile locations.
            </p>
          </div>

          {/* 4 Primary Country Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {UK_MAP_DATA.map((country) => {
              const isSelected = selectedCountry === country.id;

              return (
                <button
                  key={country.id}
                  id={`map-card-btn-${country.id.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => handleCountryToggle(country.id)}
                  aria-pressed={isSelected}
                  className={`w-full p-3.5 text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-black text-white border-black ring-2 ring-black ring-offset-1'
                      : 'bg-white text-black border-black hover:bg-neutral-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm uppercase tracking-wide">
                        {country.name}
                      </span>
                      {isSelected && (
                        <span className="bg-white text-black text-[10px] font-mono font-extrabold px-1.5 py-0.2">
                          SELECTED
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs block font-medium ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      Capital: {country.capital} • {country.sampleRegions.slice(0, 3).join(', ')}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 border-2 flex items-center justify-center shrink-0 ml-3 ${
                      isSelected
                        ? 'bg-white border-white text-black font-bold'
                        : 'border-black bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                  </div>
                </button>
              );
            })}

            {/* Any UK Country Option */}
            <button
              type="button"
              id="map-card-btn-any"
              onClick={() => onSelectCountry('Any')}
              aria-pressed={selectedCountry === 'Any'}
              className={`w-full p-3 text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedCountry === 'Any'
                  ? 'bg-neutral-900 text-white border-black ring-2 ring-neutral-800 ring-offset-1'
                  : 'bg-neutral-50 text-neutral-800 border-neutral-300 hover:border-black'
              }`}
            >
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">
                  Any UK Country (Random Selection)
                </span>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    selectedCountry === 'Any' ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  Profiles randomly sourced across England, Scotland, Wales, or Northern Ireland
                </span>
              </div>
              <div
                className={`w-6 h-6 border flex items-center justify-center shrink-0 ml-2 ${
                  selectedCountry === 'Any'
                    ? 'bg-white border-white text-black'
                    : 'border-neutral-400 bg-white'
                }`}
              >
                {selectedCountry === 'Any' && <Check className="w-4 h-4 text-black stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Second-Level Location Information Box */}
      <div className="border-2 border-black bg-neutral-50 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-300 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-black" />
            <h4 className="text-xs sm:text-sm font-mono font-bold text-black uppercase tracking-wider">
              {selectedCountry !== 'Any'
                ? `Location Pool: ${selectedCountry}`
                : 'Nationwide UK Location Pool (All 4 Countries)'}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-700">
            {selectedCountry !== 'Any'
              ? `${activeCountryMeta?.populationDesc || ''}`
              : 'England • Scotland • Wales • Northern Ireland'}
          </span>
        </div>

        {/* Region & City Badges */}
        <div>
          <span className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
            Available Cities, Towns &amp; Metros in Generation Pool:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedCountry !== 'Any' && activeCountryMeta ? (
              activeCountryMeta.sampleRegions.map((region, idx) => (
                <span
                  key={idx}
                  className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold shadow-2xs"
                >
                  {region}
                </span>
              ))
            ) : (
              <>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Greater London (ENG)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Edinburgh (SCO)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Cardiff (WAL)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Belfast (NIR)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Greater Manchester (ENG)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Glasgow (SCO)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Swansea (WAL)
                </span>
                <span className="bg-white text-black border border-black px-3 py-1 text-xs font-semibold">
                  Derry / Londonderry (NIR)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Postcode Area Indicators */}
        <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-2 pt-1">
          <span className="font-bold text-neutral-800">Sample Royal Mail Postcode Prefix Formats:</span>
          {selectedCountry !== 'Any' && activeCountryMeta ? (
            activeCountryMeta.samplePostcodes.map((pc, idx) => (
              <span key={idx} className="font-mono font-bold bg-neutral-200 px-1.5 py-0.5 text-black">
                {pc}
              </span>
            ))
          ) : (
            <span className="font-mono text-neutral-700">SW1A, EH1, CF10, BT1, M1, G1, SA1, BT48...</span>
          )}
        </div>
      </div>
    </div>
  );
};
