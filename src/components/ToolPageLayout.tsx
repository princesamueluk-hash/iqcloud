import React, { useState } from 'react';
import { ToolDefinition, getRelatedTools } from '../data/toolsRegistry';
import { SeoManager } from './SeoManager';
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle2, HelpCircle, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  onNavigate,
  children,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { isOnline } = useOnlineStatus();
  const relatedTools = getRelatedTools(tool.id);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: tool.categoryName, path: `/categories?cat=${tool.category}` },
    { name: tool.name, path: tool.slug },
  ];

  // Generate WebApplication & FAQPage JSON-LD schemas
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.shortDescription,
    url: `https://profieldhub.online${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    creator: {
      '@type': 'Organization',
      name: 'Creatiq',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div id={`tool-page-${tool.id}`} className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* SEO & Meta */}
      <SeoManager
        title={tool.seo.title}
        description={tool.seo.description}
        keywords={tool.seo.keywords}
        canonicalPath={tool.slug}
        breadcrumbs={breadcrumbs}
        structuredData={[webAppSchema, faqSchema]}
      />

      {/* Breadcrumb Navigation & All Services Return */}
      <nav className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-300 pb-3">
        <div className="flex items-center space-x-2">
          <button
            id="tool-layout-all-services-btn"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer text-[11px]"
          >
            <span>← All Services</span>
          </button>
          <span className="text-neutral-400">/</span>
          <button
            onClick={() => onNavigate('/tools')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Tools
          </button>
          <span>/</span>
          <span className="text-black font-bold">{tool.name}</span>
        </div>

        <div className="text-[11px] text-neutral-500 hidden sm:block">
          NETWHO Utility Engine
        </div>
      </nav>

      {/* Tool Header */}
      <header className="border-b-2 border-black pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">
            {tool.categoryName} • A Creatiq Product
          </span>
          <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
            Active Utility
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
          {tool.h1}
        </h1>
        <p className="text-base sm:text-lg text-neutral-800 leading-relaxed max-w-3xl">
          {tool.intro}
        </p>

        {!isOnline && (
          <div className="mt-4 p-3.5 bg-neutral-900 text-white border-l-4 border-amber-500 flex items-start justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Offline Notice:</strong> Real-time API telemetry is paused. Displaying static cached methodology and documentation below.
              </span>
            </div>
            <button
              onClick={() => onNavigate('/offline')}
              className="text-amber-400 underline hover:text-amber-300 whitespace-nowrap cursor-pointer shrink-0"
            >
              Offline Directory →
            </button>
          </div>
        )}
      </header>

      {/* Main Interactive Tool Work Area */}
      <main className="space-y-6">{children}</main>

      {/* Section: How It Works */}
      {tool.howItWorks && tool.howItWorks.length > 0 && (
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
              How {tool.name} Works
            </h2>
            <span className="font-mono text-xs font-bold text-neutral-600">
              Diagnostic Workflow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {tool.howItWorks.map((step) => (
              <div key={step.step} className="p-5 border-2 border-neutral-300 bg-neutral-50 space-y-2">
                <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 inline-block">
                  Step {step.step}
                </span>
                <h3 className="font-bold text-base text-black">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: Frequently Asked Questions */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>

          <div className="divide-y-2 divide-neutral-200 border-2 border-neutral-200">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="p-4 sm:p-5 bg-white">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-base text-black cursor-pointer focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0 ml-2" />
                    )}
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
      )}

      {/* Section: Related Tools (Strong Internal Linking Architecture) */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-4 border-t-2 border-black">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black uppercase tracking-tight">
              Related Tools & Utilities
            </h2>
            <button
              onClick={() => onNavigate('/tools')}
              className="text-xs font-mono font-bold uppercase text-black hover:underline flex items-center gap-1"
            >
              <span>View All Tools</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.slice(0, 3).map((rel) => (
              <button
                key={rel.id}
                onClick={() => onNavigate(rel.slug)}
                className="p-5 border-2 border-black bg-white hover:bg-neutral-50 text-left transition-colors cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-neutral-600 uppercase block mb-1">
                    {rel.categoryName}
                  </span>
                  <h3 className="font-bold text-base text-black group-hover:underline">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-black group-hover:underline pt-2 border-t border-neutral-200">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
