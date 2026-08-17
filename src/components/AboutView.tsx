import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Shield, Globe, MapPin, Users, Layers, Terminal } from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS_REGISTRY } from '../data/toolsRegistry';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is NETWHO and who is behind it?',
      answer:
        'NETWHO is a digital intelligence and online utility platform owned and operated by Creatiq. The platform is hosted on profieldhub.online and provides a consolidated suite of network diagnostics, IP lookups, privacy audits, geolocation tools, and structured profile generation.',
    },
    {
      question: 'Are NETWHO tools free to use?',
      answer:
        'Yes, all utilities on NETWHO are fully accessible directly in your web browser with no registration or paywalls required.',
    },
    {
      question: 'Does NETWHO store or log my personal IP address and data?',
      answer:
        'No. NETWHO processes diagnostic queries directly on the client side. Profile datasets and comparison matrices remain strictly in your local browser sandbox.',
    },
    {
      question: 'How are new tools added to the platform?',
      answer:
        'NETWHO is built on a modular architecture allowing independent utilities to be integrated seamlessly into the shared navigation, design system, and SEO hierarchy as the platform expands.',
    },
  ];

  return (
    <div id="about-page" className="space-y-16 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <header className="border-b-2 border-black pb-8">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
          <span>NETWHO Overview</span>
          <span>•</span>
          <span>profieldhub.online</span>
          <span>•</span>
          <span className="text-black font-bold">A Creatiq Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
          About NETWHO
        </h1>
        <p className="text-base sm:text-lg text-neutral-800 mt-4 leading-relaxed max-w-3xl">
          NETWHO is a growing digital intelligence and online utility platform that brings practical tools together in one place. The platform is designed to help users explore information related to networks, IP addresses, connections, locations and structured data through a collection of focused web-based tools.
        </p>
        <p className="text-base text-neutral-700 mt-2 leading-relaxed max-w-3xl">
          As the platform grows, additional tools and utilities can be added while maintaining one consistent experience.
        </p>
      </header>

      {/* Section 1: What NETWHO Does */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-3">
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            01
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            What NETWHO Does
          </h2>
        </div>
        <p className="text-base text-neutral-800 leading-relaxed">
          NETWHO brings together critical web diagnostics, geolocation insights, and structured data generation into a single, high-contrast, professional workspace. Whether you are troubleshooting network routing, verifying whether your browser leaks WebRTC candidates over a VPN, or generating structured demographic datasets for software testing, NETWHO delivers immediate, verifiable utility.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 border-2 border-black bg-white space-y-2">
            <h3 className="font-bold text-base text-black flex items-center gap-2">
              <Globe className="w-4 h-4 text-black" />
              <span>Network & IP Intelligence</span>
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Real-time public IP inspection, Autonomous System Number (ASN) lookup, DNS-over-HTTPS queries, and round-trip latency measurements.
            </p>
          </div>
          <div className="p-5 border-2 border-black bg-white space-y-2">
            <h3 className="font-bold text-base text-black flex items-center gap-2">
              <Shield className="w-4 h-4 text-black" />
              <span>Privacy & Connection Analysis</span>
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Multi-signal heuristic VPN and proxy detection, WebRTC IP leak checks, and browser fingerprinting transparency audits.
            </p>
          </div>
          <div className="p-5 border-2 border-black bg-white space-y-2">
            <h3 className="font-bold text-base text-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" />
              <span>Location & Coordinates</span>
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              IP geolocation mapping, international coordinate inspectors, timezone offset calculators, and synthetic address generators.
            </p>
          </div>
          <div className="p-5 border-2 border-black bg-white space-y-2">
            <h3 className="font-bold text-base text-black flex items-center gap-2">
              <Users className="w-4 h-4 text-black" />
              <span>Structured Profile Generation</span>
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Consistent, multi-field UK demographic profile creation, builder tools, local library management, and side-by-side comparison matrices.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Explore the Tools */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-3">
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            02
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Explore the Tools
          </h2>
        </div>
        <p className="text-base text-neutral-800 leading-relaxed">
          Access the primary utilities available on NETWHO directly:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('/tools/ip-lookup')}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-100 text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-xs font-bold text-neutral-600 block mb-1">Network</span>
            <span className="font-bold text-base text-black group-hover:underline block">IP Lookup →</span>
            <span className="text-xs text-neutral-700 mt-1 block">Inspect any IPv4 or IPv6 address.</span>
          </button>

          <button
            onClick={() => onNavigate('/tools/vpn-detection')}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-100 text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-xs font-bold text-neutral-600 block mb-1">Privacy</span>
            <span className="font-bold text-base text-black group-hover:underline block">VPN Detection →</span>
            <span className="text-xs text-neutral-700 mt-1 block">Check connection indicators & leaks.</span>
          </button>

          <button
            onClick={() => onNavigate('/tools/uk-profile')}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-100 text-left transition-colors cursor-pointer group"
          >
            <span className="font-mono text-xs font-bold text-neutral-600 block mb-1">Profile</span>
            <span className="font-bold text-base text-black group-hover:underline block">UK Profile →</span>
            <span className="text-xs text-neutral-700 mt-1 block">Generate structured UK test profiles.</span>
          </button>
        </div>
      </section>

      {/* Section 3: How the Platform Works */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-3">
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            03
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            How the Platform Works
          </h2>
        </div>
        <p className="text-base text-neutral-800 leading-relaxed">
          NETWHO is engineered with zero-friction browser execution. Tools interact with open web standards such as WebRTC, DNS-over-HTTPS (DoH), Network Information API, and high-performance client algorithms to produce instant outputs without complex server dependencies.
        </p>
        <div className="p-6 border-2 border-black bg-neutral-50 space-y-3 font-mono text-sm">
          <div className="flex items-center gap-2 font-bold text-black">
            <Terminal className="w-4 h-4" />
            <span>Platform Principles</span>
          </div>
          <ul className="space-y-2 text-neutral-800 text-xs sm:text-sm">
            <li>• <strong>Client-authoritative:</strong> High-speed local execution and zero unnecessary remote tracking.</li>
            <li>• <strong>High-contrast UI:</strong> Uncompromising readability, 16px body minimum, bold headings, pure white backgrounds.</li>
            <li>• <strong>Interconnected:</strong> Deep internal linking across all related tools and categories.</li>
          </ul>
        </div>
      </section>

      {/* Section 4: Built to Grow */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-3">
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            04
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Built to Grow
          </h2>
        </div>
        <p className="text-base text-neutral-800 leading-relaxed">
          As a central digital utility brand within Creatiq, NETWHO is designed with a modular architecture that makes expanding tool categories and deploying new utilities seamless. Future tools spanning deeper packet analysis, DNS propagation checkers, and global profile registers integrate into the exact same unified interface.
        </p>
      </section>

      {/* Section 5: Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-3">
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            05
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y-2 divide-black border-2 border-black bg-white">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="p-5">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-base sm:text-lg text-black cursor-pointer focus:outline-none"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
