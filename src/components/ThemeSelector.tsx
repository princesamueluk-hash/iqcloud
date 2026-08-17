import React, { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { ThemeMode, THEME_OPTIONS } from '../theme';

interface ThemeSelectorProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onThemeChange, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`theme-selector ${compact ? 'compact' : ''}`}>
      <button
        type="button"
        aria-label="Change appearance"
        title="Change appearance"
        onClick={() => setIsOpen((open) => !open)}
        className="appearance-toggle"
      >
        <Palette className="w-4 h-4" />
        {!compact && <span>Appearance</span>}
      </button>

      {isOpen && (
        <div className="theme-popover" role="dialog" aria-label="Appearance settings">
          <div className="theme-popover-header">Appearance</div>

          {THEME_OPTIONS.map((option) => {
            const active = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onThemeChange(option.value);
                  setIsOpen(false);
                }}
                className={`theme-option-entry ${active ? 'selected' : ''}`}
                aria-pressed={active}
              >
                <div className="theme-option-main">
                  <span className="theme-option-icon" aria-hidden="true">{option.icon}</span>
                  <div className="theme-option-copy">
                    <span className="theme-option-label">{option.label} Mode</span>
                    <span className="theme-option-description">{option.description}</span>
                  </div>
                </div>

                {active && (
                  <span className="theme-option-active">
                    <Check className="w-3.5 h-3.5" />
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
