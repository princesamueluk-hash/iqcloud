import React, { useState } from 'react';
import {
  WifiOff,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Shield,
  MapPin,
  Network,
  UserCheck,
} from 'lucide-react';
import { TOOLS_REGISTRY, TOOL_CATEGORIES, ToolDefinition } from '../data/toolsRegistry';
import { useOnlineStatus } from '../utils/useOnlineStatus';

interface OfflineBannerProps {
  onOpenCatalog?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onOpenCatalog }) => {
  const { isOnline, isChecking, checkConnection } = useOnlineStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isOnline && !isChecking) {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="bg-neutral-900 text-white text-xs font-mono py-1 px-3 flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Offline Mode Active</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="underline hover:text-neutral-300 cursor-pointer"
        >
          Expand Notice
        </button>
      </div>
    );
  }

  return (
    <aside
      role="status"
      aria-label="Offline status notice"
      className="bg-neutral-950 text-white border-b-2 border-amber-500 px-4 py-3 sm:py-3.5 transition-all shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold uppercase tracking-wider text-amber-400">
                Offline Mode Detected
              </span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 font-mono px-1.5 py-0.5 rounded">
                Cached Catalog Available
              </span>
            </div>
            <p className="text-neutral-300 text-[11px] sm:text-xs mt-0.5 leading-normal">
              Network connectivity is unavailable. Real-time API lookups and dynamic telemetry are paused, but all static utility descriptions, how-it-works guides, and specifications remain accessible.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {onOpenCatalog && (
            <button
              onClick={onOpenCatalog}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white font-mono text-[11px] uppercase font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </button>
          )}

          <button
            onClick={() => checkConnection()}
            disabled={isChecking}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[11px] uppercase font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-neutral-400 hover:text-white px-2 py-1 text-xs font-mono"
            aria-label="Dismiss offline banner"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
};

interface OfflineCatalogViewProps {
  onNavigate?: (path: string) => void;
}

export const OfflineCatalogView: React.FC<OfflineCatalogViewProps> = ({ onNavigate }) => {
  const { isOnline, isChecking, checkConnection } = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.intro.toLowerCase().includes(q) ||
      tool.categoryName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'network-ip':
        return <Network className="w-4 h-4" />;
      case 'privacy-connection':
        return <Shield className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'profile':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header status panel */}
      <div className="border-2 border-black bg-white p-6 sm:p-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-600 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Local Offline Documentation Archive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black">
              Offline Utility Documentation & Architecture Guide
            </h1>
            <p className="text-sm sm:text-base text-neutral-700 mt-2 max-w-3xl leading-relaxed">
              When disconnected from live networks, NETWHO provides complete offline access to all {TOOLS_REGISTRY.length} utility specifications, how-it-works flows, diagnostic criteria, and architectural references cached directly in your browser.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-neutral-600">Connection State:</span>
              <span
                className={`px-2 py-0.5 font-bold uppercase ${
                  isOnline
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isOnline ? 'Online (Connected)' : 'Offline (Local Cache Active)'}
              </span>
            </div>
            <button
              onClick={() => checkConnection()}
              disabled={isChecking}
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Testing...' : 'Test Network Connection'}</span>
            </button>
          </div>
        </div>

        {/* Informative notification */}
        <div className="bg-neutral-50 border border-neutral-300 p-4 text-xs font-mono text-neutral-700 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <div>
            <strong className="text-black font-bold uppercase block mb-0.5">
              Cached Static Operations Notice
            </strong>
            Dynamic network operations (live public IP lookups, WebRTC ICE candidate exchanges, and live ping benchmarks) require an active internet connection. Static specifications, algorithm descriptions, schema references, and workflow guides are fully cached for offline review.
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="border-2 border-black bg-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offline cached tool descriptions, guides, and questions..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border-2 border-black text-xs font-mono focus:bg-white focus:outline-none"
            />
          </div>

          {/* Results count */}
          <div className="text-xs font-mono text-neutral-600 shrink-0">
            Showing <strong className="text-black">{filteredTools.length}</strong> of {TOOLS_REGISTRY.length} tools
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            All Categories ({TOOLS_REGISTRY.length})
          </button>

          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cached Tool Directory List */}
      <div className="space-y-4">
        {filteredTools.map((tool) => {
          const isExpanded = expandedToolId === tool.id;

          return (
            <article
              key={tool.id}
              className="border-2 border-black bg-white transition-all overflow-hidden"
            >
              {/* Tool Summary Bar */}
              <div
                onClick={() => setExpandedToolId(isExpanded ? null : tool.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-800">
                      {tool.categoryName}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Cached Offline Guide
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    <span>{tool.name}</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-normal">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-black text-xs font-mono font-bold uppercase bg-white hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Specs' : 'Read Offline Guide'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Offline Details Section */}
              {isExpanded && (
                <div className="border-t-2 border-black bg-neutral-50 p-6 sm:p-8 space-y-6">
                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                      Technical Overview & Utility Purpose
                    </h3>
                    <p className="text-sm text-neutral-800 leading-relaxed bg-white p-4 border border-neutral-300">
                      {tool.intro}
                    </p>
                  </div>

                  {/* How It Works (Step by Step) */}
                  {tool.howItWorks && tool.howItWorks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        Operational Workflow & Methodology
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {tool.howItWorks.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 border border-neutral-300 space-y-1.5"
                          >
                            <div className="font-mono text-xs font-black text-black">
                              STEP {step.step || idx + 1}: {step.title}
                            </div>
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Frequently Asked Questions */}
                  {tool.faqs && tool.faqs.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Cached Technical FAQs & Reference</span>
                      </h3>
                      <div className="space-y-2">
                        {tool.faqs.map((faq, fIdx) => (
                          <div
                            key={fIdx}
                            className="bg-white p-3.5 border border-neutral-300 space-y-1"
                          >
                            <h4 className="font-sans text-xs font-bold text-black">
                              {faq.question}
                            </h4>
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation link if user wants to attempt running the page */}
                  {onNavigate && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onNavigate(tool.slug)}
                        className="px-4 py-2 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <span>Open Tool Interface</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="border-2 border-black bg-white p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-neutral-400" />
            <h3 className="text-lg font-bold text-black">No cached utilities matched your search</h3>
            <p className="text-xs font-mono text-neutral-600">
              Try adjusting your query or resetting category filters to browse all {TOOLS_REGISTRY.length} cached utilities.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
