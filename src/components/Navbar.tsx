import React, { useState } from 'react';
import { Menu, X, Globe, Settings, WifiOff, Sparkles, Users, Search, ArrowLeft } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { ThemeMode } from '../theme';
import { useOnlineStatus } from '../utils/useOnlineStatus';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, theme, onThemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOnline } = useOnlineStatus();

  const serviceLinks = [
    { label: 'All Services', path: '/' },
    { label: 'Generate IP', path: '/generate-ip' },
    { label: 'UK Profile', path: '/uk-profile' },
    { label: 'IP Lookup', path: '/ip-lookup' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isServiceActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '' || currentPath === '/home';
    }
    if (path === '/generate-ip') {
      return currentPath === '/generate-ip' || currentPath === '/tools/generate-ip';
    }
    if (path === '/uk-profile') {
      return (
        currentPath === '/uk-profile' ||
        currentPath.startsWith('/tools/uk-profile') ||
        currentPath.startsWith('/tools/build-profile') ||
        currentPath.startsWith('/tools/profile-library') ||
        currentPath.startsWith('/tools/profile-comparison')
      );
    }
    if (path === '/ip-lookup') {
      return currentPath === '/ip-lookup' || currentPath === '/tools/ip-lookup';
    }
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity - Always links back to Service Selection Start Page */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="NETWHO Homepage & Service Selection"
            >
              <div className="flex items-center space-x-2.5">
                <div className="bg-black text-white font-mono font-black text-lg px-2.5 py-1 tracking-tighter group-hover:bg-neutral-800 transition-colors">
                  W
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-black block leading-none">
                    NETWHO
                  </span>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-neutral-600 block mt-0.5">
                    A Creatiq Product
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links - The 3 Core Services + All Services */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Services Navigation">
            {serviceLinks.map((link) => {
              const active = isServiceActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3.5 py-2 text-xs lg:text-sm font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                    active
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities & Action */}
          <div className="hidden lg:flex items-center space-x-2">
            {!isOnline && (
              <button
                onClick={() => handleLinkClick('/offline')}
                className="px-2.5 py-1.5 bg-amber-500 text-black text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
                title="Offline Mode Active - Click to view cached tools"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </button>
            )}
            <ThemeSelector theme={theme} onThemeChange={onThemeChange} compact />
          </div>

          {/* Action CTA: Check My IP */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              id="nav-check-my-ip-btn"
              onClick={() => handleLinkClick('/ip-check')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all cursor-pointer flex items-center space-x-2 ${
                currentPath === '/ip-check' || currentPath === '/tools/my-ip'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white shadow-sm'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Check My IP</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 border-2 border-black text-black hover:bg-neutral-100 cursor-pointer focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 pt-4 pb-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
            <span className="font-mono text-xs uppercase font-bold text-neutral-600">
              Services & Tools
            </span>
            <span className="font-mono text-xs font-bold text-black bg-neutral-100 px-2 py-0.5">
              profieldhub.online
            </span>
          </div>

          <div className="space-y-1.5">
            {serviceLinks.map((link) => {
              const active = isServiceActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-between border-2 ${
                    active
                      ? 'bg-black text-white border-black font-black'
                      : 'bg-white text-black border-neutral-200 hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs">→</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Utilities in Mobile Menu */}
          <div className="pt-3 border-t-2 border-neutral-200 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLinkClick('/tools')}
              className="py-2.5 px-2 bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold uppercase text-center hover:bg-neutral-200"
            >
              All Tools
            </button>
            <button
              onClick={() => handleLinkClick('/about')}
              className="py-2.5 px-2 bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold uppercase text-center hover:bg-neutral-200"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick('/settings')}
              className="py-2.5 px-2 bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold uppercase text-center hover:bg-neutral-200"
            >
              Settings
            </button>
          </div>

          <div className="pt-2 border-t-2 border-neutral-200 space-y-3">
            {!isOnline && (
              <button
                onClick={() => handleLinkClick('/offline')}
                className="w-full py-3 bg-amber-500 text-black text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer font-mono"
              >
                <WifiOff className="w-4 h-4" />
                <span>Browse Offline Catalog</span>
              </button>
            )}
            <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
            <button
              onClick={() => handleLinkClick('/ip-check')}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <Globe className="w-4 h-4" />
              <span>Check My IP</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-xs font-mono text-neutral-600 block">
              NETWHO • A Creatiq Product
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
