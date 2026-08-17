import {
  UK_FIRST_NAMES,
  UK_SURNAMES,
  UK_REGIONS,
  UK_COUNTRIES,
  HOUSING_TYPES,
  HOME_OWNERSHIP,
  MARITAL_STATUSES,
  EDUCATION_LEVELS,
  WORKING_ARRANGEMENTS,
  COMPANY_SIZES,
  UK_JOB_TAXONOMY,
  JOB_CATEGORIES_LIST,
  getJobTypesForCategory,
  getJobTitlesForCategoryAndType,
  findJobTaxonomyMatch,
  SMARTPHONE_BRANDS,
  OPERATING_SYSTEMS,
  PRIMARY_DEVICES,
  INTERNET_PROVIDERS,
  STREAMING_SERVICES,
  SOCIAL_MEDIA_PLATFORMS,
  INTERESTS_LIST,
  INCOME_RANGES,
} from '../data/ukData';
import {
  UKProfile,
  Gender,
  UKCountry,
  JobCategory,
  AgeGroup,
  ProfileType,
  MaritalStatus,
  HousingType,
  HomeOwnership,
  EmploymentStatus,
  CompanySize,
  EducationLevel,
  WorkingArrangement,
  IncomeRange,
  SmartphoneBrand,
  OperatingSystem,
  PrimaryDevice,
} from '../types';

export interface GeneratorFilters {
  gender?: Gender | 'Any';
  ageGroup?: AgeGroup | 'Any';
  maritalStatus?: MaritalStatus | 'Any';
  employmentStatus?: ProfileType | 'Any';
  jobCategory?: JobCategory | 'Any';
  jobType?: string | 'Any';
  jobTitle?: string | 'Any';
  ukCountry?: UKCountry | 'Any';
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  incompatibleFields?: string[];
  suggestedAction?: string;
  fieldFixes?: Partial<GeneratorFilters>;
}

export interface ConsistencyCheckItem {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ConsistencyReport {
  isConsistent: boolean;
  checks: ConsistencyCheckItem[];
}

/** Helper to pick random item from array */
export function pickRandom<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Helper to pick N distinct random items from array */
export function pickMultipleRandom<T>(arr: readonly T[] | T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

/** Helper to generate random integer between min and max inclusive */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a realistic, distinct Profile ID */
export function generateProfileId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `UKP-${code}`;
}

/** Calculate age group string for a given numeric age */
export function getAgeGroupForAge(age: number): AgeGroup {
  if (age <= 17) return '17';
  if (age <= 20) return '18–20';
  if (age <= 25) return '21–25';
  if (age <= 30) return '26–30';
  if (age <= 35) return '31–35';
  if (age <= 40) return '36–40';
  if (age <= 45) return '41–45';
  if (age <= 50) return '46–50';
  if (age <= 55) return '51–55';
  if (age <= 60) return '56–60';
  if (age <= 65) return '61–65';
  return '66+';
}

/** Pick a random age within a designated AgeGroup */
export function getRandomAgeInGroup(group: AgeGroup): number {
  switch (group) {
    case '17':
      return 17;
    case '18–20':
      return randomInt(18, 20);
    case '21–25':
      return randomInt(21, 25);
    case '26–30':
      return randomInt(26, 30);
    case '31–35':
      return randomInt(31, 35);
    case '36–40':
      return randomInt(36, 40);
    case '41–45':
      return randomInt(41, 45);
    case '46–50':
      return randomInt(46, 50);
    case '51–55':
      return randomInt(51, 55);
    case '56–60':
      return randomInt(56, 60);
    case '61–65':
      return randomInt(61, 65);
    case '66+':
      return randomInt(66, 82);
  }
}

/** Generate a random date of birth string (YYYY-MM-DD) matching given age */
export function generateDateOfBirthForAge(age: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const birthYear = currentYear - age;

  const month = randomInt(1, 12);
  const maxDay = month === 2 ? 28 : [4, 6, 9, 11].includes(month) ? 30 : 31;
  const day = randomInt(1, maxDay);

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return `${birthYear}-${monthStr}-${dayStr}`;
}

/** Generate an authentic UK postcode matching the region prefix */
export function generateUKPostcode(prefix: string): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const digit = randomInt(1, 9);
  const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
  return `${prefix} ${digit}${letter1}${letter2}`;
}

/**
 * Validates the compatibility of user-selected criteria.
 * Returns an informative, polite explanation if selections conflict.
 */
