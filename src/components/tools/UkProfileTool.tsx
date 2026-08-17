import React, { useState, useEffect, useMemo } from 'react';
import { UKProfile, NavTab } from '../../types';
import { getSavedProfiles, saveProfile, deleteProfile } from '../../utils/storage';
import { RandomGeneratorView } from '../RandomGeneratorView';
import { CreateProfileView } from '../CreateProfileView';
import { ProfileLibraryView } from '../ProfileLibraryView';
import { ComparisonView } from '../ComparisonView';
import { ProfileDetailModal } from '../ProfileDetailModal';
import { Dices, UserPlus, FolderOpen, Scale, Sparkles, Shield } from 'lucide-react';

interface UkProfileToolProps {
  initialSubTab?: 'generator' | 'create' | 'library' | 'comparison';
}

export const UkProfileTool: React.FC<UkProfileToolProps> = ({
  initialSubTab = 'generator',
}) => {
  const [subTab, setSubTab] = useState<'generator' | 'create' | 'library' | 'comparison'>(initialSubTab);
  const [savedProfiles, setSavedProfiles] = useState<UKProfile[]>([]);
  const [comparisonProfiles, setComparisonProfiles] = useState<UKProfile[]>([]);
  const [viewingProfile, setViewingProfile] = useState<UKProfile | null>(null);

  useEffect(() => {
    const loaded = getSavedProfiles();
    setSavedProfiles(loaded);
    if (loaded.length >= 2) {
      setComparisonProfiles([loaded[0], loaded[1]]);
    } else if (loaded.length === 1) {
      setComparisonProfiles([loaded[0]]);
    }
  }, []);

  const refreshSavedProfiles = () => {
    const loaded = getSavedProfiles();
    setSavedProfiles(loaded);
  };

  const handleSaveProfile = (profile: UKProfile) => {
    const success = saveProfile(profile);
    if (success) {
      refreshSavedProfiles();
    }
  };

  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
    refreshSavedProfiles();
    setComparisonProfiles((prev) => prev.filter((p) => p.id !== id));
    if (viewingProfile?.id === id) {
      setViewingProfile(null);
    }
  };

  const handleAddToComparison = (profile: UKProfile) => {
    if (comparisonProfiles.some((p) => p.id === profile.id)) {
      return;
    }
    if (comparisonProfiles.length >= 3) {
      alert('Maximum of 3 profiles can be compared simultaneously.');
      return;
    }
    setComparisonProfiles((prev) => [...prev, profile]);
  };

  const handleRemoveFromComparison = (id: string) => {
    setComparisonProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearComparison = () => {
    setComparisonProfiles([]);
  };

  const handleBatchCompare = (profiles: UKProfile[]) => {
    setComparisonProfiles(profiles.slice(0, 3));
    setSubTab('comparison');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savedProfileIds = useMemo(
    () => new Set(savedProfiles.map((p) => p.id)),
    [savedProfiles]
  );
  const comparisonProfileIds = useMemo(
    () => new Set(comparisonProfiles.map((p) => p.id)),
    [comparisonProfiles]
  );

  return (
    <div id="uk-profile-tool-container" className="space-y-8">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-4 bg-white">
        <button
          onClick={() => setSubTab('generator')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 flex items-center gap-2 ${
            subTab === 'generator'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Profile Generator</span>
        </button>

        <button
          onClick={() => setSubTab('create')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 flex items-center gap-2 ${
            subTab === 'create'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Build Custom Profile</span>
        </button>

        <button
          onClick={() => setSubTab('library')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 flex items-center gap-2 ${
            subTab === 'library'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Saved Library ({savedProfiles.length})</span>
        </button>

        <button
          onClick={() => setSubTab('comparison')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 flex items-center gap-2 ${
            subTab === 'comparison'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Side-by-Side Compare ({comparisonProfiles.length})</span>
        </button>
      </div>

      {/* Sub-Views */}
      <div>
        {subTab === 'generator' && (
          <RandomGeneratorView
            onSaveProfile={handleSaveProfile}
            onCompareProfile={handleAddToComparison}
            savedProfileIds={savedProfileIds}
            comparisonProfileIds={comparisonProfileIds}
            onNavigateToLibrary={() => setSubTab('library')}
            onNavigateToComparison={() => setSubTab('comparison')}
          />
        )}

        {subTab === 'create' && (
          <CreateProfileView
            onSaveProfile={handleSaveProfile}
            onCancel={() => setSubTab('library')}
          />
        )}

        {subTab === 'library' && (
          <ProfileLibraryView
            profiles={savedProfiles}
            onDeleteProfile={handleDeleteProfile}
            onViewProfile={(p) => setViewingProfile(p)}
            onCompareProfile={handleAddToComparison}
            onBatchCompare={handleBatchCompare}
            comparisonProfileIds={comparisonProfileIds}
            onNavigateToGenerator={() => setSubTab('generator')}
          />
        )}

        {subTab === 'comparison' && (
          <ComparisonView
            comparisonProfiles={comparisonProfiles}
            allSavedProfiles={savedProfiles}
            onRemoveFromComparison={handleRemoveFromComparison}
            onAddToComparison={handleAddToComparison}
            onClearComparison={handleClearComparison}
            onNavigateToGenerator={() => setSubTab('generator')}
          />
        )}
      </div>

      {/* Profile Detail Inspection Modal */}
      <ProfileDetailModal
        profile={viewingProfile}
        onClose={() => setViewingProfile(null)}
        onSave={handleSaveProfile}
        onDelete={handleDeleteProfile}
        onCompare={handleAddToComparison}
        isSaved={viewingProfile ? savedProfileIds.has(viewingProfile.id) : false}
        isInComparison={viewingProfile ? comparisonProfileIds.has(viewingProfile.id) : false}
      />
    </div>
  );
};
