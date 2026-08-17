import React from 'react';
import { UKProfile } from '../types';
import { ProfileCard } from './ProfileCard';
import { X } from 'lucide-react';

interface ProfileDetailModalProps {
  profile: UKProfile | null;
  onClose: () => void;
  onSave?: (profile: UKProfile) => void;
  onDelete?: (id: string) => void;
  onCompare?: (profile: UKProfile) => void;
  isSaved?: boolean;
  isInComparison?: boolean;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onSave,
  onDelete,
  onCompare,
  isSaved = true,
  isInComparison = false,
}) => {
  if (!profile) return null;

  return (
    <div
      id="profile-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black max-w-4xl w-full my-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Close Bar */}
        <div className="bg-neutral-100 border-b-2 border-black px-6 py-4 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-black font-bold">
          <span>Profile Inspector / {profile.id}</span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-200 text-black border border-neutral-400 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 max-h-[85vh] overflow-y-auto">
          <ProfileCard
            profile={profile}
            onSave={onSave}
            onDelete={onDelete}
            onCompare={onCompare}
            isSaved={isSaved}
            isInComparison={isInComparison}
          />
        </div>
      </div>
    </div>
  );
};