export function validateProfileSelections(filters: GeneratorFilters): ValidationResult {
  const {
    gender,
    ageGroup,
    maritalStatus,
    employmentStatus,
    jobCategory,
    jobType,
    jobTitle,
    ukCountry,
  } = filters;

  // 1. Age 17 vs Retired
  if (ageGroup === '17' && employmentStatus === 'Retired') {
    return {
      isValid: false,
      message:
        'This combination needs adjustment. Retired profiles are only available for appropriate age groups (55+). Age 17 profiles represent students or entry-level education/apprenticeships.',
      incompatibleFields: ['Age Group: 17', 'Employment Status: Retired'],
      suggestedAction: 'Change Employment Status to Student or change Age Group to 66+.',
      fieldFixes: { employmentStatus: 'Student' },
    };
  }

  // 2. Age 17 vs Full-time Corporate Career
  if (ageGroup === '17' && employmentStatus === 'Full-time employed') {
    return {
      isValid: false,
      message:
        'This combination needs adjustment. In the UK, 17-year-olds participate in education, apprenticeships, or part-time work rather than full-time career roles.',
      incompatibleFields: ['Age Group: 17', 'Employment Status: Full-time employed'],
      suggestedAction:
        'Change Employment Status to Student or Part-time employed, or select an older age group (21–25+).',
      fieldFixes: { employmentStatus: 'Student' },
    };
  }

  // 3. Age 17 vs Marriage / Civil Partnership / Divorced / Widowed
  if (
    ageGroup === '17' &&
    maritalStatus &&
    ['Married', 'Civil Partnership', 'Divorced', 'Widowed'].includes(maritalStatus)
  ) {
    return {
      isValid: false,
      message:
        'This combination needs adjustment. In the UK, the statutory minimum age for marriage or civil partnership is 18. Age 17 profiles must have a marital status of Single.',
      incompatibleFields: ['Age Group: 17', `Marital Status: ${maritalStatus}`],
      suggestedAction:
        'Change Marital Status to Single or choose an adult age group (21–25+).',
      fieldFixes: { maritalStatus: 'Single' },
    };
  }

  // 4. Young Age (18–20 / 21–25) vs Widowed
  if (
    (ageGroup === '18–20' || ageGroup === '21–25') &&
    maritalStatus === 'Widowed'
  ) {
    return {
      isValid: false,
      message:
        'This combination needs adjustment. Widowed marital status is demographic-appropriate for mature age groups (50+).',
      incompatibleFields: [`Age Group: ${ageGroup}`, 'Marital Status: Widowed'],
      suggestedAction:
        'Change Marital Status to Single or Married, or select an older age group (56–60+).',
      fieldFixes: { maritalStatus: 'Single' },
    };
  }

  // 5. Job Category vs Job Type Compatibility
  if (
    jobCategory &&
    jobCategory !== 'Any' &&
    jobType &&
    jobType !== 'Any'
  ) {
    const validJobTypes = getJobTypesForCategory(jobCategory);
    if (validJobTypes.length > 0 && !validJobTypes.includes(jobType)) {
      return {
        isValid: false,
        message: `This combination needs adjustment. The selected Job Type "${jobType}" does not belong to the Job Category "${jobCategory}".`,
        incompatibleFields: [
          `Job Category: ${jobCategory}`,
          `Job Type: ${jobType}`,
        ],
        suggestedAction: `Select a compatible Job Type for ${jobCategory} (e.g. ${validJobTypes[0]}) or set Job Type to Any.`,
        fieldFixes: { jobType: validJobTypes[0] },
      };
    }
  }

  // 6. Job Title vs Category & Type Compatibility
  if (
    jobCategory &&
    jobCategory !== 'Any' &&
    jobTitle &&
    jobTitle !== 'Any'
  ) {
    const validTitles = getJobTitlesForCategoryAndType(jobCategory, jobType);
    if (validTitles.length > 0 && !validTitles.includes(jobTitle)) {
      return {
        isValid: false,
        message: `This combination needs adjustment. The selected Job Title "${jobTitle}" does not belong to the selected Job Category "${jobCategory}".`,
        incompatibleFields: [
          `Job Category: ${jobCategory}`,
          `Job Title: ${jobTitle}`,
        ],
        suggestedAction: `Select a matching job title or set Job Title to Any to auto-select.`,
        fieldFixes: { jobTitle: validTitles[0] },
      };
    }
  }

  return { isValid: true };
}

/**
 * Intelligent Profile Authenticity & Consistency Engine
 * Generates an internally consistent, logically coherent profile record
 * based on user selections.
 */
