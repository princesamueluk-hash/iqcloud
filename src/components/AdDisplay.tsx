/**
 * AdDisplay Component
 * Professional advertisement display with countdown and state management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import adManager, { type Advertisement, type AdState } from '../services/adManager';

interface AdDisplayProps {
  /**
   * Optional custom styling
   */
  className?: string;
  /**
   * Whether to show as modal overlay or inline banner
   */
  variant?: 'banner' | 'modal';
  /**
   * Position for banner variant
   */
  position?: 'top' | 'bottom';
}

export const AdDisplay: React.FC<AdDisplayProps> = ({
  className = '',
  variant = 'banner',
  position = 'top',
}) => {
  const [adState, setAdState] = useState<AdState>(adManager.getState());
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(adManager.getCurrentAd());
  const [timeUntilDismissible, setTimeUntilDismissible] = useState<number>(0);

  // Subscribe to ad manager state changes
  useEffect(() => {
    const unsubscribe = adManager.onStateChange((state) => {
      setAdState(state);
      setCurrentAd(adManager.getCurrentAd());
      setTimeUntilDismissible(adManager.getTimeUntilDismissible());
    });

    return () => unsubscribe();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (adState === 'DISMISS_LOCKED') {
      const interval = setInterval(() => {
        const remaining = adManager.getTimeUntilDismissible();
        setTimeUntilDismissible(remaining);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [adState]);

  const handleClose = useCallback(() => {
    adManager.dismissAd();
  }, []);

  // Don't render if no ad is active
  if (adState === 'IDLE' || adState === 'COOLDOWN' || !currentAd) {
    return null;
  }

  const canDismiss = adManager.canDismissCurrentAd();

  if (variant === 'modal') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${className}`}>
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Close button - always visible but only functional after lock period */}
          <button
            onClick={handleClose}
            disabled={!canDismiss}
            aria-label="Close advertisement"
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
              canDismiss
                ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <X size={20} />
          </button>

          {/* Ad Image */}
          {currentAd.imageUrl && (
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-48 object-cover"
            />
          )}

          {/* Ad Content */}
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Sponsored
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{currentAd.title}</h3>
            <p className="text-gray-700 text-sm mb-4">{currentAd.description}</p>

            {/* Countdown or CTA */}
            <div className="flex flex-col gap-3">
              {!canDismiss ? (
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">You can close this in</p>
                  <p className="text-2xl font-bold text-gray-900">{timeUntilDismissible}</p>
                </div>
              ) : (
                <>
                  {currentAd.ctaUrl && currentAd.ctaText && (
                    <a
                      href={currentAd.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                    >
                      {currentAd.ctaText}
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  >
                    ✕ Close Advertisement
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Advertisement
            </p>
            <h4 className="font-bold text-gray-900 text-sm md:text-base">{currentAd.title}</h4>
            <p className="text-gray-600 text-xs md:text-sm">{currentAd.description}</p>
          </div>

          {/* Countdown or Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {!canDismiss ? (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Close in</p>
                <p className="text-xl font-bold text-gray-900 text-center w-8">
                  {timeUntilDismissible}
                </p>
              </div>
            ) : (
              <>
                {currentAd.ctaUrl && currentAd.ctaText && (
                  <a
                    href={currentAd.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    {currentAd.ctaText}
                  </a>
                )}
                <button
                  onClick={handleClose}
                  aria-label="Close advertisement"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDisplay;
