import React from 'react';
import { Sparkles, Users, Search, ArrowRight, Shield, Globe, Terminal, CheckCircle2 } from 'lucide-react';

interface ServiceSelectionViewProps {
  onNavigate: (path: string) => void;
}

export const ServiceSelectionView: React.FC<ServiceSelectionViewProps> = ({ onNavigate }) => {
  const services = [
    {
      id: 'generate-ip',
      title: 'Generate IP',
      subtitle: 'Synthetic IP & Subnet Suite',
      description: 'Generate and analyse IP information.',
      details: 'Generate valid IPv4, IPv6, CIDR subnet ranges, and test network payloads for QA, APIs, and diagnostics.',
      path: '/generate-ip',
      icon: Sparkles,
      tag: 'Network Synthesis',
      features: ['IPv4 & IPv6', 'Subnet CIDR Ranges', 'Batch Generation', 'Instant Analysis'],
      primaryColor: 'border-black hover:border-black',
      btnText: 'Open Generate IP',
    },
    {
      id: 'uk-profile',
      title: 'UK Profile',
      subtitle: 'Structured Demographic Profiles',
      description: 'Create a structured UK profile.',
      details: 'Generate realistic, consistent UK test identities, regional postcodes, employment backgrounds, and persona benchmarks.',
      path: '/uk-profile',
      icon: Users,
      tag: 'Demographic Register',
      features: ['England, Scotland, Wales & NI', 'Custom Builder & Filter', 'Profile Library', 'Side-by-Side Compare'],
      primaryColor: 'border-black hover:border-black',
      btnText: 'Open UK Profile',
    },
    {
      id: 'ip-lookup',
      title: 'IP Lookup',
      subtitle: 'Intelligence & Network Inspector',
      description: 'Analyse an IP address and view available network information.',
      details: 'Inspect real-time geolocation, Autonomous System (ASN), ISP infrastructure, security risk indicators, and coordinate mapping.',
      path: '/ip-lookup',
      icon: Search,
      tag: 'Network Intelligence',
      features: ['Live Geolocation', 'ISP & ASN Details', 'IP Trust & Risk Score', 'Interactive Map'],
      primaryColor: 'border-black hover:border-black',
      btnText: 'Open IP Lookup',
    },
  ];

  return (
    <div
      id="service-selection-screen"
      className="w-full flex flex-col justify-center min-h-[calc(100vh-14rem)] py-2 sm:py-6"
    >
      {/* Header & Concise Prompt */}
      <header className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          <span>A Creatiq Product</span>
          <span>•</span>
          <span>profieldhub.online</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight">
          Choose a Service
        </h1>

        <p className="text-base sm:text-lg text-neutral-700 font-medium">
          Select a tool to get started.
        </p>
      </header>

      {/* Primary 3 Interactive Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.id}
              id={`service-card-${svc.id}`}
              onClick={() => onNavigate(svc.path)}
              className="group relative bg-white border-2 border-black p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(svc.path);
                }
              }}
            >
              {/* Top Row: Icon & Tag */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black group-hover:bg-neutral-800 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-700">
                    {svc.tag}
                  </span>
                </div>

                {/* Title & Concise Description */}
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-black group-hover:text-black transition-colors">
                    {svc.title}
                  </h2>
                  <p className="text-sm font-bold text-neutral-900 mt-1">
                    {svc.description}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {svc.details}
                  </p>
                </div>

                {/* Features Pills */}
                <div className="pt-2 border-t border-neutral-200">
                  <div className="grid grid-cols-2 gap-1.5">
                    {svc.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-700 truncate"
                      >
                        <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-6 mt-4 border-t border-neutral-100">
                <button
                  id={`service-btn-${svc.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(svc.path);
                  }}
                  className="w-full py-3.5 px-4 bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <span>{svc.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom System Telemetry */}
      <footer className="mt-8 sm:mt-12 text-center text-xs font-mono text-neutral-500 flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Services Operational</span>
        </span>
        <span>•</span>
        <span>Direct URL Support Enabled</span>
        <span>•</span>
        <span>© Creatiq • profieldhub.online</span>
      </footer>
    </div>
  );
};

export default ServiceSelectionView;
