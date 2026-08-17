/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TOOLS_REGISTRY, getToolBySlug, getToolById, ToolDefinition } from './data/toolsRegistry';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ServiceSelectionView } from './components/ServiceSelectionView';
import { HomeView } from './components/HomeView';
import { ToolsDirectoryView } from './components/ToolsDirectoryView';
import { CategoriesView } from './components/CategoriesView';
import { AboutView } from './components/AboutView';
import { SettingsView } from './components/SettingsView';
import { ToolPageLayout } from './components/ToolPageLayout';
import { SeoManager } from './components/SeoManager';
import { getSavedProfiles } from './utils/storage';
import { ThemeMode, getInitialTheme, applyTheme, THEME_STORAGE_KEY } from './theme';
import { getConfiguredRouteForHostname } from './domainRoutes';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { AdDisplay } from './components/AdDisplay';
import { ExternalAdsContainer } from './components/ExternalAdsContainer';
import { ScriptAdsManager } from './components/ScriptAdsManager';
import { LoadingScreen, MIN_LOADING_DURATION } from './components/LoadingScreen';
import { OfflineBanner, OfflineCatalogView } from './components/OfflineMode';
import adManager from './services/adManager';
import NETWHO_ADS from './data/adsRegistry';

// Specific Interactive Tool Components
import { GenerateIpTool } from './components/tools/GenerateIpTool';
import { IpLookupTool } from './components/tools/IpLookupTool';
import { MyIpTool } from './components/tools/MyIpTool';
import { VpnDetectionTool } from './components/tools/VpnDetectionTool';
import { DnsLookupTool } from './components/tools/DnsLookupTool';
import { LocationGeneratorTool } from './components/tools/LocationGeneratorTool';
import { InteractiveNetworkTool } from './components/tools/InteractiveNetworkTool';
import { UkProfileTool } from './components/tools/UkProfileTool';
import { IpResultProvider } from './context/IpResultContext';

