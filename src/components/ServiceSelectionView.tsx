import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { TOOLS_REGISTRY, TOOL_CATEGORIES, getToolsByCategory } from '../data/toolsRegistry';

interface ServiceSelectionViewProps {
  onNavigate: (path: string) => void;
}

export const ServiceSelectionView: React.FC<ServiceSelectionViewProps> = ({ onNavigate }) => {
  // Primary featured tools that appear at the top
  const featuredToolIds = ['generate-ip', 'uk-profile', 'ip-lookup'];

  // Organize tools by category
  const toolsByCategory = useMemo(() => {
    return TOOL_CATEGORIES.map((category) => ({
      category,
      tools: getToolsByCategory(category.id),
    }));
  }, []);

  // Split featured and remaining tools
  const featuredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => featuredToolIds.includes(t.id));
  }, []);

  const remainingToolsByCategory = useMemo(() => {
    return toolsByCategory.map((group) => ({
      ...group,
      tools: group.tools.filter((t) => !featuredToolIds.includes(t.id)),
    }));
  }, [toolsByCategory]);

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Sparkles: LucideIcons.Sparkles,
      Users: LucideIcons.Users,
      Search: LucideIcons.Search,
      ShieldAlert: LucideIcons.ShieldAlert,
      ShieldX: LucideIcons.ShieldX,
      Cpu: LucideIcons.Cpu,
      EyeOff: LucideIcons.EyeOff,
      Compass: LucideIcons.Compass,
      Navigation: LucideIcons.Navigation,
      Clock: LucideIcons.Clock,
      UserCheck: LucideIcons.UserCheck,
      UserPlus: LucideIcons.UserPlus,
      FolderArchive: LucideIcons.FolderArchive,
      Columns3: LucideIcons.Columns3,
      Globe: LucideIcons.Globe,
      Database: LucideIcons.Database,
      Radio: LucideIcons.Radio,
      Server: LucideIcons.Server,
      Activity: LucideIcons.Activity,
      ShieldCheck: LucideIcons.ShieldCheck,
      MapPin: LucideIcons.MapPin,
      Network: LucideIcons.Network,
    };
    return icons[iconName] || LucideIcons.Zap;
  };

  const ToolCard: React.FC<{ tool: any; variant?: 'featured' | 'normal' }> = ({ tool, variant = 'normal' }) => {
    const Icon = getIconComponent(tool.iconName);
    const isFeatured = variant === 'featured';

    return (
      <div
        key={tool.id}
        id={`tool-card-${tool.id}`}
        onClick={() => onNavigate(tool.slug)}
        className={`group relative bg-white border-2 border-black flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
          isFeatured ? 'p-7 sm:p-8' : 'p-5 sm:p-6'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigate(tool.slug);
          }
        }}
      >
        {/* Top Section */}
        <div className={`space-y-${isFeatured ? '4' : '3'}`}>
          {/* Icon & Category Tag */}
          <div className="flex items-center justify-between">
            <div className={`${isFeatured ? 'w-12 h-12' : 'w-10 h-10'} bg-black text-white flex items-center justify-center border-2 border-black group-hover:bg-neutral-800 transition-colors`}>
              <Icon className={`${isFeatured ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            <span className={`font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-700 ${
              isFeatured ? 'text-[10px]' : 'text-[9px]'
            }`}>
              {tool.category.replace('-', ' ')}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className={`font-black tracking-tight text-black ${
              isFeatured ? 'text-2xl' : 'text-lg'
            }`}>
              {tool.name}
            </h2>
            <p className={`text-neutral-700 mt-1 font-medium ${
              isFeatured ? 'text-sm' : 'text-xs'
            }`}>
              {tool.shortDescription}
            </p>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className={`mt-4 pt-4 border-t border-neutral-100`}>
          <button
            id={`tool-btn-${tool.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(tool.slug);
            }}
            className={`w-full bg-black text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-neutral-800 transition-colors cursor-pointer ${
              isFeatured ? 'py-3.5 px-4 text-xs sm:text-sm' : 'py-2.5 px-3 text-[11px]'
            }`}
          >
            <span>Open Tool</span>
            <ArrowRight className={`group-hover:translate-x-1 transition-transform ${
              isFeatured ? 'w-4 h-4' : 'w-3.5 h-3.5'
            }`} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      id="service-selection-screen"
      className="w-full flex flex-col py-4 sm:py-8 space-y-10 sm:space-y-14"
    >
      {/* Header Section */}
      <header className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          <span>A Creatiq Product</span>
          <span>•</span>
          <span>profieldhub.online</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight">
            Explore NETWHO Tools
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 font-medium mt-3">
            Choose a tool to access IP intelligence, network information, privacy checks, location tools, profile generation, and other available NETWHO services.
          </p>
        </div>
      </header>

      {/* Featured Tools Section (3 Primary Services) */}
      <section>
        <div className="mb-6">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600">
            Featured Services
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} variant="featured" />
          ))}
        </div>
      </section>

      {/* Tools by Category */}
      {remainingToolsByCategory.map((group) => (
        group.tools.length > 0 && (
          <section key={group.category.id}>
            <div className="mb-6">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                {group.category.name}
              </span>
              <p className="text-sm text-neutral-600">
                {group.category.shortDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto w-full">
              {group.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} variant="normal" />
              ))}
            </div>
          </section>
        )
      ))}

      {/* Bottom Info Footer */}
      <footer className="mt-6 sm:mt-10 text-center text-xs font-mono text-neutral-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All {TOOLS_REGISTRY.length} Tools Operational</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Direct URL Support</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Mobile Optimized</span>
        </div>
        <div className="text-neutral-600">
          © Creatiq • profieldhub.online
        </div>
      </footer>
    </div>
  );
};

export default ServiceSelectionView;
