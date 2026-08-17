import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  LayoutDashboard,
  UserPlus,
  Dices,
  FolderArchive,
  Columns3,
  SlidersHorizontal,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
  comparisonCount: number;
}

interface NavItem {
  id: NavTab;
  code: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  comparisonCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'generator', code: '01', label: 'Generate Profile', icon: Dices },
    { id: 'create', code: '02', label: 'Build Profile', icon: UserPlus },
    { id: 'library', code: '03', label: 'Profile Library', icon: FolderArchive, badge: savedCount },
    { id: 'comparison', code: '04', label: 'Comparison', icon: Columns3, badge: comparisonCount > 0 ? comparisonCount : undefined },
    { id: 'dashboard', code: '05', label: 'Analytics', icon: LayoutDashboard },
    { id: 'settings', code: '06', label: 'Settings', icon: SlidersHorizontal },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden bg-black text-white px-5 py-4 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-40">
        <div>
          <div className="text-lg font-bold tracking-tight text-white">UK Profile</div>
          <div className="text-xs text-neutral-400 font-medium">
            A Creatiq Product
          </div>
        </div>

        <button
          id="mobile-nav-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:bg-neutral-900 border border-neutral-700 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] z-50 bg-black/80 backdrop-blur-xs">
          <div className="bg-black text-white border-b border-neutral-800 p-4 space-y-1 shadow-2xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-base transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-left font-mono text-sm opacity-80">{item.code}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 font-bold ${
                        isActive ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Fixed Black Sidebar */}
      <aside
        id="desktop-sidebar-nav"
        className="hidden lg:flex flex-col w-[250px] xl:w-[270px] bg-black text-white shrink-0 min-h-screen border-r border-neutral-800 select-none justify-between"
      >
        <div className="flex flex-col">
          {/* Header Branding */}
          <div className="p-7 border-b border-neutral-800">
            <div className="text-2xl font-bold tracking-tight text-white mb-1">
              UK Profile
            </div>
            <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              A Creatiq Product
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-4 py-3.5 text-base transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="w-5 text-left font-mono text-xs opacity-70 font-semibold">{item.code}</span>
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 font-bold ${
                        isActive ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Attribution */}
        <div className="p-6 border-t border-neutral-800 space-y-2 bg-neutral-950">
          <div className="text-xs font-mono font-semibold text-neutral-400">
            © Creatiq
          </div>
        </div>
      </aside>
    </>
  );
};