const MAX_LOADING_SAFETY_TIMEOUT = 18000; // Safety guard: max 18s

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [settingsProfiles, setSettingsProfiles] = useState(() => getSavedProfiles());
  const [isAppReady, setIsAppReady] = useState(false);

  // Coordinate background initialization with the minimum 10-second branded presentation
  useEffect(() => {
    const mountTime = Date.now();
    let minTimer: ReturnType<typeof setTimeout> | null = null;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    // Background app initialization (rendering, DOM readiness) proceeds immediately
    const frameId = requestAnimationFrame(() => {
      const elapsed = Date.now() - mountTime;
      const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsed);

      minTimer = setTimeout(() => {
        setIsAppReady(true);
      }, remainingTime);
    });

    // Safety timeout: in case of any unhandled network or browser hang, never block user permanently
    safetyTimer = setTimeout(() => {
      setIsAppReady(true);
    }, MAX_LOADING_SAFETY_TIMEOUT);

    return () => {
      cancelAnimationFrame(frameId);
      if (minTimer) clearTimeout(minTimer);
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, []);

  // Initialize Ad Manager on app mount
  useEffect(() => {
    adManager.registerAds(NETWHO_ADS);
    
    // Try to display an eligible ad on the home page
    if (typeof window !== 'undefined') {
      const isHomePage = !window.location.hash || window.location.hash === '#' || window.location.hash === '#/';
      if (isHomePage) {
        // Delay ad display slightly to let page render
        const timer = setTimeout(() => {
          adManager.displayNextEligibleAd('/');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  // Normalize current path from window.location.hash or pathname
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';

    const configuredRoute = getConfiguredRouteForHostname(window.location.hostname);
    if (configuredRoute && configuredRoute !== '/') {
      return configuredRoute;
    }

    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const clean = hash.replace(/^#\/?/, '/');
      return clean || '/';
    }
    const path = window.location.pathname;
    if (path && path !== '/') {
      return path;
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash && hash.startsWith('#') ? hash.replace(/^#\/?/, '/') : (window.location.pathname || '/');
      setCurrentPath(path || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    const safePath = path.startsWith('/') ? path : `/${path}`;
    window.location.hash = safePath;
    setCurrentPath(safePath);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Attempt to display eligible ad for this page after a short delay
    setTimeout(() => {
      if (adManager.canDisplayAd()) {
        adManager.displayNextEligibleAd(safePath);
      }
    }, 500);
  };

  // Route Resolver
  const renderCurrentView = () => {
    // 1. Service Selection Homepage (First Screen After Loading)
    if (currentPath === '/' || currentPath === '' || currentPath === '/services') {
      return (
        <>
          <SeoManager
            title="NETWHO | Service Selection & Network Intelligence Suite"
            description="Choose your NETWHO digital utility: Generate synthetic IP addresses, create structured UK demographic profiles, or perform real-time IP lookup and diagnostics."
            canonicalPath="/"
          />
          <ServiceSelectionView onNavigate={navigateTo} />
        </>
      );
    }

    // ============================================================
    // PRIMARY DEDICATED TOOL ROUTES
    // ============================================================

    // Dedicated Route: Generate IP
    if (currentPath === '/generate-ip' || currentPath === '/tools/generate-ip') {
      const toolDef = getToolById('generate-ip') || getToolBySlug('/generate-ip')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <GenerateIpTool onNavigate={navigateTo} />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: IP Lookup
    if (currentPath === '/ip-lookup' || currentPath === '/tools/ip-lookup') {
      const toolDef = getToolById('ip-lookup') || getToolBySlug('/ip-lookup')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <IpLookupTool />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: UK Profile & Sub-routes (Build, Library, Comparison)
    if (
      currentPath === '/uk-profile' ||
      currentPath === '/tools/uk-profile' ||
      currentPath === '/tools/build-profile' ||
      currentPath === '/tools/profile-library' ||
      currentPath === '/tools/profile-comparison'
    ) {
      let subTab: 'generator' | 'create' | 'library' | 'comparison' = 'generator';
      let toolId = 'uk-profile';
      if (currentPath === '/tools/build-profile' || currentPath === '/tools/build-profile') {
        subTab = 'create';
        toolId = 'build-profile';
      } else if (currentPath === '/tools/profile-library') {
        subTab = 'library';
        toolId = 'profile-library';
      } else if (currentPath === '/tools/profile-comparison') {
        subTab = 'comparison';
        toolId = 'profile-comparison';
      }

      const toolDef = getToolById(toolId) || getToolById('uk-profile')!;

      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <UkProfileTool initialSubTab={subTab} />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: My IP
    if (currentPath === '/my-ip' || currentPath === '/tools/my-ip' || currentPath === '/ip-check') {
      const toolDef = getToolById('my-ip') || getToolBySlug('/tools/my-ip')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <MyIpTool />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: VPN Detection
    if (currentPath === '/vpn-detection' || currentPath === '/tools/vpn-detection') {
      const toolDef = getToolById('vpn-detection') || getToolBySlug('/tools/vpn-detection')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <VpnDetectionTool />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: DNS Lookup
    if (currentPath === '/dns-lookup' || currentPath === '/tools/dns-lookup') {
      const toolDef = getToolById('dns-lookup') || getToolBySlug('/tools/dns-lookup')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <DnsLookupTool />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: Location Generator
    if (currentPath === '/location-generator' || currentPath === '/tools/location-generator') {
      const toolDef = getToolById('location-generator') || getToolBySlug('/tools/location-generator')!;
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          <LocationGeneratorTool />
        </ToolPageLayout>
      );
    }

    // Dedicated Route: Full Overview / Comprehensive Dashboard
    if (currentPath === '/dashboard' || currentPath === '/overview' || currentPath === '/home') {
      return (
        <>
          <SeoManager
            title="NETWHO | Digital Intelligence and Full Network Dashboard"
            description="NETWHO full intelligence dashboard for IP intelligence, network diagnostics, VPN assessment, and structured profile generation."
            canonicalPath="/dashboard"
          />
          <HomeView onNavigate={navigateTo} />
        </>
      );
    }

    // 2. Tools Directory
    if (currentPath === '/tools') {
      return (
        <>
          <SeoManager
            title="Tool Directory | NETWHO Online Utilities"
            description="Complete directory of NETWHO digital utilities: Network diagnostics, IP lookups, VPN detection, DNS queries, and demographic profiles."
            canonicalPath="/tools"
          />
          <ToolsDirectoryView onNavigate={navigateTo} />
        </>
      );
    }

    // 3. Categories View
    if (currentPath.startsWith('/categories')) {
      return (
        <>
          <SeoManager
            title="Tool Categories | NETWHO Architecture"
            description="Explore NETWHO tools organized by category: Network & IP, Privacy & Connection, Location, and Structured Profiles."
            canonicalPath="/categories"
          />
          <CategoriesView onNavigate={navigateTo} />
        </>
      );
    }

    // 4. About NETWHO
    if (currentPath === '/about') {
      return (
        <>
          <SeoManager
            title="About NETWHO | Digital Intelligence Platform"
            description="Learn about NETWHO, a digital intelligence and online utility platform by Creatiq hosted at profieldhub.online."
            canonicalPath="/about"
          />
          <AboutView onNavigate={navigateTo} />
        </>
      );
    }

    if (currentPath === '/settings') {
      return (
        <>
          <SeoManager
            title="Settings | NETWHO"
            description="Configure your NETWHO experience with appearance preferences, local profile storage, and platform settings."
            canonicalPath="/settings"
          />
          <SettingsView
            profiles={settingsProfiles}
            onRefreshProfiles={() => setSettingsProfiles(getSavedProfiles())}
            theme={theme}
            onThemeChange={setTheme}
          />
        </>
      );
    }

    // Offline Catalog & Local Guide Archive
    if (currentPath === '/offline' || currentPath === '/offline-mode') {
      return (
        <>
          <SeoManager
            title="Offline Catalog & Documentation | NETWHO"
            description="Browse cached utility specifications, operational workflows, and offline documentation across the NETWHO intelligence suite."
            canonicalPath="/offline"
          />
          <OfflineCatalogView onNavigate={navigateTo} />
        </>
      );
    }

    // 5. Individual Tool Pages from Registry
    const toolDef = getToolBySlug(currentPath);

    if (toolDef) {
      return (
        <ToolPageLayout tool={toolDef} onNavigate={navigateTo}>
          {toolDef.id === 'generate-ip' && <GenerateIpTool onNavigate={navigateTo} />}
          {toolDef.id === 'ip-lookup' && <IpLookupTool />}
          {toolDef.id === 'uk-profile' && <UkProfileTool />}
          {toolDef.id === 'my-ip' && <MyIpTool />}
          {toolDef.id === 'vpn-detection' && <VpnDetectionTool />}
          {toolDef.id === 'dns-lookup' && <DnsLookupTool />}
          {toolDef.id === 'location-generator' && <LocationGeneratorTool />}
          {toolDef.id !== 'generate-ip' &&
            toolDef.id !== 'ip-lookup' &&
            toolDef.id !== 'uk-profile' &&
            toolDef.id !== 'my-ip' &&
            toolDef.id !== 'vpn-detection' &&
            toolDef.id !== 'dns-lookup' &&
            toolDef.id !== 'location-generator' && (
              <InteractiveNetworkTool toolId={toolDef.id} />
            )}
        </ToolPageLayout>
      );
    }

    // Fallback: 404 Not Found -> Redirect to Services
    return (
      <div className="text-center py-20 space-y-6">
        <h1 className="text-4xl font-black text-black">Tool Not Found</h1>
        <p className="text-neutral-700">
          The requested tool or page could not be located in the NETWHO directory.
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="px-6 py-3 bg-black text-white font-bold text-xs uppercase cursor-pointer"
        >
          Return to Service Selection
        </button>
      </div>
    );
  };

  return (
    <IpResultProvider>
      <div
        id="netwho-app-root"
        className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white"
      >
        {/* Creatiq Loading Screen - Premium 3D Splash */}
        <LoadingScreen isReady={isAppReady} theme={theme} />

        {/* Offline Mode Banner */}
        <OfflineBanner onOpenCatalog={() => navigateTo('/offline')} />

        {/* Advertisement Display System */}
        <AdDisplay variant="modal" />

        {/* Global Brand Navbar */}
        <Navbar currentPath={currentPath} onNavigate={navigateTo} theme={theme} onThemeChange={setTheme} />
        <PwaInstallPrompt />

        {/* Main Viewport Container */}
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
          {renderCurrentView()}
        </main>

        {/* External Advertisement Network - Global Placement */}
        <ExternalAdsContainer placement="global" enabled={true} />

        {/* Script-Based Advertisement Managers (AD 2 & AD 3) */}
        <ScriptAdsManager scripts={['all']} enabled={true} />

        {/* Global Categorized Footer with Creatiq Attribution */}
        <Footer onNavigate={navigateTo} />
      </div>
    </IpResultProvider>
  );
}
