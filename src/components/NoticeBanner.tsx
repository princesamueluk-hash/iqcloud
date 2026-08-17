import React from 'react';

export const NoticeBanner: React.FC = () => {
  return (
    <div
      id="sample-data-notice-banner"
      role="region"
      aria-label="Synthetic Data Notice"
      className="bg-black text-white px-4 sm:px-6 py-2 border-b border-neutral-800 text-xs select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold bg-white text-black px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
            NOTICE
          </span>
          <span className="text-neutral-300 text-xs leading-tight">
            Generated profiles contain fictional, synthetic information for demonstration, interface testing, prototyping, and development purposes. They do not represent real people.
          </span>
        </div>
        <div className="font-mono text-[10px] text-neutral-400 shrink-0 uppercase tracking-widest hidden md:block">
          CREATIQ // NETWHO
        </div>
      </div>
    </div>
  );
};


