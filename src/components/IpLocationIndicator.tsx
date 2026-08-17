import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface IpLocationIndicatorProps {
  className?: string;
  variant?: 'badge' | 'inline' | 'card';
}

export const IpLocationIndicator: React.FC<IpLocationIndicatorProps> = ({
  className = '',
  variant = 'badge',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const tooltipContent = (
    <div
      role="tooltip"
      className={`absolute left-0 bottom-full mb-2 z-50 w-72 sm:w-80 p-3.5 bg-black text-white text-xs font-sans rounded shadow-2xl border border-neutral-700 transition-opacity duration-150 ${
        isOpen ? 'block opacity-100' : 'hidden group-hover:block group-focus:block'
      }`}
    >
      <div className="font-bold font-mono text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-white shrink-0" />
        <span>Physical Proximity Notice</span>
      </div>
      <p className="leading-relaxed text-neutral-200 font-normal">
        Geographic data is estimated from ISP allocation registries, autonomous systems (ASNs), and BGP routing tables. <strong>Physical proximity may vary</strong> significantly from real device location (e.g., when routed via cellular masts, VPNs, or enterprise gateways).
      </p>
      <div className="absolute left-6 -bottom-1.5 w-3 h-3 bg-black rotate-45 border-r border-b border-neutral-700"></div>
    </div>
  );

  if (variant === 'card') {
    return (
      <div
        ref={containerRef}
        className={`relative group bg-neutral-100 border border-neutral-300 p-2.5 rounded flex items-center justify-between gap-2 ${className}`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-800">
          <Info className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="font-semibold">Location derived from IP intelligence</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Explain IP location proximity"
          className="text-neutral-500 hover:text-black focus:outline-none p-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
        {tooltipContent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center group ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Location derived from IP intelligence notice"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-xs font-mono text-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-black cursor-help"
      >
        <Info className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
        <span className="font-medium">Location derived from IP intelligence</span>
        <HelpCircle className="w-3 h-3 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
      </button>

      {tooltipContent}
    </div>
  );
};
