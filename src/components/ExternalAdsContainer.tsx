/**
 * ExternalAdsContainer Component
 * 
 * Manages external advertisement network script injection and rendering.
 * 
 * Features:
 * - Single script injection (prevents duplicates)
 * - React Strict Mode safe using ref tracking
 * - Non-blocking container rendering
 * - Responsive design
 * - Prevents layout shift and overflow
 * 
 * The external ad network script:
 * - Source: https://pl30885739.effectivecpmnetwork.com/487b249ab83f6aa8203efe13fa4ee6d6/invoke.js
 * - Container ID: container-487b249ab83f6aa8203efe13fa4ee6d6
 */

import React, { useEffect, useRef } from 'react';

interface ExternalAdsContainerProps {
  /**
   * Unique placement identifier for future multi-placement support
   * Currently supports: 'global', 'result', 'content'
   */
  placement?: 'global' | 'result' | 'content' | 'bottom';
  
  /**
   * Optional CSS class for additional styling
   */
  className?: string;
  
  /**
   * Whether to show this ad placement (allows easy enable/disable)
   */
  enabled?: boolean;
}

// Global tracker to prevent duplicate script injection across the app
const externalAdScriptTracker = new Map<string, boolean>();
const EXTERNAL_AD_SCRIPT_ID = 'external-ad-network-487b249ab83f6aa8203efe13fa4ee6d6';
const EXTERNAL_AD_CONTAINER_ID = 'container-487b249ab83f6aa8203efe13fa4ee6d6';
const EXTERNAL_AD_SCRIPT_SRC = 'https://pl30885739.effectivecpmnetwork.com/487b249ab83f6aa8203efe13fa4ee6d6/invoke.js';

/**
 * Inject the external advertisement network script
 * Only injects once, prevents duplicate injection
 */
const injectExternalAdScript = (): void => {
  // Check if script is already being tracked
  if (externalAdScriptTracker.get(EXTERNAL_AD_SCRIPT_ID)) {
    return;
  }

  // Check if script already exists in DOM
  if (document.getElementById(EXTERNAL_AD_SCRIPT_ID)) {
    externalAdScriptTracker.set(EXTERNAL_AD_SCRIPT_ID, true);
    return;
  }

  try {
    // Mark as being injected
    externalAdScriptTracker.set(EXTERNAL_AD_SCRIPT_ID, true);

    // Create and inject the external ad network script
    const script = document.createElement('script');
    script.id = EXTERNAL_AD_SCRIPT_ID;
    script.src = EXTERNAL_AD_SCRIPT_SRC;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    // Handle script load completion
    script.onload = () => {
      // Script loaded successfully
      console.debug('[ExternalAds] Advertisement network script loaded successfully');
    };

    // Handle script load errors gracefully (don't break page)
    script.onerror = () => {
      console.warn('[ExternalAds] Failed to load advertisement network script');
      externalAdScriptTracker.set(EXTERNAL_AD_SCRIPT_ID, false);
    };

    // Inject into document head
    document.head.appendChild(script);
  } catch (error) {
    console.error('[ExternalAds] Error injecting advertisement script:', error);
    externalAdScriptTracker.set(EXTERNAL_AD_SCRIPT_ID, false);
  }
};

export const ExternalAdsContainer: React.FC<ExternalAdsContainerProps> = ({
  placement = 'global',
  className = '',
  enabled = true,
}) => {
  // Use ref to track if injection was attempted (prevents duplicate attempts in Strict Mode)
  const injectionAttemptedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Inject the external ad script
    injectExternalAdScript();

    // Cleanup function (doesn't remove the script, only marks end of effect)
    return () => {
      // Script persists across navigation, which is intentional
      // This allows the ad network to track impressions across pages
    };
  }, [enabled]);

  // Don't render if disabled
  if (!enabled) {
    return null;
  }

  // Responsive container styles based on placement
  const getContainerStyles = () => {
    switch (placement) {
      case 'global':
        return 'w-full max-w-full px-2 sm:px-4 py-4 sm:py-6';
      case 'result':
        return 'w-full max-w-full px-2 sm:px-4 py-6 sm:py-8 border-t border-b border-neutral-200 bg-neutral-50';
      case 'content':
        return 'w-full max-w-full px-2 sm:px-4 py-4 sm:py-6';
      case 'bottom':
        return 'w-full max-w-full px-2 sm:px-4 py-6 sm:py-8 border-t border-neutral-200';
      default:
        return 'w-full max-w-full px-2 sm:px-4 py-4 sm:py-6';
    }
  };

  return (
    <div
      ref={containerRef}
      id="external-ads-container-wrapper"
      data-placement={placement}
      className={`flex justify-center items-start overflow-hidden ${getContainerStyles()} ${className}`}
    >
      {/* 
        External Ad Network Container
        The ad network script (invoke.js) will render ads into this container
      */}
      <div
        id={EXTERNAL_AD_CONTAINER_ID}
        className="w-full max-w-full min-h-[250px] flex items-center justify-center bg-white"
        style={{
          // Prevent horizontal overflow on mobile
          overflowX: 'hidden',
          overflowY: 'auto',
          // Limit width for readability on large screens
          maxWidth: '100%',
        }}
      >
        {/* Placeholder text while ad loads */}
        <div className="text-center text-neutral-400 text-sm py-8 px-4">
          <p>Loading advertisement...</p>
        </div>
      </div>
    </div>
  );
};

export default ExternalAdsContainer;
