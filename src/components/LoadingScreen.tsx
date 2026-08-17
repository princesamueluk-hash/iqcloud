/**
 * Creatiq Loading Screen
 * Premium 3D animated branded splash screen with Creatiq branding
 * Enforces minimum 10-second visual presentation while NETWHO initializes in the background
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeMode } from '../theme';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const MIN_LOADING_DURATION = 10000; // 10 seconds minimum display time

interface LoadingScreenProps {
  /**
   * Whether the app is ready and should fade out
   */
  isReady: boolean;
  /**
   * Current theme mode
   */
  theme: ThemeMode;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isReady, theme }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef(Date.now());

  // Track progress and elapsed time for the 10-second timeline
  useEffect(() => {
    const startTime = Date.now();
    startRef.current = startTime;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      setElapsedTime(elapsed);

      // Keep updating until ready and minimum duration met
      if (isReady && elapsed >= MIN_LOADING_DURATION) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isReady]);

  // Initiate fade-out only when BOTH isReady is true AND minimum 10s has passed
  useEffect(() => {
    if (isReady && elapsedTime >= MIN_LOADING_DURATION) {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
      }, 750); // Allow fade-out and subtle scale transition to finish cleanly
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, elapsedTime]);

  if (!isVisible) {
    return null;
  }

  // Calculate timeline stage (0-2s, 2-4s, 4-6s, 6-8s, 8-9s, 9-10s+)
  const seconds = elapsedTime / 1000;
  const progressPercent = Math.min(100, Math.round((elapsedTime / MIN_LOADING_DURATION) * 100));

  // Determine stage flags
  const stage1Appeared = seconds >= 0;     // 0-2s: Text appears
  const stage2Depth = seconds >= 2;        // 2-4s: Gains 3D depth & dimension
  const stage3Sweep = seconds >= 4;        // 4-6s: Subtle light sweep across text
  const stage4Floating = seconds >= 6;     // 6-8s: Gentle perspective & floating 3D
  const stage5Tagline = seconds >= 8;      // 8-9s: Subtitle & status reveal
  const stage6Ready = seconds >= 9.2;      // 9-10s: Ready for NETWHO transition

  const isDark = theme === 'dark' || theme === 'dark-enhanced';
  const is3D = theme === '3d' || theme === 'dark-enhanced';

  // Palette configuration based on theme
  let bgColor = '#f8f8f7'; // Premium warm-neutral off-white
  let textColor = '#0c0d0e';
  let accentColor = '#0066cc';
  let secondaryColor = '#475569';
  let glowColor = 'rgba(0, 102, 204, 0.25)';

  if (isDark) {
    bgColor = '#090a0f';
    textColor = '#ffffff';
    accentColor = '#38bdf8';
    secondaryColor = '#94a3b8';
    glowColor = 'rgba(56, 189, 248, 0.35)';
  }

  if (is3D) {
    bgColor = '#07090e';
    textColor = '#ffffff';
    accentColor = '#06b6d4';
    secondaryColor = '#64748b';
    glowColor = 'rgba(6, 182, 212, 0.4)';
  }

  // Accessibility check for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Dynamic phase title for stage 8-10s
  const currentStatusText = (() => {
    if (stage6Ready && isReady) return 'READY — LAUNCHING NETWHO';
    if (stage5Tagline) return 'PREPARING YOUR EXPERIENCE';
    if (stage4Floating) return 'CALIBRATING SECURITY & INTELLIGENCE';
    if (stage3Sweep) return 'INITIALIZING NETWORK TELEMETRY';
    if (stage2Depth) return 'LOADING CORE WORKSPACE';
    return 'POWERING DIGITAL INTELLIGENCE';
  })();

  return (
    <div
      id="creatiq-loading-screen"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between select-none transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.03] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: bgColor,
      }}
      aria-label="Creatiq Loading Screen"
      role="status"
      aria-live="polite"
    >
      {/* Background Subtle Tech Grid & Ambient Radial Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15"
          style={{ backgroundColor: accentColor }}
        />
        {/* Fine background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Header Tag */}
      <div className="relative w-full max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest uppercase opacity-70">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
          <span style={{ color: textColor }}>A CREATIQ PRODUCT</span>
        </div>
        <div className="text-[11px] font-mono uppercase tracking-wider opacity-60" style={{ color: secondaryColor }}>
          NETWHO • profieldhub.online
        </div>
      </div>

      {/* Central 3D Branded Experience (Timeline 0-10s) */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 z-10">
        <div
          className={`relative flex flex-col items-center justify-center transition-all duration-1000 ${
            stage4Floating && !prefersReducedMotion ? 'animate-creatiq-float' : ''
          }`}
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main 3D Creatiq Logo Block */}
          <div className="relative group text-center py-6 px-8">
            {/* 3D Depth Backdrop Layer (Stage 2: 2-4s) */}
            {stage2Depth && !prefersReducedMotion && (
              <>
                <div
                  className="absolute inset-0 font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight transition-all duration-1000 flex items-center justify-center"
                  style={{
                    color: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0, 102, 204, 0.15)',
                    transform: 'translateZ(-20px) translateY(8px) scale(1.02)',
                    filter: 'blur(4px)',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    letterSpacing: '-0.03em',
                  }}
                  aria-hidden="true"
                >
                  Creatiq
                </div>
                <div
                  className="absolute inset-0 font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight transition-all duration-1000 flex items-center justify-center"
                  style={{
                    color: isDark ? '#0284c7' : '#0369a1',
                    transform: 'translateZ(-10px) translateY(4px)',
                    opacity: 0.35,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    letterSpacing: '-0.03em',
                  }}
                  aria-hidden="true"
                >
                  Creatiq
                </div>
              </>
            )}

            {/* Primary Foreground 3D Text (Stage 1 & Enhanced 3D) */}
            <h1
              className={`font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight relative transition-all duration-700 ${
                stage1Appeared && !prefersReducedMotion ? 'animate-creatiq-in' : ''
              }`}
              style={{
                color: textColor,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                letterSpacing: '-0.03em',
                textShadow: stage2Depth
                  ? isDark
                    ? `
                      0 1px 0 #38bdf8,
                      0 2px 0 #0284c7,
                      0 3px 0 #0369a1,
                      0 4px 0 #075985,
                      0 8px 24px rgba(56, 189, 248, 0.4),
                      0 16px 36px rgba(0, 0, 0, 0.8)
                    `
                    : `
                      0 1px 0 #0284c7,
                      0 2px 0 #0369a1,
                      0 3px 0 #075985,
                      0 6px 16px rgba(0, 102, 204, 0.25),
                      0 12px 24px rgba(0, 0, 0, 0.15)
                    `
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: stage4Floating && !prefersReducedMotion ? 'rotateX(4deg) rotateY(-2deg)' : 'none',
              }}
            >
              Creatiq
            </h1>

            {/* Stage 3: Luminous Light Sweep Across Logo (4-6s) */}
            {stage3Sweep && !prefersReducedMotion && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
                aria-hidden="true"
              >
                <div
                  className="w-full h-full animate-creatiq-sweep"
                  style={{
                    background: `linear-gradient(110deg, transparent 20%, ${glowColor} 45%, rgba(255,255,255,0.7) 50%, ${glowColor} 55%, transparent 80%)`,
                    filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                  }}
                />
              </div>
            )}
          </div>

          {/* Tagline Reveal (Stage 5: 8-9s) */}
          <div className="mt-4 sm:mt-6 text-center space-y-2 max-w-md mx-auto px-4">
            <div
              className={`transition-all duration-700 ${
                stage5Tagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold font-mono uppercase tracking-widest shadow-sm"
                style={{
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 102, 204, 0.25)',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  color: accentColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>POWERING DIGITAL INTELLIGENCE</span>
              </div>
            </div>

            <p
              className="text-xs sm:text-sm font-medium tracking-wide transition-opacity duration-500"
              style={{ color: secondaryColor }}
            >
              Building secure network telemetry and online investigation utilities
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Progress & Diagnostic Bar (0-10s Timeline Tracker) */}
      <div className="relative w-full max-w-lg mx-auto px-6 pb-10 sm:pb-14 z-10 space-y-4">
        {/* Progress Metric & Status */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: textColor }}>
            {stage6Ready ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <span className="inline-block w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
            )}
            <span>{currentStatusText}</span>
          </span>
          <span className="font-bold tabular-nums" style={{ color: secondaryColor }}>
            {progressPercent}%
          </span>
        </div>

        {/* 10-Second High Precision Progress Bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 relative border border-black/5 dark:border-white/5"
        >
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear relative"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: stage6Ready ? '#10b981' : accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          >
            {/* Shimmer on progress bar */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
              />
            )}
          </div>
        </div>

        {/* Dynamic Timeline Indicator Dots (0s - 2s - 4s - 6s - 8s - 10s) */}
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 dark:text-neutral-500 pt-1">
          <span className={seconds >= 0 ? 'text-black dark:text-white font-bold' : ''}>Start</span>
          <span className={seconds >= 2 ? 'text-black dark:text-white font-bold' : ''}>3D Depth</span>
          <span className={seconds >= 4 ? 'text-black dark:text-white font-bold' : ''}>Optics</span>
          <span className={seconds >= 6 ? 'text-black dark:text-white font-bold' : ''}>Security</span>
          <span className={seconds >= 8 ? 'text-black dark:text-white font-bold' : ''}>Intelligence</span>
          <span className={seconds >= 10 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>NETWHO</span>
        </div>
      </div>

      {/* Embedded CSS Keyframes for High-Performance Hardware-Accelerated 3D & Transitions */}
      <style>{`
        @keyframes creatiq-in {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes creatiq-sweep {
          0% {
            transform: translateX(-120%) skewX(-20deg);
          }
          50%, 100% {
            transform: translateX(120%) skewX(-20deg);
          }
        }

        @keyframes creatiq-float {
          0%, 100% {
            transform: translateY(0px) rotateX(2deg) rotateY(-1deg);
          }
          50% {
            transform: translateY(-8px) rotateX(4deg) rotateY(1deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-creatiq-in {
          animation: creatiq-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-creatiq-sweep {
          animation: creatiq-sweep 3s ease-in-out infinite;
        }

        .animate-creatiq-float {
          animation: creatiq-float 4.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }

        /* Full support for prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-creatiq-in,
          .animate-creatiq-sweep,
          .animate-creatiq-float,
          .animate-shimmer,
          .animate-pulse,
          .animate-ping {
            animation: none !important;
            transition-duration: 0.1s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
