import React, { useState, useMemo } from 'react';
import { UKProfile } from '../types';
import { formatProfileAsText } from '../utils/generator';
import {
  FolderArchive,
  Search,
  Eye,
  Copy,
  Trash2,
  Dices,
  Scale,
  Check,
  LayoutGrid,
  List,
} from 'lucide-react';

interface ProfileLibraryViewProps {
  profiles: UKProfile[];
  onDeleteProfile: (id: string) => void;
  onViewProfile: (profile: UKProfile) => void;
  onCompareProfile: (profile: UKProfile) => void;
  onBatchCompare: (profiles: UKProfile[]) => void;
  comparisonProfileIds: Set<string>;
  onNavigateToGenerator: () => void;
}

export const ProfileLibraryView: React.FC<ProfileLibraryViewProps> = ({
  profiles,
  onDeleteProfile,
  onViewProfile,
  onCompareProfile,
  onBatchCompare,
  comparisonProfileIds,
  onNavigateToGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [employmentFilter, setEmploymentFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allCountries = ['All', 'England', 'Scotland', 'Wales', 'Northern Ireland'];

  const allEmployment = useMemo(() => {
    const set = new Set(profiles.map((p) => p.employmentStatus || p.profileType));
    return ['All', ...Array.from(set).sort()];
  }, [profiles]);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.samplePostcode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = countryFilter === 'All' || p.ukCountry === countryFilter;
      const matchesEmp = employmentFilter === 'All' || (p.employmentStatus || p.profileType) === employmentFilter;

      return matchesSearch && matchesCountry && matchesEmp;
    });
  }, [profiles, searchQuery, countryFilter, employmentFilter]);

  const handleCopyProfile = async (profile: UKProfile) => {
    try {
      const text = formatProfileAsText(profile);
      await navigator.clipboard.writeText(text);
      setCopiedId(profile.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can select a maximum of 3 profiles for side-by-side comparison.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleLaunchComparison = () => {
    const selectedObjects = profiles.filter((p) => selectedForCompare.includes(p.id));
    if (selectedObjects.length > 0) {
      onBatchCompare(selectedObjects);
    }
  };

  return (
    <div id="profile-library-page" className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <header className="border-b-2 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
            <span>03</span>
            <span>/</span>
            <span>Profile Library</span>
            <span>•</span>
            <span className="text-black font-bold">A Creatiq Product</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Profile Library
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mt-2 leading-relaxed">
            Search, inspect, copy, and compare registered UK profiles stored locally.
          </p>
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-2">
          <button
            id="library-generate-new-btn"
            onClick={onNavigateToGenerator}
            className="bg-black text-white px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-2.5 shadow-sm"
          >
            <Dices className="w-4 h-4" />
            <span>Generate Profile</span>
          </button>
        </div>
      </header>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border-2 border-black p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, city, job title..."
              className="w-full pl-11 pr-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
            />
          </div>

          {/* UK Country Filter */}
          <div>
            <select
              id="library-country-filter"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
            >
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All UK Countries' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Filter */}
          <div>
            <select
              id="library-employment-filter"
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
            >
              {allEmployment.map((emp) => (
                <option key={emp} value={emp}>
                  {emp === 'All' ? 'All Employment Statuses' : emp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-neutral-300 gap-4">
          <div className="text-sm font-semibold text-neutral-700">
            Showing <strong className="text-black font-bold">{filteredProfiles.length}</strong> of{' '}
            <strong className="text-black font-bold">{profiles.length}</strong> profiles
          </div>

          <div className="flex items-center gap-3">
            {/* Compare Selected Button */}
            {selectedForCompare.length > 0 && (
              <button
                id="library-compare-selected-btn"
                onClick={handleLaunchComparison}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Selected ({selectedForCompare.length}/3)</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="inline-flex border-2 border-black bg-white">
              <button
                id="view-mode-table-btn"
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                id="view-mode-cards-btn"
                onClick={() => setViewMode('cards')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Cards view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Table or Cards View */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white border-2 border-black border-dashed p-12 text-center space-y-4">
          <FolderArchive className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="text-lg font-bold text-black">No Profiles Found</h3>
          <p className="text-base text-neutral-600 max-w-sm mx-auto leading-relaxed">
            No profiles match your search criteria.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer inline-flex items-center gap-2"
          >
            <Dices className="w-4 h-4" />
            <span>Generate Profile</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="border-2 border-black bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b-2 border-black font-mono uppercase text-black font-bold tracking-wider text-xs">
                <th className="p-3.5 w-12 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Employment</th>
                <th className="p-3.5">Income</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProfiles.map((p) => {
                const isSelected = selectedForCompare.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    id={`profile-row-${p.id}`}
                    className={`hover:bg-neutral-50 transition-colors ${
                      isSelected ? 'bg-neutral-100' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectForCompare(p.id)}
                        className="cursor-pointer accent-black w-4 h-4"
                        title="Select for comparison"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-black whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="p-3.5 font-semibold text-black whitespace-nowrap">
                      {p.firstName} {p.lastName}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-neutral-800 font-medium">
                      {p.age} yrs • {p.gender}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-black font-medium">
                      {p.city}, <span className="text-neutral-600">{p.ukCountry || p.region}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-semibold">
                        {p.employmentStatus || p.profileType}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-semibold text-black">
                      {p.incomeRange}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          id={`view-row-btn-${p.id}`}
                          onClick={() => onViewProfile(p)}
                          className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View profile details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          id={`copy-row-btn-${p.id}`}
                          onClick={() => handleCopyProfile(p)}
                          className="px-3 py-1.5 bg-white text-black text-xs font-bold border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Copy text"
                        >
                          {copiedId === p.id ? (
                            <Check className="w-3.5 h-3.5 text-black" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          id={`compare-row-btn-${p.id}`}
                          onClick={() => onCompareProfile(p)}
                          className={`px-2.5 py-1.5 text-xs font-bold border-2 border-black cursor-pointer transition-colors ${
                            comparisonProfileIds.has(p.id)
                              ? 'bg-black text-white'
                              : 'bg-white hover:bg-neutral-100 text-black'
                          }`}
                          title="Compare"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`delete-row-btn-${p.id}`}
                          onClick={() => onDeleteProfile(p.id)}
                          className="px-2.5 py-1.5 text-red-700 hover:bg-red-50 border-2 border-transparent hover:border-red-700 transition-colors cursor-pointer"
                          title="Delete profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProfiles.map((p) => {
            const isSelected = selectedForCompare.includes(p.id);
            return (
              <div
                key={p.id}
                id={`profile-summary-card-${p.id}`}
                className={`border-2 border-black p-6 bg-white space-y-4 transition-all ${
                  isSelected ? 'bg-neutral-100' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mb-1.5">
                      {p.id}
                    </span>
                    <h3 className="text-xl font-bold text-black">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-sm font-medium text-neutral-700 mt-0.5">
                      {p.age} yrs • {p.gender} • {p.maritalStatus}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectForCompare(p.id)}
                    className="cursor-pointer accent-black w-4 h-4"
                    title="Select for comparison"
                  />
                </div>

                <div className="text-sm space-y-1.5 pt-3 border-t-2 border-neutral-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Location:</span>
                    <span className="font-semibold text-black">
                      {p.city}, {p.ukCountry || p.region}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Employment:</span>
                    <span className="font-semibold text-black">{p.employmentStatus || p.profileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Income:</span>
                    <span className="font-bold text-black">{p.incomeRange}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-neutral-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onViewProfile(p)}
                    className="flex-1 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleCopyProfile(p)}
                    className="px-4 py-2 bg-white text-black text-xs font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {copiedId === p.id ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => onDeleteProfile(p.id)}
                    className="p-2 text-red-700 hover:bg-red-50 border-2 border-transparent hover:border-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
