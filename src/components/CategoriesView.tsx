import React from 'react';
import { TOOL_CATEGORIES, TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ArrowRight, Globe, Shield, MapPin, Users, CheckCircle2 } from 'lucide-react';

interface CategoriesViewProps {
  onNavigate: (path: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onNavigate }) => {
  return (
    <div id="categories-page" className="space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="border-b-2 border-black pb-8">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
          <span>NETWHO Architecture</span>
          <span>•</span>
          <span>Categories</span>
          <span>•</span>
          <span className="text-black font-bold">A Creatiq Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
          Tool Categories
        </h1>
        <p className="text-base sm:text-lg text-neutral-800 max-w-3xl mt-3 leading-relaxed">
          NETWHO organizes digital intelligence utilities into four focused functional groups: Network & IP, Privacy & Connection, Location, and Structured Profiles.
        </p>
      </header>

      {/* Category Deep Dives */}
      <div className="space-y-12">
        {TOOL_CATEGORIES.map((cat, idx) => {
          const categoryTools = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
          return (
            <section
              key={cat.id}
              className="border-2 border-black bg-white p-6 sm:p-10 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-1">
                    Category 0{idx + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-black">
                    {cat.name}
                  </h2>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-700">
                  {categoryTools.length} Utilities Available
                </span>
              </div>

              <p className="text-base text-neutral-800 max-w-3xl leading-relaxed">
                {cat.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-5 border-2 border-neutral-300 hover:border-black bg-neutral-50 hover:bg-white transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] font-bold text-neutral-600 uppercase">
                          {tool.id}
                        </span>
                        <span className="font-mono text-[10px] font-bold bg-black text-white px-1.5 py-0.5">
                          Active
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-black">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                        {tool.shortDescription}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate(tool.slug)}
                      className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
