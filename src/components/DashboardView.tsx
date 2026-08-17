import React, { useState } from 'react';
import { UKProfile } from '../types';
import {
  Dices,
  UserPlus,
  Scale,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

interface DashboardViewProps {
  profiles: UKProfile[];
  onNavigateToGenerator: () => void;
  onNavigateToCreate: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToComparison: () => void;
  onViewProfile: (profile: UKProfile) => void;
  onCompareProfile: (profile: UKProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profiles,
  onNavigateToGenerator,
  onNavigateToCreate,
  onNavigateToLibrary,
  onNavigateToComparison,
  onViewProfile,
  onCompareProfile,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Aggregate Metrics
  const totalCount = profiles.length;
  const avgAge = totalCount > 0 ? Math.round(profiles.reduce((acc, p) => acc + p.age, 0) / totalCount) : 0;

  // Region counts
  const regionCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
  });
  const topRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Employment counts
  const empCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    empCounts[p.employmentStatus] = (empCounts[p.employmentStatus] || 0) + 1;
  });

  const recentProfiles = profiles.slice(0, 4);

  const faqs = [
    {
      question: 'Is this information from real people?',
      answer: 'No. All generated profiles are for demonstration and testing. They do not represent real people or use real personal identities.',
    },
    {
      question: 'What can I use the generated profiles for?',
      answer: 'The profiles are designed for user interface testing, prototype demonstrations, educational exercises, software mockups, and digital workflow validations without privacy risks.',
    },
    {
      question: 'Do I need to enter details manually?',
      answer: 'No. The Profile Generator creates complete profiles automatically with one click. Every field is generated with built-in logical consistency matching age, marital status, region, occupation, and household income.',
    },
    {
      question: 'How are profiles saved?',
      answer: 'Saved profiles are stored locally in your browser using localStorage. You can access, export, or compare them across sessions on this device.',
    },
  ];

  return (
    <div id="dashboard-page" className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* Homepage Hero Header */}
      <header className="border-b-2 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 font-mono font-semibold">
            <span>01</span>
            <span>/</span>
            <span>Dashboard</span>
            <span>•</span>
            <span className="text-black font-bold">A Creatiq Product</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            UK Profile
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed font-normal">
            Creatiq provides tools for creating and managing structured profiles for demonstrations, interface testing, prototypes, and development workflows.
          </p>
        </div>

        {/* Quick Action Button */}
        <button
          id="hero-generate-random-profile-btn"
          onClick={onNavigateToGenerator}
          className="bg-black text-white px-7 py-4 text-base font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer flex items-center space-x-2.5 shrink-0 self-start md:self-auto shadow-sm active:scale-[0.99]"
        >
          <Dices className="w-5 h-5" />
          <span>Generate Profile</span>
        </button>
      </header>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border-2 border-black p-6 bg-white space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-semibold block">
            Saved Profiles
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-black">{totalCount}</span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
              LOCAL STORAGE
            </span>
          </div>
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-200 font-medium">
            Active profile register count
          </p>
        </div>

        <div className="border-2 border-black p-6 bg-white space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-semibold block">
            Average Age
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-black">
              {avgAge > 0 ? `${avgAge} yrs` : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
              17–66+ RANGE
            </span>
          </div>
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-200 font-medium">
            Adult age distribution
          </p>
        </div>

        <div className="border-2 border-black p-6 bg-white space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-semibold block">
            UK Regions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-black">
              {Object.keys(regionCounts).length || 12}
            </span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
              COVERAGE
            </span>
          </div>
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-200 font-medium">
            England, Scotland, Wales & NI
          </p>
        </div>

        <div className="border-2 border-black p-6 bg-white space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 font-semibold block">
            Profile Types
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-black">7</span>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-semibold">
              CATEGORIES
            </span>
          </div>
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-200 font-medium">
            Student to Retired
          </p>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={onNavigateToGenerator}
          className="border-2 border-black p-6 sm:p-7 bg-black text-white hover:bg-neutral-900 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 bg-white text-black font-bold flex items-center justify-center mb-4">
              <Dices className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Generate Profile
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Generate complete, internally consistent UK profiles automatically with optional filters for gender, age group, and profile type.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white pt-5 mt-5 border-t border-neutral-800 group-hover:translate-x-1 transition-transform font-bold">
            <span>Launch Generator</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={onNavigateToCreate}
          className="border-2 border-black p-6 sm:p-7 bg-white hover:bg-neutral-50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 bg-neutral-100 text-black font-bold flex items-center justify-center mb-4 border border-black">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">
              Build Profile
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-normal">
              Build custom profile records with explicit demographic, employment, household, and digital preferences.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black pt-5 mt-5 border-t border-neutral-200 group-hover:translate-x-1 transition-transform font-bold">
            <span>Build Custom Profile</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={onNavigateToComparison}
          className="border-2 border-black p-6 sm:p-7 bg-white hover:bg-neutral-50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 bg-neutral-100 text-black font-bold flex items-center justify-center mb-4 border border-black">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">
              Comparison Matrix
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-normal">
              Side-by-side comparative inspection of up to 3 profiles across all demographic and lifestyle variables.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black pt-5 mt-5 border-t border-neutral-200 group-hover:translate-x-1 transition-transform font-bold">
            <span>Open Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Demographic Distributions Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Spread */}
        <div className="border-2 border-black p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">
              Regional Profile Distribution
            </h3>
            <span className="text-xs font-mono text-neutral-500 font-semibold">
              {totalCount} Total
            </span>
          </div>

          <div className="space-y-3">
            {topRegions.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center">No regional records in library yet.</p>
            ) : (
              topRegions.map(([regName, count]) => {
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={regName} className="space-y-1 text-sm">
                    <div className="flex justify-between font-mono text-xs font-semibold">
                      <span className="text-black">{regName}</span>
                      <span className="text-neutral-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 border border-neutral-300">
                      <div
                        className="bg-black h-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Employment Status Spread */}
        <div className="border-2 border-black p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">
              Employment Status Breakdown
            </h3>
            <span className="text-xs font-mono text-neutral-500 font-semibold">Distribution</span>
          </div>

          <div className="space-y-3">
            {Object.keys(empCounts).length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center">No employment records in library yet.</p>
            ) : (
              Object.entries(empCounts).map(([status, count]) => {
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={status} className="space-y-1 text-sm">
                    <div className="flex justify-between font-mono text-xs font-semibold">
                      <span className="text-black">{status}</span>
                      <span className="text-neutral-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 border border-neutral-300">
                      <div
                        className="bg-neutral-800 h-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Profiles */}
      <div className="border-2 border-black p-6 sm:p-8 bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">
              Recently Recorded Profiles
            </h3>
            <p className="text-sm text-neutral-600 mt-0.5">
              Saved profiles stored in your browser
            </p>
          </div>
          <button
            onClick={onNavigateToLibrary}
            className="text-xs font-mono uppercase tracking-widest text-black hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>View All ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProfiles.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6 text-center">No saved profiles found. Generate and save a profile to view it here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentProfiles.map((p) => (
              <div
                key={p.id}
                className="border-2 border-black p-5 bg-neutral-50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 block mb-1 font-semibold">
                    {p.id}
                  </span>
                  <h4 className="font-bold text-base text-black">
                    {p.firstName} {p.lastName}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1 font-medium">
                    {p.age} yrs • {p.gender}
                  </p>
                  <p className="text-sm text-black mt-1 font-semibold">
                    {p.city}, {p.region}
                  </p>
                  <p className="text-xs font-mono text-neutral-600 mt-1.5 uppercase font-medium">
                    {p.profileType}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-300 flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(p)}
                    className="flex-1 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors cursor-pointer text-center"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onCompareProfile(p)}
                    className="px-3 py-2 bg-white text-black text-xs font-bold border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Add to Comparison"
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Explanatory Content Section */}
      <section className="space-y-8 pt-8 border-t-2 border-neutral-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-1 font-semibold">
            System & Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            About Creatiq & UK Profile
          </h2>
          <p className="text-base text-neutral-700 mt-2 leading-relaxed max-w-4xl">
            Creatiq powers structured digital tools for creating and managing consistent test records. UK Profile creates realistic, logically consistent profiles across England, Scotland, Wales, and Northern Ireland for digital testing, mockups, research simulations, and prototype validation.
          </p>
        </div>

        {/* 6 Structured Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              01
            </div>
            <h3 className="font-bold text-base text-black">
              Generate UK Profiles Instantly
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Create complete profile records in a single click. Every profile includes full names, regional postcodes, employment indicators, housing details, and lifestyle habits.
            </p>
          </article>

          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              02
            </div>
            <h3 className="font-bold text-base text-black">
              What Information Is Included?
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Profiles cover demographics, valid UK postcode formats, industries, company profiles, household sizes, income brackets, device ecosystems, streaming subscriptions, and lifestyle interests.
            </p>
          </article>

          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              03
            </div>
            <h3 className="font-bold text-base text-black">
              Designed for Testing & Demonstration
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Built specifically for UX researchers, product managers, software engineers, and educators who need rich, structured profile records for testing.
            </p>
          </article>

          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              04
            </div>
            <h3 className="font-bold text-base text-black">
              Save and Compare Profiles
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Store profile records locally in your browser with zero backend overhead. Inspect comparative side-by-side matrices across multiple samples simultaneously.
            </p>
          </article>

          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              05
            </div>
            <h3 className="font-bold text-base text-black">
              Privacy-Safe Architecture
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Every data point is generated. The platform does not store, capture, or reference real personal identities or real residential street addresses.
            </p>
          </article>

          <article className="border-2 border-black p-6 bg-white space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
              06
            </div>
            <h3 className="font-bold text-base text-black">
              Demographic Consistency
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Built-in rules align educational attainment, career milestones, income ranges, and household dependents to maintain realistic demographic relationships.
            </p>
          </article>
        </div>
      </section>

      {/* Accessible FAQ Section */}
      <section id="faq-section" className="space-y-6 pt-8 border-t-2 border-neutral-200">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 font-mono mb-1 font-semibold">
            <HelpCircle className="w-4 h-4 text-black" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 mt-1">
            Common questions regarding profile generation, privacy, and testing usage.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="border-2 border-black bg-white overflow-hidden transition-all"
              >
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-base font-bold text-black hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-sm sm:text-base text-neutral-700 leading-relaxed border-t border-neutral-200 bg-neutral-50 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
