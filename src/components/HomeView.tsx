import React from 'react';
import {
  Globe,
  Shield,
  MapPin,
  Users,
  Search,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Database,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  Terminal,
} from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS_REGISTRY, ToolDefinition } from '../data/toolsRegistry';
import { useIpResult } from '../context/IpResultContext';
import { IpLocationIndicator } from './IpLocationIndicator';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { ipResult: quickIp, latency, loading: loadingIp } = useIpResult();

  const featuredTools = [
    TOOLS_REGISTRY.find((t) => t.id === 'ip-lookup')!,
    TOOLS_REGISTRY.find((t) => t.id === 'my-ip')!,
    TOOLS_REGISTRY.find((t) => t.id === 'vpn-detection')!,
    TOOLS_REGISTRY.find((t) => t.id === 'uk-profile')!,
    TOOLS_REGISTRY.find((t) => t.id === 'dns-lookup')!,
    TOOLS_REGISTRY.find((t) => t.id === 'location-generator')!,
  ].filter(Boolean);

  return (
    <div id="home-view" className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="border-b-2 border-black pb-14 pt-4 sm:pt-8">
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-600">
            <span className="bg-black text-white px-2 py-0.5">NETWHO</span>
            <span>•</span>
            <span className="text-black">A Creatiq Product</span>
            <span>•</span>
            <span className="text-neutral-500">profieldhub.online</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.1]">
            Digital Intelligence and Online Network Tools
          </h1>

          <p className="text-lg sm:text-xl text-neutral-800 font-normal leading-relaxed max-w-3xl">
            NETWHO provides browser-based utilities for IP intelligence, network diagnostics, VPN and proxy assessment, location insights, privacy checks, and structured profile generation. The platform is designed for practical analysis, digital investigation, and informed decision-making.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="hero-explore-tools-btn"
              onClick={() => onNavigate('/tools')}
              className="bg-black text-white px-8 py-4 text-base font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-3 shadow-md"
            >
              <span>Explore Tools</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-check-my-ip-btn"
              onClick={() => onNavigate('/ip-check')}
              className="bg-white text-black px-7 py-4 text-base font-bold uppercase tracking-wider border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer flex items-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span>Check My IP</span>
            </button>
          </div>
        </div>

        {/* Quick Live Connection Badge / Widget */}
        <div className="mt-12 bg-neutral-50 border-2 border-black p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-300 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-40"></span>
                <span className="relative inline-flex h-3 w-3 bg-black"></span>
              </span>
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-black">
                Live Connection Inspector
              </span>
            </div>
            <button
              onClick={() => onNavigate('/ip-check')}
              className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
            >
              <span>View Full Network Diagnostics</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <span className="font-mono text-[11px] text-neutral-600 uppercase font-bold block mb-1">
                Your Public IP
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-black truncate block">
                {loadingIp ? 'Detecting IP...' : quickIp?.ip || 'Unavailable'}
              </span>
            </div>
            <div>
              <span className="font-mono text-[11px] text-neutral-600 uppercase font-bold block mb-1">
                ISP / Network
              </span>
              <span className="font-sans text-sm sm:text-base font-bold text-black truncate block">
                {loadingIp ? 'Resolving...' : quickIp?.isp || 'Unknown'}
              </span>
            </div>
            <div>
              <span className="font-mono text-[11px] text-neutral-600 uppercase font-bold block mb-1">
                IP Location
              </span>
              <span className="font-sans text-sm sm:text-base font-bold text-black truncate block">
                {loadingIp ? 'Locating...' : quickIp ? (quickIp.isUnavailable ? 'Unavailable' : `${quickIp.city}, ${quickIp.countryCode}`) : 'Unavailable'}
              </span>
            </div>
            <div>
              <span className="font-mono text-[11px] text-neutral-600 uppercase font-bold block mb-1">
                Round-Trip Latency
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-black truncate block">
                {loadingIp ? 'Measuring...' : latency?.latencyMs !== undefined ? `${latency.latencyMs} ms (${latency.status})` : 'N/A'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <IpLocationIndicator />
          </div>
        </div>
      </section>

      {/* 2. Four Master Categories */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 block mb-1">
              Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Tool Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
          >
            <span>Explore All Categories</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOL_CATEGORIES.map((cat, idx) => {
            const toolCount = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="border-2 border-black p-6 sm:p-8 bg-white flex flex-col justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-700">
                      {toolCount} Tools Available
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-black">
                    {cat.name}
                  </h3>

                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t-2 border-neutral-200 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/categories?cat=${cat.id}`)}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-2"
                  >
                    <span>View Category Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Tools Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 block mb-1">
              Active Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Featured Utilities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
          >
            <span>View All {TOOLS_REGISTRY.length} Tools</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
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
      </section>

      {/* 4. Platform Philosophy & Technical Architecture */}
      <section className="border-2 border-black p-8 sm:p-12 bg-white space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-600">
            <span>Platform Principles</span>
            <span>•</span>
            <span className="text-black">A Creatiq Product</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-black">
            NETWHO Platform Architecture
          </h2>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed">
            NETWHO helps users explore, analyse and work with digital, network, location and structured information through a growing collection of online tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-neutral-200">
          <div className="space-y-2">
            <h4 className="font-bold text-base text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Real Implementations</span>
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              NETWHO only exposes working tools with verified network diagnostics, DNS queries, WebRTC testing, and consistent generators.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-base text-black flex items-center gap-2">
              <Layers className="w-4 h-4 text-black" />
              <span>Modular Ecosystem</span>
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Each tool functions as an independent modular unit connected through unified navigation, design consistency, and shared structured data.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-base text-black flex items-center gap-2">
              <Lock className="w-4 h-4 text-black" />
              <span>Client-Side Privacy</span>
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Profile records and test datasets remain stored exclusively in your local browser sandbox. No server tracking or persistence leaks.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigate('/about')}
            className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Learn About NETWHO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/tools')}
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Browse Full Tool Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
