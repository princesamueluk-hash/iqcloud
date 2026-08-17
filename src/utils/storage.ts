import { UKProfile } from '../types';

const STORAGE_KEY = 'uk_survey_sample_profiles_v1';

export function getSavedProfiles(): UKProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed 4 initial diverse sample profiles for immediate exploration
      const initialSeed = seedDefaultProfiles();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to load profiles from localStorage', e);
    return [];
  }
}

export function saveProfile(profile: UKProfile): boolean {
  try {
    const profiles = getSavedProfiles();
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      profiles.unshift(profile);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
    return false;
  }
}

export function deleteProfile(id: string): boolean {
  try {
    const profiles = getSavedProfiles();
    const filtered = profiles.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete profile', e);
    return false;
  }
}

export function clearAllProfiles(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear profiles', e);
    return false;
  }
}

export function exportProfilesJSON(): string {
  const profiles = getSavedProfiles();
  return JSON.stringify(profiles, null, 2);
}

export function importProfilesJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: 'File must contain an array of sample profiles.' };
    }

    const validProfiles: UKProfile[] = [];
    for (const item of parsed) {
      if (item && item.id && item.firstName && item.lastName && item.region) {
        if (!item.ukCountry) {
          if (item.region.includes('Scotland')) item.ukCountry = 'Scotland';
          else if (item.region.includes('Wales')) item.ukCountry = 'Wales';
          else if (item.region.includes('Northern Ireland')) item.ukCountry = 'Northern Ireland';
          else item.ukCountry = 'England';
        }
        validProfiles.push(item);
      }
    }

    if (validProfiles.length === 0) {
      return { success: false, count: 0, error: 'No valid UK profile records found in file.' };
    }

    const current = getSavedProfiles();
    const combinedMap = new Map<string, UKProfile>();
    // Add current
    current.forEach((p) => combinedMap.set(p.id, p));
    // Overwrite / add imported
    validProfiles.forEach((p) => combinedMap.set(p.id, p));

    const updated = Array.from(combinedMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return { success: true, count: validProfiles.length };
  } catch (e) {
    return { success: false, count: 0, error: 'Invalid JSON format. Please verify the file.' };
  }
}

