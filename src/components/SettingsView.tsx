import React, { useState, useRef } from 'react';
import { UKProfile } from '../types';
import {
  exportProfilesJSON,
  importProfilesJSON,
  clearAllProfiles,
  seedDefaultProfiles,
} from '../utils/storage';
import { generateRandomUKProfile } from '../utils/generator';
import {
  Download,
  Upload,
  RefreshCw,
  FileJson,
  Check,
  AlertTriangle,
  Info,
  Database,
  Palette
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { ThemeMode, THEME_OPTIONS } from '../theme';

interface SettingsViewProps {
  profiles: UKProfile[];
  onRefreshProfiles: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profiles,
  onRefreshProfiles,
  theme,
  onThemeChange,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const json = exportProfilesJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `uk-profiles-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: `Successfully exported ${profiles.length} profiles as JSON.` });
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Failed to export JSON file.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importProfilesJSON(content);
        if (result.success) {
          onRefreshProfiles();
          setStatusMessage({ type: 'success', text: `Successfully imported ${result.count} profile records.` });
        } else {
          setStatusMessage({ type: 'error', text: result.error || 'Import failed.' });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSeedBatch = () => {
    const batch: UKProfile[] = [];
    for (let i = 0; i < 8; i++) {
      batch.push(generateRandomUKProfile());
    }
    const current = [...profiles, ...batch];
    localStorage.setItem('uk_survey_sample_profiles_v1', JSON.stringify(current));
    onRefreshProfiles();
    setStatusMessage({ type: 'success', text: 'Added 8 new UK profiles to your library.' });
  };

  const handleResetDefaults = () => {
    const seed = seedDefaultProfiles();
    localStorage.setItem('uk_survey_sample_profiles_v1', JSON.stringify(seed));
    onRefreshProfiles();
    setStatusMessage({ type: 'success', text: 'Restored default benchmark profiles.' });
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved profiles from local storage?')) {
      clearAllProfiles();
      onRefreshProfiles();
      setStatusMessage({ type: 'success', text: 'All local profiles have been cleared.' });
    }
  };

  return (
    <div id="settings-page" className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <header className="border-b-2 border-black pb-6">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
          <span>06</span>
          <span>/</span>
          <span>Settings</span>
          <span>•</span>
          <span className="text-black font-bold">A Creatiq Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          Settings & Storage
        </h1>
        <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mt-2 leading-relaxed">
          Manage local datasets, export or import JSON records, and manage storage settings.
        </p>
      </header>

      {statusMessage && (
        <div
          className={`p-4 border-2 font-mono text-sm flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-black text-white border-black font-bold'
              : 'bg-red-50 text-red-900 border-red-700 font-bold'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-white shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              Appearance
            </h2>
          </div>
        </div>
        <div className="space-y-4">
          <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
          <p className="text-sm text-neutral-700 leading-relaxed">
            Choose your preferred NETWHO experience. Your selection is saved automatically and restored when you return.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onThemeChange(option.value)}
                className={`text-left border-2 p-4 transition-all ${theme === option.value ? 'border-black bg-black text-white shadow-md' : 'border-black bg-white text-black hover:bg-neutral-50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg" aria-hidden="true">{option.icon}</span>
                  <span className="text-xs font-mono uppercase tracking-[0.18em] font-bold">{option.label}</span>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${theme === option.value ? 'text-white/90' : 'text-neutral-700'}`}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Brand & Architecture */}
      <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              Product & Brand Attribution
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <div className="p-4 bg-neutral-50 border-2 border-black">
            <span className="text-xs font-mono text-neutral-600 uppercase font-bold block mb-1">Parent Platform</span>
            <p className="font-bold text-black text-base">Creatiq</p>
            <p className="text-sm text-neutral-700 mt-1">Unified digital products and tools platform.</p>
          </div>
          <div className="p-4 bg-neutral-50 border-2 border-black">
            <span className="text-xs font-mono text-neutral-600 uppercase font-bold block mb-1">Product Name</span>
            <p className="font-bold text-black text-base">UK Profile</p>
            <p className="text-sm text-neutral-700 mt-1">Structured UK profile generator and library.</p>
          </div>
        </div>
      </section>

      {/* Local Storage & Dataset Controls */}
      <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-black" />
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              Local Storage Management
            </h2>
          </div>
          <span className="font-mono text-sm font-bold text-black">
            {profiles.length} Active Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Export JSON */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Library (JSON)
              </h3>
              <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
                Download all saved profiles as a single JSON file.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer text-center"
            >
              Export JSON File
            </button>
          </div>

          {/* Import JSON */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                <Upload className="w-4 h-4" /> Import Profiles (JSON)
              </h3>
              <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
                Upload a JSON array containing previously exported UK profiles.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="import-json-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-white text-black text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer text-center"
              >
                Choose JSON File
              </button>
            </div>
          </div>

          {/* Batch Generate */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Batch Generate Profiles
              </h3>
              <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
                Automatically generate and add 8 diverse UK profiles to your library.
              </p>
            </div>
            <button
              onClick={handleSeedBatch}
              className="w-full py-3 bg-white text-black text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer text-center"
            >
              Generate 8 Profiles
            </button>
          </div>

          {/* Restore Defaults */}
          <div className="border-2 border-black p-6 bg-white flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                <FileJson className="w-4 h-4" /> Restore Default Profiles
              </h3>
              <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
                Reset your library back to the standard 4 benchmark profiles.
              </p>
            </div>
            <button
              onClick={handleResetDefaults}
              className="w-full py-3 bg-white text-black text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer text-center"
            >
              Restore Defaults
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t-2 border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-black uppercase tracking-wide">Clear All Stored Profiles</h4>
            <p className="text-sm text-neutral-700 mt-0.5">
              Permanently delete all saved profiles from this browser session.
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="px-6 py-3 bg-white hover:bg-red-50 text-red-700 font-bold uppercase text-sm border-2 border-red-700 transition-colors cursor-pointer"
          >
            Clear Data
          </button>
        </div>
      </section>
    </div>
  );
};