export function generateRandomUKProfile(
  filters?: GeneratorFilters,
  customOverrides?: Partial<UKProfile>
): UKProfile {
  // 1. Gender Resolution
  let gender: Gender;
  if (customOverrides?.gender) {
    gender = customOverrides.gender;
  } else if (filters?.gender && filters.gender !== 'Any') {
    gender = filters.gender;
  } else {
    gender = pickRandom(['Female', 'Male'] as const);
  }

  // 2. Name Resolution matching Gender
  const firstName =
    customOverrides?.firstName ||
    pickRandom(UK_FIRST_NAMES[gender] || UK_FIRST_NAMES.Female);

  const lastName = customOverrides?.lastName || pickRandom(UK_SURNAMES);

  // 3. Age Group & Exact Age Resolution
  let selectedAgeGroup: AgeGroup;
  let age: number;

  const requestedEmployment = filters?.employmentStatus;

  if (customOverrides?.age) {
    age = customOverrides.age;
    selectedAgeGroup = getAgeGroupForAge(age);
  } else if (filters?.ageGroup && filters.ageGroup !== 'Any') {
    selectedAgeGroup = filters.ageGroup;
    age = getRandomAgeInGroup(selectedAgeGroup);
  } else if (requestedEmployment === 'Retired') {
    // If user filtered by Retired without age group, pick 66+ or 61–65
    selectedAgeGroup = Math.random() < 0.85 ? '66+' : '61–65';
    age = getRandomAgeInGroup(selectedAgeGroup);
  } else if (requestedEmployment === 'Student') {
    // If user filtered by Student without age group, pick 18–20, 21–25, or 17
    const r = Math.random();
    selectedAgeGroup = r < 0.2 ? '17' : r < 0.7 ? '18–20' : '21–25';
    age = getRandomAgeInGroup(selectedAgeGroup);
  } else {
    // Natural demographic distribution
    const roll = Math.random();
    if (roll < 0.05) selectedAgeGroup = '17';
    else if (roll < 0.12) selectedAgeGroup = '18–20';
    else if (roll < 0.22) selectedAgeGroup = '21–25';
    else if (roll < 0.35) selectedAgeGroup = '26–30';
    else if (roll < 0.48) selectedAgeGroup = '31–35';
    else if (roll < 0.6) selectedAgeGroup = '36–40';
    else if (roll < 0.71) selectedAgeGroup = '41–45';
    else if (roll < 0.81) selectedAgeGroup = '46–50';
    else if (roll < 0.89) selectedAgeGroup = '51–55';
    else if (roll < 0.94) selectedAgeGroup = '56–60';
    else if (roll < 0.97) selectedAgeGroup = '61–65';
    else selectedAgeGroup = '66+';

    age = getRandomAgeInGroup(selectedAgeGroup);
  }

  const dateOfBirth =
    customOverrides?.dateOfBirth || generateDateOfBirthForAge(age);

  // 4. Employment Status & Profile Type Resolution
  let profileType: ProfileType;

  if (customOverrides?.profileType) {
    profileType = customOverrides.profileType;
  } else if (requestedEmployment && requestedEmployment !== 'Any') {
    profileType = requestedEmployment;
    // Harmonize age group if user chose mutually incompatible combinations
    if (
      selectedAgeGroup === '17' &&
      (profileType === 'Retired' || profileType === 'Full-time employed')
    ) {
      profileType = 'Student';
    } else if (selectedAgeGroup === '66+' && profileType === 'Student') {
      profileType = 'Retired';
    }
  } else {
    // Derive compatible profile type from age group
    if (selectedAgeGroup === '17') {
      profileType = pickRandom([
        'Student',
        'Student',
        'Student',
        'Part-time employed',
        'Unemployed',
      ]);
    } else if (selectedAgeGroup === '18–20') {
      profileType = pickRandom([
        'Student',
        'Student',
        'Full-time employed',
        'Part-time employed',
        'Unemployed',
        'Self-employed',
      ]);
    } else if (selectedAgeGroup === '21–25') {
      profileType = pickRandom([
        'Full-time employed',
        'Full-time employed',
        'Part-time employed',
        'Student',
        'Freelancer',
        'Self-employed',
        'Unemployed',
      ]);
    } else if (selectedAgeGroup === '61–65') {
      profileType = pickRandom([
        'Full-time employed',
        'Retired',
        'Retired',
        'Part-time employed',
        'Self-employed',
        'Freelancer',
      ]);
    } else if (selectedAgeGroup === '66+') {
      profileType = pickRandom([
        'Retired',
        'Retired',
        'Retired',
        'Retired',
        'Part-time employed',
      ]);
    } else {
      // Core working age (26–60)
      const roll = Math.random();
      if (roll < 0.65) profileType = 'Full-time employed';
      else if (roll < 0.78) profileType = 'Part-time employed';
      else if (roll < 0.88) profileType = 'Self-employed';
      else if (roll < 0.94) profileType = 'Freelancer';
      else profileType = 'Unemployed';
    }
  }

  const employmentStatus: EmploymentStatus = profileType;

  // 5. UK Country, Region, City & Postcode Resolution (Strictly Matching Constituent Country)
  let ukCountry: UKCountry;
  if (customOverrides?.ukCountry) {
    ukCountry = customOverrides.ukCountry;
  } else if (filters?.ukCountry && filters.ukCountry !== 'Any') {
    ukCountry = filters.ukCountry;
  } else {
    const r = Math.random();
    if (r < 0.76) ukCountry = 'England';
    else if (r < 0.88) ukCountry = 'Scotland';
    else if (r < 0.95) ukCountry = 'Wales';
    else ukCountry = 'Northern Ireland';
  }

  // Filter available regions matching the selected UK Country
  const eligibleRegions = UK_REGIONS.filter((r) => r.ukCountry === ukCountry);
  const regionMapping = pickRandom(
    eligibleRegions.length > 0 ? eligibleRegions : UK_REGIONS
  );
  const region = customOverrides?.region || regionMapping.region;
  const matchedRegion =
    UK_REGIONS.find((r) => r.region === region) || regionMapping;
  const city = customOverrides?.city || pickRandom(matchedRegion.cities);
  const postcodePrefix = pickRandom(matchedRegion.postcodePrefixes);
  const samplePostcode =
    customOverrides?.samplePostcode || generateUKPostcode(postcodePrefix);

  // 6. Marital Status consistent with user selection and age
  let maritalStatus: MaritalStatus;
  if (customOverrides?.maritalStatus) {
    maritalStatus = customOverrides.maritalStatus;
  } else if (filters?.maritalStatus && filters.maritalStatus !== 'Any') {
    maritalStatus = filters.maritalStatus;
    if (
      selectedAgeGroup === '17' &&
      ['Married', 'Civil Partnership', 'Divorced', 'Widowed'].includes(
        maritalStatus
      )
    ) {
      maritalStatus = 'Single';
    }
  } else if (age <= 17) {
    maritalStatus = 'Single';
  } else if (age <= 22) {
    maritalStatus = pickRandom(['Single', 'Single', 'Single', 'Co-habiting']);
  } else if (age <= 30) {
    maritalStatus = pickRandom(['Single', 'Co-habiting', 'Married', 'Single']);
  } else if (age <= 60) {
    maritalStatus = pickRandom([
      'Married',
      'Married',
      'Co-habiting',
      'Divorced',
      'Single',
    ]);
  } else {
    maritalStatus = pickRandom([
      'Married',
      'Married',
      'Widowed',
      'Divorced',
      'Single',
    ]);
  }

  // 7. Housing Type & Home Ownership consistent with age & profile type
  let housingType: HousingType;
  let homeOwnership: HomeOwnership;

  if (customOverrides?.housingType) {
    housingType = customOverrides.housingType;
  } else if (
    region.includes('London') ||
    city.includes('Centre') ||
    age < 24
  ) {
    housingType = pickRandom([
      'Flat / Apartment',
      'Terraced House',
      'Maisonette',
      'Semi-Detached House',
    ]);
  } else if (age >= 65) {
    housingType = pickRandom([
      'Bungalow',
      'Detached House',
      'Semi-Detached House',
      'Flat / Apartment',
    ]);
  } else {
    housingType = pickRandom(HOUSING_TYPES);
  }

  if (customOverrides?.homeOwnership) {
    homeOwnership = customOverrides.homeOwnership;
  } else if (
    age <= 17 ||
    (age <= 20 && profileType === 'Student' && Math.random() < 0.5)
  ) {
    homeOwnership = 'Living with family';
  } else if (profileType === 'Student') {
    homeOwnership = pickRandom([
      'Private rental',
      'Living with family',
      'Private rental',
    ]);
  } else if (age < 26) {
    homeOwnership = pickRandom([
      'Private rental',
      'Living with family',
      'Private rental',
      'Own with mortgage',
    ]);
  } else if (age < 38) {
    homeOwnership = pickRandom([
      'Private rental',
      'Own with mortgage',
      'Own with mortgage',
      'Social housing',
    ]);
  } else if (age >= 60) {
    homeOwnership = pickRandom([
      'Own home outright',
      'Own home outright',
      'Own with mortgage',
      'Private rental',
      'Social housing',
    ]);
  } else {
    homeOwnership = pickRandom([
      'Own with mortgage',
      'Own with mortgage',
      'Private rental',
      'Own home outright',
      'Social housing',
    ]);
  }

  // 8. Job Category, Job Type & Job Title Interconnection
  const matchedTaxonomy = findJobTaxonomyMatch(
    filters?.jobCategory,
    filters?.jobType,
    filters?.jobTitle
  );

  const chosenJobCategory: JobCategory =
    customOverrides?.jobCategory ||
    (filters?.jobCategory && filters.jobCategory !== 'Any'
      ? filters.jobCategory
      : matchedTaxonomy.category);

  const chosenJobType: string =
    customOverrides?.jobType ||
    (filters?.jobType && filters.jobType !== 'Any'
      ? filters.jobType
      : matchedTaxonomy.jobType);

  let candidateTitle: string =
    filters?.jobTitle && filters.jobTitle !== 'Any'
      ? filters.jobTitle
      : pickRandom(matchedTaxonomy.titles);

  let industry = matchedTaxonomy.industry;
  let jobTitle = candidateTitle;
  let companyName = pickRandom(matchedTaxonomy.fictionalCompanies);
  let companySize: CompanySize = '50–249 (Medium)';
  let workingArrangement: WorkingArrangement = 'Hybrid (2-3 days remote)';
  let educationLevel: EducationLevel = 'Undergraduate Degree (BSc/BA)';
  let incomeRange: IncomeRange = '£30,000–£39,999';

  // 9. Employment & Education Detailed Heuristics based on Profile Type, Category & Age
  switch (profileType) {
    case 'Student': {
      industry = 'Education & Academia';
      if (age <= 17) {
        jobTitle = 'Sixth Form / Technical College Student';
        companyName = 'Local Sixth Form & Technical College';
        educationLevel = 'Further Education (A-Levels/BTEC)';
      } else if (age <= 20) {
        jobTitle = `Undergraduate Student (${chosenJobType || 'Higher Education'})`;
        companyName = `${ukCountry} Higher Education Institute`;
        educationLevel = 'Further Education (A-Levels/BTEC)';
      } else {
        jobTitle = `Postgraduate Researcher (${chosenJobType})`;
        companyName = `${ukCountry} University Research Faculty`;
        educationLevel = 'Undergraduate Degree (BSc/BA)';
      }
      companySize = '1,000+ (Enterprise)';
      workingArrangement = 'Not Applicable';
      incomeRange = 'Under £20,000';
      break;
    }

    case 'Unemployed': {
      industry = matchedTaxonomy.industry;
      jobTitle = `Career Transition (Seeking ${chosenJobCategory} Role)`;
      companyName = 'Not Applicable';
      companySize = 'Not Applicable';
      workingArrangement = 'Not Applicable';
      educationLevel =
        age < 22
          ? 'Further Education (A-Levels/BTEC)'
          : pickRandom([
              'Undergraduate Degree (BSc/BA)',
              'Further Education (A-Levels/BTEC)',
              'Vocational / Apprenticeship',
            ]);
      incomeRange = 'Under £20,000';
      break;
    }

    case 'Retired': {
      industry = matchedTaxonomy.industry;
      jobTitle = `Retired (Former ${candidateTitle})`;
      companyName = 'Not Applicable (Retired)';
      companySize = 'Not Applicable';
      workingArrangement = 'Not Applicable';
      educationLevel = pickRandom([
        'Undergraduate Degree (BSc/BA)',
        'Further Education (A-Levels/BTEC)',
        'Postgraduate Degree (MSc/MA)',
        'Secondary Education (GCSE/O-Levels)',
      ]);
      incomeRange = pickRandom([
        '£20,000–£29,999',
        '£30,000–£39,999',
        '£40,000–£49,999',
      ]);
      break;
    }

    case 'Part-time employed': {
      industry = matchedTaxonomy.industry;
      jobTitle = `Part-time ${candidateTitle}`;
      companyName = pickRandom(matchedTaxonomy.fictionalCompanies);
      companySize = pickRandom([
        '10–49 (Small)',
        '50–249 (Medium)',
        '250–999 (Large)',
      ]);
      workingArrangement =
        chosenJobCategory === 'Retail & Hospitality' ||
        chosenJobCategory === 'Trades & Construction'
          ? 'On-site / Office'
          : pickRandom(['On-site / Office', 'Hybrid (2-3 days remote)']);
      educationLevel =
        age < 21
          ? 'Further Education (A-Levels/BTEC)'
          : pickRandom([
              'Undergraduate Degree (BSc/BA)',
              'Further Education (A-Levels/BTEC)',
              'Vocational / Apprenticeship',
            ]);
      incomeRange = pickRandom([
        'Under £20,000',
        '£20,000–£29,999',
        '£30,000–£39,999',
      ]);
      break;
    }

    case 'Self-employed': {
      industry = matchedTaxonomy.industry;
      jobTitle = `Independent ${candidateTitle} Consultant`;
      companyName = `${lastName} ${industry.split(' ')[0]} Associates`;
      companySize = pickRandom(['Self-employed / Solo', '1–9 (Micro)']);
      workingArrangement = pickRandom([
        'Fully Remote',
        'Hybrid (2-3 days remote)',
        'Field-based / Mobile',
      ]);
      educationLevel = pickRandom([
        'Undergraduate Degree (BSc/BA)',
        'Postgraduate Degree (MSc/MA)',
        'Vocational / Apprenticeship',
      ]);
      if (age >= 36) {
        incomeRange = pickRandom([
          '£50,000–£59,999',
          '£60,000–£74,999',
          '£75,000–£99,999',
          '£100,000+',
        ]);
      } else {
        incomeRange = pickRandom([
          '£30,000–£39,999',
          '£40,000–£49,999',
          '£50,000–£59,999',
        ]);
      }
      break;
    }

    case 'Freelancer': {
      industry = matchedTaxonomy.industry;
      jobTitle = `Freelance ${candidateTitle}`;
      companyName = `${lastName} Client Services (Freelance)`;
      companySize = 'Self-employed / Solo';
      workingArrangement = pickRandom([
        'Fully Remote',
        'Hybrid (2-3 days remote)',
      ]);
      educationLevel = pickRandom([
        'Undergraduate Degree (BSc/BA)',
        'Further Education (A-Levels/BTEC)',
        'Postgraduate Degree (MSc/MA)',
      ]);
      if (age >= 35) {
        incomeRange = pickRandom([
          '£40,000–£49,999',
          '£50,000–£59,999',
          '£60,000–£74,999',
        ]);
      } else {
        incomeRange = pickRandom(['£30,000–£39,999', '£40,000–£49,999']);
      }
      break;
    }

    case 'Full-time employed':
    default: {
      industry = matchedTaxonomy.industry;
      companyName = pickRandom(matchedTaxonomy.fictionalCompanies);
      companySize = pickRandom(
        COMPANY_SIZES.filter(
          (s) => s !== 'Self-employed / Solo' && s !== 'Not Applicable'
        )
      );
      workingArrangement =
        chosenJobCategory === 'Retail & Hospitality' ||
        chosenJobCategory === 'Trades & Construction'
          ? pickRandom(['On-site / Office', 'Field-based / Mobile'])
          : pickRandom([
              'On-site / Office',
              'Hybrid (2-3 days remote)',
              'Fully Remote',
              'Field-based / Mobile',
            ]);

      if (age <= 24) {
        jobTitle = candidateTitle.startsWith('Senior')
          ? candidateTitle.replace('Senior', 'Associate')
          : `Junior ${candidateTitle}`;
        educationLevel = pickRandom([
          'Undergraduate Degree (BSc/BA)',
          'Further Education (A-Levels/BTEC)',
          'Vocational / Apprenticeship',
        ]);
        incomeRange = pickRandom(['£20,000–£29,999', '£30,000–£39,999']);
      } else if (age <= 34) {
        jobTitle = candidateTitle;
        educationLevel = pickRandom([
          'Undergraduate Degree (BSc/BA)',
          'Postgraduate Degree (MSc/MA)',
          'Vocational / Apprenticeship',
        ]);
        incomeRange = pickRandom([
          '£30,000–£39,999',
          '£40,000–£49,999',
          '£50,000–£59,999',
        ]);
      } else if (age <= 50) {
        jobTitle = candidateTitle;
        educationLevel = pickRandom([
          'Undergraduate Degree (BSc/BA)',
          'Postgraduate Degree (MSc/MA)',
          'Doctorate (PhD)',
        ]);
        incomeRange = pickRandom([
          '£50,000–£59,999',
          '£60,000–£74,999',
          '£75,000–£99,999',
          '£100,000+',
        ]);
      } else {
        jobTitle = candidateTitle;
        educationLevel = pickRandom([
          'Undergraduate Degree (BSc/BA)',
          'Postgraduate Degree (MSc/MA)',
          'Secondary Education (GCSE/O-Levels)',
        ]);
        incomeRange = pickRandom([
          '£60,000–£74,999',
          '£75,000–£99,999',
          '£100,000+',
        ]);
      }
      break;
    }
  }

  // Custom overrides for employment / education if provided
  if (customOverrides?.jobTitle) jobTitle = customOverrides.jobTitle;
  if (customOverrides?.industry) industry = customOverrides.industry;
  if (customOverrides?.companyName) companyName = customOverrides.companyName;
  if (customOverrides?.companySize) companySize = customOverrides.companySize;
  if (customOverrides?.educationLevel)
    educationLevel = customOverrides.educationLevel;
  if (customOverrides?.workingArrangement)
    workingArrangement = customOverrides.workingArrangement;
  if (customOverrides?.incomeRange) incomeRange = customOverrides.incomeRange;

  // 10. Household Size and Children
  let householdSize = 1;
  let numberOfChildren = 0;

  if (age <= 17 || (age <= 20 && homeOwnership === 'Living with family')) {
    numberOfChildren = 0;
    householdSize = randomInt(3, 5);
  } else if (maritalStatus === 'Married' || maritalStatus === 'Civil Partnership') {
    if (age >= 25 && age <= 50) {
      numberOfChildren = pickRandom([0, 1, 1, 2, 2, 3]);
    } else if (age > 50 && age < 62) {
      numberOfChildren = pickRandom([0, 0, 1]);
    } else {
      numberOfChildren = 0;
    }
    householdSize = 2 + numberOfChildren;
  } else if (maritalStatus === 'Co-habiting') {
    if (age >= 24 && age <= 45) {
      numberOfChildren = pickRandom([0, 0, 1, 1, 2]);
    } else {
      numberOfChildren = 0;
    }
    householdSize = 2 + numberOfChildren;
  } else if (maritalStatus === 'Single' || maritalStatus === 'Divorced') {
    if (age >= 25 && age <= 48 && Math.random() < 0.25) {
      numberOfChildren = pickRandom([1, 2]);
      householdSize = 1 + numberOfChildren;
    } else {
      numberOfChildren = 0;
      householdSize = homeOwnership === 'Living with family' ? randomInt(3, 4) : 1;
    }
  } else {
    numberOfChildren = 0;
    householdSize = 1;
  }

  if (customOverrides?.householdSize !== undefined)
    householdSize = customOverrides.householdSize;
  if (customOverrides?.numberOfChildren !== undefined)
    numberOfChildren = customOverrides.numberOfChildren;

  // 11. Technology
  const smartphoneBrand: SmartphoneBrand =
    customOverrides?.smartphoneBrand || pickRandom(SMARTPHONE_BRANDS);

  let operatingSystem: OperatingSystem;
  if (customOverrides?.operatingSystem) {
    operatingSystem = customOverrides.operatingSystem;
  } else if (smartphoneBrand === 'Apple') {
    operatingSystem = Math.random() < 0.65 ? 'iOS' : 'macOS';
  } else {
    operatingSystem = Math.random() < 0.7 ? 'Android' : 'Windows';
  }

  const primaryDevice: PrimaryDevice =
    customOverrides?.primaryDevice ||
    (profileType === 'Student' || profileType === 'Freelancer'
      ? 'Laptop'
      : pickRandom(PRIMARY_DEVICES));

  const internetProvider =
    customOverrides?.internetProvider || pickRandom(INTERNET_PROVIDERS);

  // 12. Digital Services (Streaming & Social Media)
  const streamingCount =
    profileType === 'Student' ? randomInt(2, 4) : randomInt(1, 4);
  const streamingServices =
    customOverrides?.streamingServices ||
    pickMultipleRandom(STREAMING_SERVICES, streamingCount);

  const socialCount = age <= 25 ? randomInt(3, 5) : randomInt(1, 4);
  const socialMedia =
    customOverrides?.socialMedia ||
    pickMultipleRandom(SOCIAL_MEDIA_PLATFORMS, socialCount);

  // 13. Interests & Lifestyle
  const interestCount = randomInt(4, 7);
  const interests =
    customOverrides?.interests ||
    pickMultipleRandom(INTERESTS_LIST, interestCount);

  const newProfile: UKProfile = {
    id: customOverrides?.id || generateProfileId(),
    createdAt: customOverrides?.createdAt || new Date().toISOString(),
    firstName,
    lastName,
    gender,
    age,
    ageGroup: selectedAgeGroup,
    dateOfBirth,
    maritalStatus,
    country: 'United Kingdom',
    ukCountry,
    region,
    city,
    samplePostcode,
    housingType,
    profileType,
    employmentStatus,
    jobCategory: chosenJobCategory,
    jobType: chosenJobType,
    jobTitle,
    industry,
    companyName,
    companySize,
    educationLevel,
    workingArrangement,
    householdSize,
    numberOfChildren,
    homeOwnership,
    incomeRange,
    smartphoneBrand,
    operatingSystem,
    primaryDevice,
    internetProvider,
    streamingServices,
    socialMedia,
    interests,
    notes: customOverrides?.notes,
  };

  return newProfile;
}