export function seedDefaultProfiles(): UKProfile[] {
  const seed: UKProfile[] = [
    {
      id: 'UKP-8F4K29',
      createdAt: new Date().toISOString(),
      firstName: 'Eleanor',
      lastName: 'Davies',
      gender: 'Female',
      age: 34,
      ageGroup: '31–35',
      profileType: 'Full-time employed',
      dateOfBirth: '1992-04-14',
      maritalStatus: 'Married',
      country: 'United Kingdom',
      ukCountry: 'England',
      region: 'Greater Manchester',
      city: 'Manchester',
      samplePostcode: 'M1 1AA',
      housingType: 'Semi-Detached House',
      employmentStatus: 'Full-time employed',
      jobCategory: 'Technical & Skilled',
      jobTitle: 'Senior Software Engineer',
      industry: 'Technology & Software',
      companyName: 'Meridian Digital Labs Ltd',
      companySize: '50–249 (Medium)',
      educationLevel: 'Undergraduate Degree (BSc/BA)',
      workingArrangement: 'Hybrid (2-3 days remote)',
      incomeRange: '£60,000–£74,999',
      householdSize: 3,
      numberOfChildren: 1,
      homeOwnership: 'Own with mortgage',
      smartphoneBrand: 'Apple',
      operatingSystem: 'iOS',
      primaryDevice: 'Laptop',
      internetProvider: 'BT Broadband',
      streamingServices: ['Netflix', 'BBC iPlayer', 'Disney+'],
      socialMedia: ['LinkedIn', 'Instagram', 'X (Twitter)'],
      interests: ['Technology', 'Hiking & Outdoors', 'Reading', 'Cooking', 'Travel'],
    },
    {
      id: 'UKP-3M9X12',
      createdAt: new Date().toISOString(),
      firstName: 'Harry',
      lastName: 'Wilson',
      gender: 'Male',
      age: 48,
      ageGroup: '46–50',
      profileType: 'Full-time employed',
      dateOfBirth: '1978-09-22',
      maritalStatus: 'Married',
      country: 'United Kingdom',
      ukCountry: 'England',
      region: 'West Midlands',
      city: 'Birmingham',
      samplePostcode: 'B1 1BB',
      housingType: 'Detached House',
      employmentStatus: 'Full-time employed',
      jobCategory: 'Technical & Skilled',
      jobTitle: 'Production Operations Manager',
      industry: 'Engineering & Manufacturing',
      companyName: 'Vanguard Precision Works Ltd',
      companySize: '250–999 (Large)',
      educationLevel: 'Vocational / Apprenticeship',
      workingArrangement: 'On-site / Office',
      incomeRange: '£50,000–£59,999',
      householdSize: 4,
      numberOfChildren: 2,
      homeOwnership: 'Own with mortgage',
      smartphoneBrand: 'Samsung',
      operatingSystem: 'Android',
      primaryDevice: 'Smartphone',
      internetProvider: 'Virgin Media',
      streamingServices: ['Amazon Prime Video', 'NOW', 'BBC iPlayer'],
      socialMedia: ['Facebook', 'YouTube', 'LinkedIn'],
      interests: ['Football', 'Cars', 'Home Improvement', 'Gardening', 'Fitness'],
    },
    {
      id: 'UKP-7K2V50',
      createdAt: new Date().toISOString(),
      firstName: 'Amelia',
      lastName: 'Taylor',
      gender: 'Female',
      age: 22,
      ageGroup: '21–25',
      profileType: 'Student',
      dateOfBirth: '2004-11-03',
      maritalStatus: 'Single',
      country: 'United Kingdom',
      ukCountry: 'England',
      region: 'Greater London',
      city: 'London (Camden)',
      samplePostcode: 'NW1 2DB',
      housingType: 'Flat / Apartment',
      employmentStatus: 'Student',
      jobCategory: 'Professional & Office',
      jobTitle: 'Undergraduate Student',
      industry: 'Education & Academia',
      companyName: 'University College London',
      companySize: '1,000+ (Enterprise)',
      educationLevel: 'Further Education (A-Levels/BTEC)',
      workingArrangement: 'Not Applicable',
      incomeRange: 'Under £20,000',
      householdSize: 2,
      numberOfChildren: 0,
      homeOwnership: 'Private rental',
      smartphoneBrand: 'Apple',
      operatingSystem: 'iOS',
      primaryDevice: 'Laptop',
      internetProvider: 'Sky Broadband',
      streamingServices: ['Netflix', 'Disney+', 'Channel 4 (All4)'],
      socialMedia: ['TikTok', 'Instagram', 'Snapchat', 'Pinterest'],
      interests: ['Movies', 'Fashion', 'Music', 'Photography', 'Gaming'],
    },
    {
      id: 'UKP-5P8R74',
      createdAt: new Date().toISOString(),
      firstName: 'David',
      lastName: 'MacDonald',
      gender: 'Male',
      age: 71,
      ageGroup: '66+',
      profileType: 'Retired',
      dateOfBirth: '1955-02-18',
      maritalStatus: 'Widowed',
      country: 'United Kingdom',
      ukCountry: 'Scotland',
      region: 'Scotland (Central Belt)',
      city: 'Edinburgh',
      samplePostcode: 'EH1 3YZ',
      housingType: 'Bungalow',
      employmentStatus: 'Retired',
      jobCategory: 'Professional & Office',
      jobTitle: 'Retired (Former Chartered Accountant)',
      industry: 'Financial Services & Banking',
      companyName: 'Not Applicable (Retired)',
      companySize: '1–9 (Micro)',
      educationLevel: 'Postgraduate Degree (MSc/MA)',
      workingArrangement: 'Not Applicable',
      incomeRange: '£30,000–£39,999',
      householdSize: 1,
      numberOfChildren: 0,
      homeOwnership: 'Own home outright',
      smartphoneBrand: 'Samsung',
      operatingSystem: 'Android',
      primaryDevice: 'Tablet',
      internetProvider: 'BT Broadband',
      streamingServices: ['BBC iPlayer', 'ITVX', 'Amazon Prime Video'],
      socialMedia: ['Facebook'],
      interests: ['Reading', 'Gardening', 'Finance', 'Hiking & Outdoors'],
    },
  ];
  return seed;
}
