import React, { useState } from 'react';
import { UKProfile } from '../types';
import {
  Scale,
  Plus,
  Trash2,
  X,
  Dices,
} from 'lucide-react';
import { generateRandomUKProfile } from '../utils/generator';

interface ComparisonViewProps {
  comparisonProfiles: UKProfile[];
  allSavedProfiles: UKProfile[];
  onRemoveFromComparison: (id: string) => void;
  onAddToComparison: (profile: UKProfile) => void;
  onClearComparison: () => void;
  onNavigateToGenerator: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparisonProfiles,
  allSavedProfiles,
  onRemoveFromComparison,
  onAddToComparison,
  onClearComparison,
}) => {
  const [showPickerModal, setShowPickerModal] = useState(false);

  const availableToPick = allSavedProfiles.filter(
    (p) => !comparisonProfiles.some((cp) => cp.id === p.id)
  );

  const handleAddQuickRandom = () => {
    if (comparisonProfiles.length >= 3) return;
    const newRandom = generateRandomUKProfile();
    onAddToComparison(newRandom);
  };

  return (
    <div id="comparison-page" className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <header className="border-b-2 border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
            <span>04</span>
            <span>/</span>
            <span>Comparison</span>
            <span>•</span>
            <span className="text-black font-bold">A Creatiq Product</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Profile Comparison
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mt-2 leading-relaxed">
            Compare demographic variables, employment, technology habits, and lifestyle preferences across up to 3 profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {comparisonProfiles.length < 3 && (
            <>
              <button
                id="add-from-library-btn"
                onClick={() => setShowPickerModal(true)}
                className="bg-white text-black px-5 py-3 text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add from Library</span>
              </button>

              <button
                id="add-random-to-compare-btn"
                onClick={handleAddQuickRandom}
                className="bg-black text-white px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-2 shadow-sm"
              >
                <Dices className="w-4 h-4" />
                <span>Add Random Profile</span>
              </button>
            </>
          )}

          {comparisonProfiles.length > 0 && (
            <button
              id="clear-comparison-btn"
              onClick={onClearComparison}
              className="px-4 py-3 bg-white text-red-700 hover:bg-red-50 text-sm font-bold uppercase border-2 border-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </header>

      {/* Comparison Slot Notice */}
      <div className="bg-white border-2 border-black p-4 flex items-center justify-between text-sm font-bold">
        <span>Active comparison slots: <span className="bg-black text-white px-2 py-0.5 ml-1">{comparisonProfiles.length} of 3</span></span>
        <span className="text-neutral-700 font-semibold uppercase tracking-wider text-xs">Side-by-Side Matrix</span>
      </div>

      {/* Comparison Matrix Table */}
      {comparisonProfiles.length === 0 ? (
        <div className="bg-white border-2 border-black border-dashed p-12 text-center space-y-4">
          <Scale className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="text-lg font-bold text-black">No Profiles Selected for Comparison</h3>
          <p className="text-base text-neutral-600 max-w-sm mx-auto leading-relaxed">
            Select up to 3 profiles from your library or add random profiles to compare their attributes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleAddQuickRandom}
              className="px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer inline-flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>Add Random Profile</span>
            </button>
            {allSavedProfiles.length > 0 && (
              <button
                onClick={() => setShowPickerModal(true)}
                className="px-6 py-3 bg-white text-black text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Select from Library ({allSavedProfiles.length})</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-black bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-neutral-100 border-b-2 border-black">
                <th className="p-4 w-52 font-mono text-xs uppercase tracking-wider text-black font-bold border-r-2 border-black">
                  Metric / Attribute
                </th>
                {comparisonProfiles.map((p, idx) => (
                  <th key={p.id} className="p-4 border-r-2 last:border-r-0 border-black align-top bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mb-1.5">
                          Slot 0{idx + 1} • {p.id}
                        </span>
                        <h3 className="text-lg font-bold text-black">
                          {p.firstName} {p.lastName}
                        </h3>
                        <p className="text-sm text-neutral-700 font-medium mt-0.5">
                          {p.city}, {p.ukCountry || p.region}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveFromComparison(p.id)}
                        className="p-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-300"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <th
                    key={`empty-${i}`}
                    className="p-4 border-r-2 last:border-r-0 border-black bg-neutral-50 text-center align-middle"
                  >
                    <button
                      onClick={handleAddQuickRandom}
                      className="px-4 py-2.5 border-2 border-dashed border-neutral-400 text-neutral-700 hover:text-black hover:border-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-white"
                    >
                      + Add Slot 0{comparisonProfiles.length + i + 1}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {/* Category 1: Demographics */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  1. Core Demographics
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Age & DOB
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black font-medium">
                    <span className="text-black font-bold text-base">{p.age} years old</span>
                    <span className="block text-xs font-mono text-neutral-700 font-semibold">{p.dateOfBirth}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Gender
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black text-black font-semibold">
                    {p.gender}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Marital Status
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black text-black font-semibold">
                    {p.maritalStatus}
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              {/* Category 2: Geography */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  2. Geography & Housing
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Country & Region
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black">
                    <span className="font-bold text-black block text-base">{p.city}</span>
                    <span className="text-neutral-700 font-medium">{p.ukCountry || 'United Kingdom'} • {p.region}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Postcode & Housing
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black space-y-1">
                    <span className="font-mono text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 font-bold inline-block">
                      {p.samplePostcode}
                    </span>
                    <span className="text-black font-semibold block">{p.housingType}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              {/* Category 3: Employment */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  3. Employment & Income
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Employment Status
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black">
                    <span className="px-2.5 py-1 bg-black text-white text-xs font-bold inline-block">
                      {p.employmentStatus || p.profileType}
                    </span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Job & Industry
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black space-y-0.5">
                    <span className="font-bold text-black block">{p.jobTitle}</span>
                    <span className="text-neutral-700 font-medium block">{p.industry}</span>
                    <span className="text-xs font-mono text-neutral-600 font-semibold block">{p.companyName}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Income Band
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black">
                    <span className="font-mono text-black font-bold text-base">
                      {p.incomeRange}
                    </span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              {/* Category 4: Household */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  4. Household Structure
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Size & Children
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black">
                    <span className="font-bold text-black">{p.householdSize} Person(s)</span>
                    <span className="text-neutral-700 block text-xs font-semibold">({p.numberOfChildren} dependent children)</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              {/* Category 5: Technology */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  5. Technology & Media
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Devices & OS
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black space-y-0.5">
                    <span className="font-bold text-black block">{p.smartphoneBrand} ({p.operatingSystem})</span>
                    <span className="text-neutral-700 font-medium block">Primary: {p.primaryDevice}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>

              {/* Category 6: Interests */}
              <tr className="bg-neutral-100 font-bold text-xs text-black">
                <td colSpan={4} className="p-3 uppercase tracking-wider border-y-2 border-black">
                  6. Interests & Lifestyle
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-black bg-neutral-50 border-r-2 border-black">
                  Selected Interests
                </td>
                {comparisonProfiles.map((p) => (
                  <td key={p.id} className="p-3.5 border-r-2 last:border-r-0 border-black align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {p.interests.map((intItem) => (
                        <span
                          key={intItem}
                          className="px-2.5 py-1 bg-black text-white text-xs font-semibold"
                        >
                          {intItem}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - comparisonProfiles.length }).map((_, i) => (
                  <td key={i} className="p-3.5 bg-neutral-50 border-r-2 last:border-r-0 border-black text-neutral-400">—</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Selector Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <h2 className="font-bold text-lg text-black flex items-center gap-2">
                <Plus className="w-5 h-5" /> Select Profile from Library
              </h2>
              <button
                onClick={() => setShowPickerModal(false)}
                className="p-1.5 text-neutral-700 hover:text-black transition-colors cursor-pointer border border-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-neutral-200 pr-2">
              {availableToPick.length === 0 ? (
                <p className="text-sm text-neutral-600 py-6 text-center font-medium">
                  No additional saved profiles available to add.
                </p>
              ) : (
                availableToPick.map((p) => (
                  <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mb-1">
                        {p.id}
                      </span>
                      <h4 className="font-bold text-base text-black">
                        {p.firstName} {p.lastName}
                      </h4>
                      <p className="text-xs text-neutral-700 font-medium">
                        {p.age} yrs • {p.city}, {p.ukCountry || p.region} • {p.employmentStatus}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAddToComparison(p);
                        setShowPickerModal(false);
                      }}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                    >
                      Add to Slot
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t-2 border-neutral-200 flex justify-end">
              <button
                onClick={() => setShowPickerModal(false)}
                className="px-6 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-black text-sm font-bold uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
