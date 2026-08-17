export type Gender = 'Male' | 'Female';

export type UKCountry = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';

export type JobCategory =
  | 'Technology & IT'
  | 'Healthcare & Social Care'
  | 'Finance & Accounting'
  | 'Engineering & Manufacturing'
  | 'Creative, Media & Marketing'
  | 'Business & Administration'
  | 'Education & Academia'
  | 'Retail & Hospitality'
  | 'Trades & Construction'
  | 'Professional & Office'
  | 'Technical & Skilled'
  | 'Service & Operations';

export type AgeGroup =
  | '17'
  | '18–20'
  | '21–25'
  | '26–30'
  | '31–35'
  | '36–40'
  | '41–45'
  | '46–50'
  | '51–55'
  | '56–60'
  | '61–65'
  | '66+';

export type ProfileType =
  | 'Student'
  | 'Unemployed'
  | 'Full-time employed'
  | 'Part-time employed'
  | 'Self-employed'
  | 'Freelancer'
  | 'Retired';

export type MaritalStatus =
  | 'Single'
  | 'Married'
  | 'Civil Partnership'
  | 'Divorced'
  | 'Widowed'
  | 'Co-habiting';

export type HousingType =
  | 'Detached House'
  | 'Semi-Detached House'
  | 'Terraced House'
  | 'Flat / Apartment'
  | 'Bungalow'
  | 'Maisonette';

export type HomeOwnership =
  | 'Own home outright'
  | 'Own with mortgage'
  | 'Private rental'
  | 'Social housing'
  | 'Living with family'
  | 'Other';

export type EmploymentStatus =
  | 'Full-time employed'
  | 'Part-time employed'
  | 'Self-employed'
  | 'Freelancer'
  | 'Student'
  | 'Retired'
  | 'Unemployed';

export type CompanySize =
  | '1–9 (Micro)'
  | '10–49 (Small)'
  | '50–249 (Medium)'
  | '250–999 (Large)'
  | '1,000+ (Enterprise)'
  | 'Self-employed / Solo'
  | 'Not Applicable';

export type EducationLevel =
  | 'Secondary Education (GCSE/O-Levels)'
  | 'Further Education (A-Levels/BTEC)'
  | 'Undergraduate Degree (BSc/BA)'
  | 'Postgraduate Degree (MSc/MA)'
  | 'Doctorate (PhD)'
  | 'Vocational / Apprenticeship'
  | 'No Formal Qualifications';

export type WorkingArrangement =
  | 'On-site / Office'
  | 'Hybrid (2-3 days remote)'
  | 'Fully Remote'
  | 'Field-based / Mobile'
  | 'Not Applicable';

export type IncomeRange =
  | 'Under £20,000'
  | '£20,000–£29,999'
  | '£30,000–£39,999'
  | '£40,000–£49,999'
  | '£50,000–£59,999'
  | '£60,000–£74,999'
  | '£75,000–£99,999'
  | '£100,000+';

export type SmartphoneBrand = 'Apple' | 'Samsung' | 'Google' | 'Xiaomi' | 'Other';

export type OperatingSystem = 'iOS' | 'Android' | 'Windows' | 'macOS';

export type PrimaryDevice = 'Smartphone' | 'Laptop' | 'Desktop' | 'Tablet';

export interface UKProfile {
  id: string; // e.g. UKP-8F4K29
  createdAt: string; // ISO date
  updatedAt?: string;

  // A. Personal Information
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  ageGroup: AgeGroup;
  dateOfBirth: string; // YYYY-MM-DD
  maritalStatus: MaritalStatus;

  // B. Location
  country: string; // e.g. "United Kingdom" or "United Kingdom (England)"
  ukCountry: UKCountry;
  region: string;
  city: string;
  samplePostcode: string; // e.g. "M1 1AA"
  housingType: HousingType;

  // C. Employment & Education
  profileType: ProfileType;
  employmentStatus: EmploymentStatus;
  jobCategory?: JobCategory;
  jobType?: string;
  jobTitle: string;
  industry: string;
  companyName: string;
  companySize: CompanySize;
  educationLevel: EducationLevel;
  workingArrangement: WorkingArrangement;

  // D. Household
  householdSize: number;
  numberOfChildren: number;
  homeOwnership: HomeOwnership;

  // E. Household Income
  incomeRange: IncomeRange;

  // F. Technology
  smartphoneBrand: SmartphoneBrand;
  operatingSystem: OperatingSystem;
  primaryDevice: PrimaryDevice;
  internetProvider: string;
  streamingServices: string[];
  socialMedia: string[];

  // G. Interests & Lifestyle
  interests: string[];

  // Metadata / Notes
  notes?: string;
}

export type NavTab =
  | 'dashboard'
  | 'create'
  | 'generator'
  | 'library'
  | 'comparison'
  | 'settings';