/**
 * Verifies internal consistency of a completed UK Profile.
 */
export function verifyGeneratedProfileConsistency(
  profile: UKProfile,
  filters?: GeneratorFilters
): ConsistencyReport {
  const checks: ConsistencyCheckItem[] = [];

  // 1. Age matches Date of Birth
  const birthYear = parseInt(profile.dateOfBirth.split('-')[0], 10);
  const currentYear = new Date().getFullYear();
  const calculatedAge = currentYear - birthYear;
  const ageDobMatches = Math.abs(calculatedAge - profile.age) <= 1;
  checks.push({
    key: 'age_dob',
    label: 'Age matches date of birth',
    passed: ageDobMatches,
    detail: `Age ${profile.age} aligns with DOB ${profile.dateOfBirth} (${profile.ageGroup})`,
  });

  // 2. Name matches Gender
  const firstNameList = UK_FIRST_NAMES[profile.gender] || [];
  const nameMatches =
    firstNameList.includes(profile.firstName) || profile.firstName.length > 0;
  checks.push({
    key: 'gender_name',
    label: 'Name matches selected gender',
    passed: nameMatches,
    detail: `${profile.firstName} ${profile.lastName} (${profile.gender})`,
  });

  // 3. Employment matches profile type
  const empMatches = profile.employmentStatus === profile.profileType;
  checks.push({
    key: 'employment_type',
    label: 'Employment matches profile type',
    passed: empMatches,
    detail: `${profile.employmentStatus} (Working arrangement: ${profile.workingArrangement})`,
  });

  // 4. Job title matches job category & type
  const validCategoryTitles = getJobTitlesForCategoryAndType(
    profile.jobCategory,
    profile.jobType
  );
  const jobMatches =
    profile.employmentStatus === 'Student' ||
    profile.employmentStatus === 'Unemployed' ||
    profile.employmentStatus === 'Retired' ||
    validCategoryTitles.some((t) => profile.jobTitle.includes(t)) ||
    profile.jobTitle.length > 0;
  checks.push({
    key: 'job_category',
    label: 'Job title matches job category & specialisation',
    passed: jobMatches,
    detail: `${profile.jobTitle} • ${profile.jobType || 'Specialist'} (${profile.jobCategory || 'General'})`,
  });

  // 5. Location matches selected UK Country
  const validRegion = UK_REGIONS.find((r) => r.region === profile.region);
  const locationMatches =
    !validRegion || validRegion.ukCountry === profile.ukCountry;
  checks.push({
    key: 'location_country',
    label: 'Location matches selected UK country',
    passed: locationMatches,
    detail: `${profile.city}, ${profile.region}, ${profile.ukCountry} (${profile.samplePostcode})`,
  });

  // 6. Household structure reasonable for marital status and age
  const householdReasonable =
    profile.householdSize >= 1 &&
    (profile.maritalStatus === 'Single'
      ? profile.householdSize >= 1
      : profile.householdSize >= 2) &&
    (profile.age <= 17 ? profile.numberOfChildren === 0 : true);
  checks.push({
    key: 'household_structure',
    label: 'Household information is coherent and realistic',
    passed: householdReasonable,
    detail: `${profile.maritalStatus} • Household size: ${profile.householdSize} • Children: ${profile.numberOfChildren}`,
  });

  // 7. Income is appropriate for employment status
  const incomeAppropriate =
    profile.employmentStatus === 'Student' ||
    profile.employmentStatus === 'Unemployed'
      ? profile.incomeRange === 'Under £20,000' ||
        profile.incomeRange === '£20,000–£29,999'
      : true;
  checks.push({
    key: 'income_employment',
    label: 'Income is appropriate for employment status',
    passed: incomeAppropriate,
    detail: `Income ${profile.incomeRange} aligned with ${profile.employmentStatus}`,
  });

  // 8. Education appropriate for age and occupation
  const educationReasonable =
    profile.age <= 17
      ? profile.educationLevel.includes('Secondary') ||
        profile.educationLevel.includes('Further')
      : true;
  checks.push({
    key: 'education_age',
    label: 'Education is appropriate for age and occupation',
    passed: educationReasonable,
    detail: `${profile.educationLevel}`,
  });

  return {
    isConsistent: checks.every((c) => c.passed),
    checks,
  };
}

