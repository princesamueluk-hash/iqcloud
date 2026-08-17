import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, CheckCircle2, Globe, Shield, MapPin, Users } from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS_REGISTRY, ToolDefinition } from '../data/toolsRegistry';

interface ToolsDirectoryViewProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
}

export const ToolsDirectoryView: React.FC<ToolsDirectoryViewProps> = ({
  onNavigate,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      const matchesCat =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.categoryName.toLowerCase().includes(query) ||
        tool.seo.keywords.some((k) => k.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div id="tools-directory-page" className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="border-b-2 border-black pb-8">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
          <span>NETWHO Directory</span>
          <span>•</span>
          <span>profieldhub.online</span>
          <span>•</span>
          <span className="text-black font-bold">A Creatiq Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
          Digital Utilities for Network, Privacy and Location Analysis
        </h1>
        <p className="text-base sm:text-lg text-neutral-800 max-w-3xl mt-3 leading-relaxed">
          NETWHO brings together practical browser-based utilities for checking public IP information, understanding network characteristics, reviewing VPN or proxy indicators, and generating structured test profiles for digital projects.
        </p>
      </header>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50 p-4 sm:p-6 border-2 border-black">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 ${
              selectedCategory === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-neutral-100'
            }`}
          >
            All Tools ({TOOLS_REGISTRY.length})
          </button>
          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-neutral-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black pl-10 pr-4 py-2 text-sm text-black placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredTools.length === 0 ? (
        <div className="border-2 border-black border-dashed p-12 text-center space-y-3 bg-white">
          <p className="text-lg font-bold text-black">No tools matching "{searchQuery}"</p>
          <p className="text-sm text-neutral-600">
            Try adjusting your search criteria or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="border-2 border-black p-6 bg-white flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase font-bold text-neutral-600 tracking-wider">
                    {tool.categoryName}
                  </span>
                  <span className="px-2 py-0.5 bg-black text-white text-[11px] font-mono font-bold">
                    Active
                  </span>
                </div>

                <h3 className="text-xl font-bold text-black">
                  {tool.name}
                </h3>

                <p className="text-sm text-neutral-700 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigate(tool.slug)}
                  className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
