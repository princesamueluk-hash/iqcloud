/**
 * ScriptAdsManager Component
 * 
 * Manages third-party advertisement scripts that don't require containers.
 * These scripts inject their own advertisement elements directly.
 * 
 * Features:
 * - Prevents duplicate script injection
 * - React Strict Mode safe
 * - Graceful error handling
 * - Non-blocking script loading
 * 
 * Managed Scripts:
 * - AD 2: https://pl30885738.effectivecpmnetwork.com/50/b6/fc/50b6fc8dcb4d46f0e4ec4f7a48984c97.js
 * - AD 3: https://pl30885741.effectivecpmnetwork.com/d8/e7/66/d8e7667a985e60d3761ebb99b34e858b.js
 */

import React, { useEffect, useRef } from 'react';

// Configuration for each script ad
interface ScriptAdConfig {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
}

// Global tracker to prevent duplicate script injection
const scriptAdTracker = new Map<string, boolean>();

// AD 2 Configuration
const AD_2_CONFIG: ScriptAdConfig = {
  id: 'external-ad-script-2-50b6fc8dcb4d46f0e4ec4f7a48984c97',
  src: 'https://pl30885738.effectivecpmnetwork.com/50/b6/fc/50b6fc8dcb4d46f0e4ec4f7a48984c97.js',
  async: true,
};

// AD 3 Configuration
const AD_3_CONFIG: ScriptAdConfig = {
  id: 'external-ad-script-3-d8e7667a985e60d3761ebb99b34e858b',
  src: 'https://pl30885741.effectivecpmnetwork.com/d8/e7/66/d8e7667a985e60d3761ebb99b34e858b.js',
  async: true,
};

/**
 * Inject a script ad without requiring a container
 * The script will inject its own advertisement elements
 */
const injectScriptAd = (config: ScriptAdConfig): void => {
  // Check if script is already being tracked
  if (scriptAdTracker.get(config.id)) {
    return;
  }

  // Check if script already exists in DOM
  if (document.getElementById(config.id)) {
    scriptAdTracker.set(config.id, true);
    return;
  }

  try {
    // Mark as being injected
    scriptAdTracker.set(config.id, true);

    // Create script element
    const script = document.createElement('script');
    script.id = config.id;
    script.src = config.src;
    
    if (config.async !== false) {
      script.async = true;
    }
    
    if (config.defer) {
      script.defer = true;
    }

    // Apply custom attributes
    if (config.attributes) {
      Object.entries(config.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }

    // Handle script load completion
    script.onload = () => {
      console.debug(`[ScriptAds] Advertisement script ${config.id} loaded successfully`);
    };

    // Handle script load errors gracefully (don't break page)
    script.onerror = () => {
      console.warn(`[ScriptAds] Failed to load advertisement script ${config.id}`);
      scriptAdTracker.set(config.id, false);
    };

    // Inject into document body to allow self-injection
    // Some ad scripts need to be in body to work correctly
    document.body.appendChild(script);
  } catch (error) {
    console.error(`[ScriptAds] Error injecting advertisement script ${config.id}:`, error);
    scriptAdTracker.set(config.id, false);
  }
};

interface ScriptAdsManagerProps {
  /**
   * Which script ads to load
   */
  scripts?: ('ad2' | 'ad3' | 'all')[];
  
  /**
   * Whether to enable this manager
   */
  enabled?: boolean;
}

/**
 * ScriptAdsManager Component
 * Loads script-based advertisements that create their own DOM elements
 */
export const ScriptAdsManager: React.FC<ScriptAdsManagerProps> = ({
  scripts = ['all'],
  enabled = true,
}) => {
  // Use ref to track if injection was attempted (prevents duplicate attempts in Strict Mode)
  const injectionAttemptedRef = useRef(false);

  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      return;
    }

    // Skip if injection was already attempted in this render
    if (injectionAttemptedRef.current) {
      return;
    }

    // Mark injection as attempted
    injectionAttemptedRef.current = true;

    // Maintain the required ad order: AD B first, AD C second.
    const orderedScripts = scripts.includes('all')
      ? ['ad2', 'ad3']
      : scripts.filter((script) => script === 'ad2' || script === 'ad3');

    for (const scriptId of orderedScripts) {
      if (scriptId === 'ad2') {
        injectScriptAd(AD_2_CONFIG);
      }

      if (scriptId === 'ad3') {
        injectScriptAd(AD_3_CONFIG);
      }
    }

    // Cleanup function
    return () => {
      // Scripts persist across navigation, which is intentional
      // This allows the ad network to track impressions across pages
    };
  }, [enabled, scripts]);

  // This component doesn't render anything visible
  // The script ads create their own DOM elements
  return null;
};

export default ScriptAdsManager;
