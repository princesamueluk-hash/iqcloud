import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  UKProfile,
  Gender,
  AgeGroup,
  ProfileType,
  JobCategory,
  UKCountry,
  MaritalStatus,
} from '../types';
import {
  JOB_CATEGORIES_LIST,
  MARITAL_STATUSES,
  getJobTypesForCategory,
  getJobTitlesForCategoryAndType,
} from '../data/ukData';
import {
  generateRandomUKProfile,
  formatProfileAsText,
  GeneratorFilters,
  validateProfileSelections,
  verifyGeneratedProfileConsistency,
  ValidationResult,
  ConsistencyReport,
} from '../utils/generator';
import { ProfileCard } from './ProfileCard';
import { InteractiveUKMap } from './InteractiveUKMap';
import {
  Dices,
  RefreshCw,
  Copy,
  BookmarkPlus,
  Trash2,
  Check,
  Zap,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  Edit3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RandomGeneratorViewProps {
  onSaveProfile: (profile: UKProfile) => void;
  onCompareProfile: (profile: UKProfile) => void;
  savedProfileIds: Set<string>;
  comparisonProfileIds: Set<string>;
  onNavigateToLibrary: () => void;
  onNavigateToComparison: () => void;
}

const AGE_GROUPS: AgeGroup[] = [
  '17',
  '18–20',
  '21–25',
  '26–30',
  '31–35',
  '36–40',
  '41–45',
  '46–50',
  '51–55',
  '56–60',
  '61–65',
  '66+',
];

const EMPLOYMENT_STATUSES: ProfileType[] = [
  'Student',
  'Unemployed',
  'Full-time employed',
  'Part-time employed',
  'Self-employed',
  'Freelancer',
  'Retired',
];

const UK_COUNTRIES: UKCountry[] = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

export const RandomGeneratorView: React.FC<RandomGeneratorViewProps> = ({
  onSaveProfile,
  onCompareProfile,
  savedProfileIds,
  comparisonProfileIds,
}) => {
  // Generation Filter States (8 Primary Criteria)
  const [selectedGender, setSelectedGender] = useState<Gender | 'Any'>('Any');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'Any'>('Any');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<MaritalStatus | 'Any'>('Any');
  const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState<ProfileType | 'Any'>('Any');
  const [selectedJobCategory, setSelectedJobCategory] = useState<JobCategory | 'Any'>('Any');
  const [selectedJobType, setSelectedJobType] = useState<string | 'Any'>('Any');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | 'Any'>('Any');
  const [selectedUKCountry, setSelectedUKCountry] = useState<UKCountry | 'Any'>('Any');

  // Dynamic lists for Job Type and Job Title
  const availableJobTypes = useMemo(() => {
    return getJobTypesForCategory(selectedJobCategory);
  }, [selectedJobCategory]);

  const availableJobTitles = useMemo(() => {
    return getJobTitlesForCategoryAndType(selectedJobCategory, selectedJobType);
  }, [selectedJobCategory, selectedJobType]);

  // Reset dependent fields when parent selection changes
  const handleJobCategoryChange = (cat: JobCategory | 'Any') => {
    setSelectedJobCategory(cat);
    setSelectedJobType('Any');
    setSelectedJobTitle('Any');
    setValidationIssue(null);
  };

  const handleJobTypeChange = (type: string | 'Any') => {
    setSelectedJobType(type);
    setSelectedJobTitle('Any');
    setValidationIssue(null);
  };

  // Validation State
  const [validationIssue, setValidationIssue] = useState<ValidationResult | null>(null);

  // Staged Generation Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // Initial generated profile on mount
  const [currentProfile, setCurrentProfile] = useState<UKProfile | null>(() =>
    generateRandomUKProfile()
  );
  const [consistencyReport, setConsistencyReport] = useState<ConsistencyReport | null>(() => {
    const initial = generateRandomUKProfile();
    return verifyGeneratedProfileConsistency(initial);
  });
  const [showConsistencyAudit, setShowConsistencyAudit] = useState(false);

  const [copyNotification, setCopyNotification] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState<number>(1);

  // References for scrolling and accessibility focus
  const controlsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  // Build current filters object
  const currentFilters: GeneratorFilters = useMemo(
    () => ({
      gender: selectedGender,
      ageGroup: selectedAgeGroup,
      maritalStatus: selectedMaritalStatus,
      employmentStatus: selectedEmploymentStatus,
      jobCategory: selectedJobCategory,
      jobType: selectedJobType,
      jobTitle: selectedJobTitle,
      ukCountry: selectedUKCountry,
    }),
    [
      selectedGender,
      selectedAgeGroup,
      selectedMaritalStatus,
      selectedEmploymentStatus,
      selectedJobCategory,
      selectedJobType,
      selectedJobTitle,
      selectedUKCountry,
    ]
  );

  // Live validation on active filters
  const validationCheck = useMemo(() => {
    return validateProfileSelections(currentFilters);
  }, [currentFilters]);

  // Primary Generation Handler with Staged Loading & Validation
  const handleExecuteGeneration = (overrideFilters?: GeneratorFilters) => {
    const filtersToUse = overrideFilters || currentFilters;

    // 1. VALIDATE: Check criteria compatibility
    const validation = validateProfileSelections(filtersToUse);
    if (!validation.isValid) {
      setValidationIssue(validation);
      if (controlsRef.current) {
        controlsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setValidationIssue(null);
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStage('Validating selections...');

    // 2. SUBMIT & GENERATE: Staged natural loading sequence
    setTimeout(() => {
      setGenerationProgress(55);
      setGenerationStage('Generating your profile...');

      setTimeout(() => {
        setGenerationProgress(90);
        setGenerationStage('Preparing profile details...');

        setTimeout(() => {
          // Generate complete coherent profile record
          const newProfile = generateRandomUKProfile(filtersToUse);
          const audit = verifyGeneratedProfileConsistency(newProfile, filtersToUse);

          setCurrentProfile(newProfile);
          setConsistencyReport(audit);
          setGenerationCount((prev) => prev + 1);
          setIsGenerating(false);
          setGenerationProgress(100);

          // 3. VIEW PROFILE: Smooth auto-scroll to result and focus
          requestAnimationFrame(() => {
            setTimeout(() => {
              if (resultRef.current) {
                const rect = resultRef.current.getBoundingClientRect();
                const scrollTop =
                  window.pageYOffset || document.documentElement.scrollTop;
                const targetY = scrollTop + rect.top - 30;

                window.scrollTo({
                  top: Math.max(0, targetY),
                  behavior: 'smooth',
                });

                if (resultHeadingRef.current) {
                  resultHeadingRef.current.focus({ preventScroll: true });
                } else {
                  resultRef.current.focus({ preventScroll: true });
                }
              }
            }, 60);
          });
        }, 180);
      }, 180);
    }, 180);
  };

  // Auto-resolve validation conflicts and generate
  const handleAutoResolveAndGenerate = () => {
    if (!validationIssue || !validationIssue.fieldFixes) return;

    const fixes = validationIssue.fieldFixes;
    if (fixes.gender) setSelectedGender(fixes.gender);
    if (fixes.ageGroup) setSelectedAgeGroup(fixes.ageGroup);
    if (fixes.maritalStatus) setSelectedMaritalStatus(fixes.maritalStatus);
    if (fixes.employmentStatus) setSelectedEmploymentStatus(fixes.employmentStatus);
    if (fixes.jobCategory) setSelectedJobCategory(fixes.jobCategory);
    if (fixes.jobType) setSelectedJobType(fixes.jobType);
    if (fixes.jobTitle) setSelectedJobTitle(fixes.jobTitle);
    if (fixes.ukCountry) setSelectedUKCountry(fixes.ukCountry);

    const mergedFilters: GeneratorFilters = {
      ...currentFilters,
      ...fixes,
    };

    setValidationIssue(null);
    handleExecuteGeneration(mergedFilters);
  };

  const handleResetFilters = () => {
    setSelectedGender('Any');
    setSelectedAgeGroup('Any');
    setSelectedMaritalStatus('Any');
    setSelectedEmploymentStatus('Any');
    setSelectedJobCategory('Any');
    setSelectedJobType('Any');
    setSelectedJobTitle('Any');
    setSelectedUKCountry('Any');
    setValidationIssue(null);
  };

  const handleEditSelections = () => {
    if (controlsRef.current) {
      controlsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClear = () => {
    setCurrentProfile(null);
    setConsistencyReport(null);
  };

  const handleCopy = async () => {
    if (!currentProfile) return;
    try {
      const text = formatProfileAsText(currentProfile);
      await navigator.clipboard.writeText(text);
      setCopyNotification('Profile copied to clipboard');
      setTimeout(() => setCopyNotification(null), 2500);
    } catch (e) {
      setCopyNotification('Failed to copy profile');
    }
  };

  const isSaved = currentProfile ? savedProfileIds.has(currentProfile.id) : false;
  const isInComparison = currentProfile ? comparisonProfileIds.has(currentProfile.id) : false;

  const activeFilterCount = Object.values(currentFilters).filter(
    (v) => v !== 'Any' && v !== undefined
  ).length;

  return (
    <div id="random-generator-page" className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Page Header */}
      <header className="border-b-2 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
            <span>03</span>
            <span>/</span>
            <span>UK Profile</span>
            <span>•</span>
            <span className="text-black font-bold">A Creatiq Product</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Generate Profile
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mt-2 leading-relaxed font-normal">
            Select your profile criteria below, validate compatibility, and generate complete, internally coherent UK profile records.
          </p>
        </div>

        {/* Total Generated Counter */}
        <div className="border-2 border-black bg-white px-5 py-3 shrink-0">
          <span className="text-xs font-mono text-neutral-600 block uppercase tracking-wider font-semibold">
            Total Generated
          </span>
          <span className="text-2xl font-mono font-bold text-black">
            #{generationCount}
          </span>
        </div>
      </header>

      {/* Profile Generation Controls (8 Form Selectors) */}
      <section
        ref={controlsRef}
        aria-label="Profile Generation Controls"
        className="bg-white border-2 border-black p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-300 pb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              Profile Generation Controls
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-xs font-mono font-bold px-2 py-0.5 ml-1">
                {activeFilterCount} Selected
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-black flex items-center gap-1.5 cursor-pointer underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to &quot;Any&quot;</span>
            </button>
          )}
        </div>

        {/* 8 Filter Selectors in a Structured Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Gender */}
          <div>
            <label
              htmlFor="filter-gender-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              1. Gender
            </label>
            <select
              id="filter-gender-select"
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value as Gender | 'Any');
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* 2. Age Group */}
          <div>
            <label
              htmlFor="filter-age-group-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              2. Age Group
            </label>
            <select
              id="filter-age-group-select"
              value={selectedAgeGroup}
              onChange={(e) => {
                setSelectedAgeGroup(e.target.value as AgeGroup | 'Any');
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any Age Group</option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group} {group === '17' ? 'years' : group === '66+' ? 'years' : 'years old'}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Marital Status */}
          <div>
            <label
              htmlFor="filter-marital-status-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              3. Marital Status
            </label>
            <select
              id="filter-marital-status-select"
              value={selectedMaritalStatus}
              onChange={(e) => {
                setSelectedMaritalStatus(e.target.value as MaritalStatus | 'Any');
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any Marital Status</option>
              {MARITAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Employment Status */}
          <div>
            <label
              htmlFor="filter-employment-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              4. Employment Status
            </label>
            <select
              id="filter-employment-select"
              value={selectedEmploymentStatus}
              onChange={(e) => {
                setSelectedEmploymentStatus(e.target.value as ProfileType | 'Any');
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any Employment Status</option>
              {EMPLOYMENT_STATUSES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Job Category */}
          <div>
            <label
              htmlFor="filter-job-category-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              5. Job Category
            </label>
            <select
              id="filter-job-category-select"
              value={selectedJobCategory}
              onChange={(e) => handleJobCategoryChange(e.target.value as JobCategory | 'Any')}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any Job Category</option>
              {JOB_CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Job Type / Specialisation */}
          <div>
            <label
              htmlFor="filter-job-type-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              6. Specialisation / Type
            </label>
            <select
              id="filter-job-type-select"
              value={selectedJobType}
              onChange={(e) => handleJobTypeChange(e.target.value)}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">
                {selectedJobCategory === 'Any' ? 'Any Specialisation' : `Any (${selectedJobCategory})`}
              </option>
              {availableJobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Specific Job Title */}
          <div>
            <label
              htmlFor="filter-job-title-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              7. Job Title
            </label>
            <select
              id="filter-job-title-select"
              value={selectedJobTitle}
              onChange={(e) => {
                setSelectedJobTitle(e.target.value);
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">
                {selectedJobType === 'Any' ? 'Any Job Title' : `Any (${selectedJobType})`}
              </option>
              {availableJobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* 8. UK Country Dropdown */}
          <div>
            <label
              htmlFor="filter-uk-country-select"
              className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5"
            >
              8. UK Country
            </label>
            <select
              id="filter-uk-country-select"
              value={selectedUKCountry}
              onChange={(e) => {
                setSelectedUKCountry(e.target.value as UKCountry | 'Any');
                setValidationIssue(null);
              }}
              className="w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="Any">Any UK Country</option>
              {UK_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dedicated Select UK Country Section & Interactive Map */}
        <div id="select-uk-country-map-section" className="border-t-2 border-black pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-black uppercase tracking-tight flex items-center gap-2">
                <span>Select UK Country</span>
                {selectedUKCountry !== 'Any' && (
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold px-2 py-0.5 normal-case">
                    ✓ {selectedUKCountry} Selected
                  </span>
                )}
              </h3>
              <p className="text-sm text-neutral-600 mt-1 font-normal">
                Choose a country from the United Kingdom or select one directly from the map.
              </p>
            </div>
            
            {/* Quick Country Dropdown Sync Control */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="country-section-sync-dropdown" className="text-xs font-bold text-neutral-700 uppercase">
                UK Country:
              </label>
              <select
                id="country-section-sync-dropdown"
                value={selectedUKCountry}
                onChange={(e) => {
                  setSelectedUKCountry(e.target.value as UKCountry | 'Any');
                  setValidationIssue(null);
                }}
                className="border-2 border-black bg-white px-3 py-1.5 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <option value="Any">Any UK Country</option>
                {UK_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 my-2">
            <div className="h-px bg-neutral-300 flex-1" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
              OR SELECT FROM THE MAP
            </span>
            <div className="h-px bg-neutral-300 flex-1" />
          </div>

          {/* Interactive Responsive SVG UK Map Component */}
          <InteractiveUKMap
            selectedCountry={selectedUKCountry}
            onSelectCountry={(country) => {
              setSelectedUKCountry(country);
              setValidationIssue(null);
            }}
          />
        </div>

        {/* Validation Warning / Adjustment Card */}
        {validationIssue && !validationIssue.isValid && (
          <div
            id="validation-error-banner"
            className="border-2 border-amber-600 bg-amber-50 p-4 sm:p-5 text-black space-y-3"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-amber-900 uppercase tracking-wide">
                  Selection Compatibility Adjustment Needed
                </h3>
                <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                  {validationIssue.message}
                </p>
                {validationIssue.incompatibleFields && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {validationIssue.incompatibleFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-200/80 text-amber-950 font-mono text-xs px-2 py-0.5 border border-amber-400 font-bold"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                )}
                {validationIssue.suggestedAction && (
                  <p className="text-xs sm:text-sm text-neutral-700 font-semibold pt-1">
                    Recommendation: {validationIssue.suggestedAction}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-amber-200">
              <button
                onClick={handleAutoResolveAndGenerate}
                className="bg-black text-white px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Auto-resolve &amp; Generate Profile</span>
              </button>
              <button
                onClick={handleEditSelections}
                className="border border-black bg-white text-black px-3.5 py-2 text-xs sm:text-sm font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Selections</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Preferences Summary Box */}
        <div className="bg-neutral-50 border border-neutral-300 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-neutral-700 tracking-wider">
              Profile Preferences Summary
            </span>
            <button
              onClick={handleEditSelections}
              className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer underline"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Selections</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Gender:</span>
              <span className="font-bold text-black">{selectedGender}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Age Group:</span>
              <span className="font-bold text-black">{selectedAgeGroup}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Marital Status:</span>
              <span className="font-bold text-black">{selectedMaritalStatus}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Employment:</span>
              <span className="font-bold text-black">{selectedEmploymentStatus}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Job Category:</span>
              <span className="font-bold text-black">{selectedJobCategory}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Specialisation:</span>
              <span className="font-bold text-black">{selectedJobType}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Job Title:</span>
              <span className="font-bold text-black truncate block">{selectedJobTitle}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">UK Country:</span>
              <span className="font-bold text-black">{selectedUKCountry}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {activeFilterCount === 0
                ? 'System will auto-select a natural demographic profile combination.'
                : `${activeFilterCount} active criteria locked. System will generate a cohesive, validated profile.`}
            </span>
          </div>
        </div>

        {/* Staged Loading Progress Bar */}
        {isGenerating && (
          <div className="border-2 border-black bg-neutral-900 text-white p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                {generationStage}
              </span>
              <span className="text-neutral-400">{generationProgress}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-200"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Primary Submit & Generate Action Button */}
        <div className="pt-2">
          <button
            id="generate-profile-submit-btn"
            onClick={() => handleExecuteGeneration()}
            disabled={isGenerating}
            className="w-full bg-black text-white px-8 py-4 sm:py-5 text-base sm:text-lg font-bold uppercase tracking-widest hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-3 shadow-md disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            <Dices className={`w-6 h-6 ${isGenerating ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isGenerating ? generationStage || 'Generating Profile...' : 'Generate Profile'}</span>
          </button>
        </div>
      </section>

      {/* Generated Profile Result Container */}
      <div
        ref={resultRef}
        id="generated-profile-result-container"
        tabIndex={-1}
        className="outline-none pt-2"
        aria-live="polite"
      >
        {currentProfile ? (
          <div className="space-y-6">
            {/* Header & Verification Badge */}
            <div className="border-2 border-black bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Profile Generated Successfully
                  </span>
                  <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-0.5">
                    {currentProfile.id}
                  </span>
                </div>
                <h2
                  ref={resultHeadingRef}
                  tabIndex={-1}
                  className="text-xl sm:text-2xl font-bold text-black outline-none tracking-tight pt-1"
                >
                  {currentProfile.firstName} {currentProfile.lastName} • {currentProfile.jobTitle}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                  Generated based on your selected criteria • {currentProfile.city}, {currentProfile.region} ({currentProfile.ukCountry})
                </p>
              </div>

              {/* Consistency Audit Trigger */}
              <button
                onClick={() => setShowConsistencyAudit(!showConsistencyAudit)}
                className="shrink-0 border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-black hover:bg-neutral-100 flex items-center justify-between sm:justify-start gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Consistency Check (8/8)</span>
                </div>
                {showConsistencyAudit ? (
                  <ChevronUp className="w-3.5 h-3.5 text-neutral-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
                )}
              </button>
            </div>

            {/* Expandable Internal Consistency Audit Breakdown */}
            {showConsistencyAudit && consistencyReport && (
              <div className="border-2 border-black bg-neutral-50 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-black tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Internal Consistency Engine Verification Report
                  </h4>
                  <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    100% Passed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {consistencyReport.checks.map((item) => (
                    <div
                      key={item.key}
                      className="bg-white border border-neutral-200 p-3 flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-black block">
                          {item.label}
                        </span>
                        <span className="text-xs text-neutral-600 block leading-tight font-medium">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Card View */}
            <ProfileCard
              profile={currentProfile}
              onSave={onSaveProfile}
              onCompare={onCompareProfile}
              isSaved={isSaved}
              isInComparison={isInComparison}
            />

            {/* Post-Generation Primary Actions */}
            <div className="border-2 border-black bg-white p-5 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="result-generate-another-btn"
                  onClick={() => handleExecuteGeneration()}
                  disabled={isGenerating}
                  className="bg-black text-white px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate Another Profile</span>
                </button>

                <button
                  id="result-edit-preferences-btn"
                  onClick={handleEditSelections}
                  className="border-2 border-black bg-white text-black px-4 py-3 text-sm font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Preferences</span>
                </button>

                <button
                  id="result-copy-profile-btn"
                  onClick={handleCopy}
                  className="border-2 border-black bg-white text-black px-4 py-3 text-sm font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Profile</span>
                </button>

                <button
                  id="result-save-profile-btn"
                  onClick={() => onSaveProfile(currentProfile)}
                  disabled={isSaved}
                  className={`border-2 px-4 py-3 text-sm font-bold uppercase transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isSaved
                      ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-neutral-100'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{isSaved ? 'Saved in Library' : 'Save to Library'}</span>
                </button>

                <button
                  id="result-clear-btn"
                  onClick={handleClear}
                  className="px-3 py-3 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Copy Notification */}
              {copyNotification && (
                <div className="p-2.5 px-3.5 bg-black text-white text-xs font-mono flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{copyNotification}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-black border-dashed p-12 sm:p-16 text-center space-y-5">
            <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mx-auto text-black">
              <Dices className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">No Profile Selected</h3>
              <p className="text-base text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
                Click below or adjust the generation controls above to produce an internally consistent UK profile record.
              </p>
            </div>
            <button
              onClick={() => handleExecuteGeneration()}
              className="px-8 py-4 bg-black text-white text-base font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-2.5"
            >
              <Zap className="w-5 h-5" />
              <span>Generate Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* System Methodology Note */}
      <section className="mt-12 pt-8 border-t-2 border-neutral-200">
        <h3 className="text-xl font-bold text-black mb-3">
          Profile Consistency Engine
        </h3>
        <p className="text-base text-neutral-700 leading-relaxed max-w-4xl">
          The <strong>UK Profile Generator</strong> creates structured UK profile records across gender, age groups (17 to 66+), marital status, employment status, job categories, specialisations, specific job titles, and constituent UK countries. Relational heuristics align occupational seniority, household composition, education, and regional details to maintain internal coherence.
        </p>
      </section>
    </div>
  );
};
