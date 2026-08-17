import React, { useState } from 'react';
import { UKProfile } from '../types';
import { formatProfileAsText } from '../utils/generator';
import {
  Copy,
  Check,
  BookmarkPlus,
  Trash2,
  FileCode2,
  Scale,
  User,
  MapPin,
  Briefcase,
  Home,
  PoundSterling,
  Smartphone,
  Tv,
  Sparkles,
} from 'lucide-react';

interface ProfileCardProps {
  profile: UKProfile;
  onSave?: (profile: UKProfile) => void;
  onDelete?: (id: string) => void;
  onCompare?: (profile: UKProfile) => void;
  isSaved?: boolean;
  isInComparison?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSave,
  onDelete,
  onCompare,
  isSaved = false,
  isInComparison = false,
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'json' | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleCopyText = async () => {
    try {
      const text = formatProfileAsText(profile);
      await navigator.clipboard.writeText(text);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyJson = async () => {
    try {
      const json = JSON.stringify(profile, null, 2);
      await navigator.clipboard.writeText(json);
      setCopiedType('json');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy JSON', err);
    }
  };

  return (
    <article
      id={`profile-card-${profile.id}`}
      className="bg-white border-2 border-black p-6 sm:p-8 lg:p-10 select-text shadow-sm"
    >
      {/* Top Bar: Profile ID, Status Badges & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-5 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-semibold">
            ID
          </span>
          <span className="font-mono text-sm sm:text-base font-bold bg-black text-white px-3 py-1">
            {profile.id}
          </span>
          {isSaved && (
            <span className="font-mono text-xs uppercase px-2.5 py-1 bg-neutral-100 text-black border border-neutral-400 font-semibold">
              Saved in Library
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onSave && !isSaved && (
            <button
              id={`save-btn-${profile.id}`}
              onClick={() => onSave(profile)}
              className="border-2 border-black bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5 text-black"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}

          {onCompare && (
            <button
              id={`compare-btn-${profile.id}`}
              onClick={() => onCompare(profile)}
              className={`border-2 border-black px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                isInComparison
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-100 text-black'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isInComparison ? 'In Comparison' : 'Compare'}</span>
            </button>
          )}

          <button
            id={`copy-text-btn-${profile.id}`}
            onClick={handleCopyText}
            className="border-2 border-black bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5 text-black"
          >
            {copiedType === 'text' ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Profile</span>
              </>
            )}
          </button>

          <button
            id={`toggle-json-btn-${profile.id}`}
            onClick={() => setShowJson(!showJson)}
            className={`border-2 border-black px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              showJson
                ? 'bg-neutral-900 text-white'
                : 'bg-white hover:bg-neutral-100 text-black'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>JSON</span>
          </button>

          {onDelete && (
            <button
              id={`delete-btn-${profile.id}`}
              onClick={() => onDelete(profile.id)}
              className="border-2 border-red-700 bg-white text-red-700 px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* JSON Viewer Modal / Section */}
      {showJson && (
        <div className="mt-6 p-4 sm:p-6 bg-neutral-950 text-white font-mono text-xs sm:text-sm border-2 border-black overflow-x-auto">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-800">
            <span className="font-semibold text-neutral-300">Profile JSON Record</span>
            <button
              onClick={handleCopyJson}
              className="text-xs text-white border border-neutral-600 px-3 py-1 hover:bg-neutral-800 font-bold uppercase cursor-pointer"
            >
              {copiedType === 'json' ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="leading-relaxed whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {/* Hero Record Summary: Name, Gender, Age, Profile Type */}
      <div className="mt-6 pb-6 border-b border-neutral-300">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-base sm:text-lg text-neutral-800 font-semibold mt-1">
              {profile.jobTitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-black text-white px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider">
              {profile.profileType}
            </span>
            <span className="bg-neutral-100 text-black border border-neutral-400 px-3 py-1.5 text-xs sm:text-sm font-semibold">
              {profile.gender}
            </span>
            <span className="bg-neutral-100 text-black border border-neutral-400 px-3 py-1.5 text-xs sm:text-sm font-semibold">
              {profile.age} years old ({profile.ageGroup})
            </span>
            <span className="bg-neutral-100 text-black border border-neutral-400 px-3 py-1.5 text-xs sm:text-sm font-semibold">
              {profile.ukCountry || 'United Kingdom'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Structured Sections */}
      <div className="mt-8 space-y-8 divide-y divide-neutral-200">
        {/* 1. Personal Information */}
        <section className="pt-6 first:pt-0">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              1. Personal Information
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <p className="text-base font-semibold text-black">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Gender
              </span>
              <p className="text-base font-semibold text-black">{profile.gender}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Age
              </span>
              <p className="text-base font-semibold text-black">
                {profile.age} years ({profile.ageGroup})
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Date of Birth
              </span>
              <p className="text-base font-semibold text-black font-mono">
                {profile.dateOfBirth}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Marital Status
              </span>
              <p className="text-base font-semibold text-black">
                {profile.maritalStatus}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Location */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              2. Location
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Country
              </span>
              <p className="text-base font-semibold text-black">{profile.country}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                UK Country
              </span>
              <p className="text-base font-semibold text-black">{profile.ukCountry || 'England'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Region
              </span>
              <p className="text-base font-semibold text-black">{profile.region}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                City / Town
              </span>
              <p className="text-base font-semibold text-black">{profile.city}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Postcode Prefix
              </span>
              <p className="text-base font-semibold text-black font-mono">
                {profile.samplePostcode}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Housing Type
              </span>
              <p className="text-base font-semibold text-black">{profile.housingType}</p>
            </div>
          </div>
        </section>

        {/* 3. Employment & Education */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              3. Employment & Education
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Employment Status / Profile Type
              </span>
              <p className="text-base font-semibold text-black">
                {profile.employmentStatus || profile.profileType}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Job Category
              </span>
              <p className="text-base font-semibold text-black">
                {profile.jobCategory || 'General'}
              </p>
            </div>
            {profile.jobType && (
              <div>
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                  Specialisation / Type
                </span>
                <p className="text-base font-semibold text-black">
                  {profile.jobType}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Job Title
              </span>
              <p className="text-base font-semibold text-black">{profile.jobTitle}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Industry
              </span>
              <p className="text-base font-semibold text-black">{profile.industry}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Employer / Organization
              </span>
              <p className="text-base font-semibold text-black">
                {profile.companyName}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Company Size
              </span>
              <p className="text-base font-semibold text-black">
                {profile.companySize}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Education Level
              </span>
              <p className="text-base font-semibold text-black">
                {profile.educationLevel}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Working Arrangement
              </span>
              <p className="text-base font-semibold text-black">
                {profile.workingArrangement}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Household */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              4. Household
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Household Size
              </span>
              <p className="text-base font-semibold text-black">
                {profile.householdSize} person
                {profile.householdSize > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Number of Children
              </span>
              <p className="text-base font-semibold text-black">
                {profile.numberOfChildren}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Home Ownership
              </span>
              <p className="text-base font-semibold text-black">
                {profile.homeOwnership}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Household Income */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <PoundSterling className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              5. Household Income
            </h4>
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
              Estimated Income Range
            </span>
            <p className="text-xl font-bold text-black">
              {profile.incomeRange}
            </p>
          </div>
        </section>

        {/* 6. Technology */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              6. Technology
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Smartphone
              </span>
              <p className="text-base font-semibold text-black">
                {profile.smartphoneBrand}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Operating System
              </span>
              <p className="text-base font-semibold text-black">
                {profile.operatingSystem}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Primary Device
              </span>
              <p className="text-base font-semibold text-black">
                {profile.primaryDevice}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
                Internet Provider
              </span>
              <p className="text-base font-semibold text-black">
                {profile.internetProvider}
              </p>
            </div>
          </div>
        </section>

        {/* 7. Digital Services */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              7. Digital Services
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-2">
                Streaming Services
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.streamingServices.map((service) => (
                  <span
                    key={service}
                    className="bg-neutral-100 border border-neutral-400 text-black px-3 py-1 text-xs sm:text-sm font-semibold"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-2">
                Social Media Platforms
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.socialMedia.map((platform) => (
                  <span
                    key={platform}
                    className="bg-neutral-100 border border-neutral-400 text-black px-3 py-1 text-xs sm:text-sm font-semibold"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Interests & Lifestyle */}
        <section className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-black" />
            <h4 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              8. Interests & Lifestyle
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="bg-black text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold tracking-wide"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Card Footer */}
      <footer className="mt-8 pt-6 border-t-2 border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-neutral-600 font-mono gap-2">
        <div className="font-semibold text-neutral-800">A Creatiq Product • UK Profile</div>
        <div>
          Recorded: {new Date(profile.createdAt).toLocaleDateString('en-GB')}
        </div>
      </footer>
    </article>
  );
};