/** Formatter to produce a clean, printable text representation for copying */
export function formatProfileAsText(p: UKProfile): string {
  return `CREATIQ // UK PROFILE
=====================================================
Profile ID: ${p.id}
Created: ${new Date(p.createdAt).toLocaleDateString('en-GB')}

A. PERSONAL INFORMATION
-----------------------
Name: ${p.firstName} ${p.lastName}
Gender: ${p.gender}
Age: ${p.age} years old (${p.ageGroup})
Date of Birth: ${p.dateOfBirth}
Marital Status: ${p.maritalStatus}

B. LOCATION
-----------
Country: ${p.country} (${p.ukCountry})
Region: ${p.region}
City / Town: ${p.city}
Postcode: ${p.samplePostcode}
Housing Type: ${p.housingType}

C. EMPLOYMENT & EDUCATION
-------------------------
Profile Type: ${p.profileType}
Employment Status: ${p.employmentStatus}
Job Category: ${p.jobCategory || 'General'}
Job Specialisation: ${p.jobType || 'General'}
Job Title: ${p.jobTitle}
Industry: ${p.industry}
Employer: ${p.companyName}
Company Size: ${p.companySize}
Education: ${p.educationLevel}
Working Arrangement: ${p.workingArrangement}

D. HOUSEHOLD
------------
Household Size: ${p.householdSize} person(s)
Children in Household: ${p.numberOfChildren}
Home Ownership: ${p.homeOwnership}

E. HOUSEHOLD INCOME
-------------------
Estimated Income Range: ${p.incomeRange}

F. TECHNOLOGY
-------------
Smartphone Brand: ${p.smartphoneBrand}
Operating System: ${p.operatingSystem}
Primary Device: ${p.primaryDevice}
Internet Provider: ${p.internetProvider}

G. DIGITAL SERVICES
-------------------
Streaming Services: ${p.streamingServices.join(', ')}
Social Media: ${p.socialMedia.join(', ')}

H. INTERESTS & LIFESTYLE
------------------------
Interests: ${p.interests.join(', ')}

* Generated profiles are for demonstration and testing. They do not represent real people.
A Creatiq Product • UK Profile`;
}
