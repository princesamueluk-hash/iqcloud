import React, { useState } from 'react';
import {
  UKProfile,
  Gender,
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
  ProfileType,
  UKCountry,
  JobCategory,
} from '../types';
import {
  UK_REGIONS,
  UK_COUNTRIES,
  HOUSING_TYPES,
  HOME_OWNERSHIP,
  MARITAL_STATUSES,
  EDUCATION_LEVELS,
  WORKING_ARRANGEMENTS,
  COMPANY_SIZES,
  UK_JOB_CATEGORIES_DATA,
  JOB_CATEGORIES_LIST,
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
  generateProfileId,
  generateDateOfBirthForAge,
  generateRandomUKProfile,
  getAgeGroupForAge,
  generateUKPostcode,
} from '../utils/generator';
import {
  Save,
  Dices,
  Check,
  AlertCircle,
} from 'lucide-react';

interface CreateProfileViewProps {
  onSaveProfile: (profile: UKProfile) => void;
  onCancel: () => void;
}

export const CreateProfileView: React.FC<CreateProfileViewProps> = ({
  onSaveProfile,
  onCancel,
}) => {
  // Form State
  const [profileId] = useState<string>(() => generateProfileId());
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Female');
  const [age, setAge] = useState<number>(30);
  const [dateOfBirth, setDateOfBirth] = useState<string>(() => generateDateOfBirthForAge(30));
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Single');

  // Location
  const [ukCountry, setUkCountry] = useState<UKCountry>('England');
  const [region, setRegion] = useState<string>('Greater London');
  const [city, setCity] = useState<string>('London (Westminster)');
  const [samplePostcode, setSamplePostcode] = useState<string>('SW1A 1AA');
  const [housingType, setHousingType] = useState<HousingType>('Flat / Apartment');

  // Employment & Education
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('Full-time employed');
  const [jobCategory, setJobCategory] = useState<JobCategory>('Professional & Office');
  const [industry, setIndustry] = useState<string>('Technology & Software');
  const [jobTitle, setJobTitle] = useState<string>('Software Engineer');
  const [companyName, setCompanyName] = useState<string>('Meridian Digital Labs Ltd');
  const [companySize, setCompanySize] = useState<CompanySize>('50–249 (Medium)');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate Degree (BSc/BA)');
  const [workingArrangement, setWorkingArrangement] = useState<WorkingArrangement>('Hybrid (2-3 days remote)');

  // Household
  const [householdSize, setHouseholdSize] = useState<number>(2);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [homeOwnership, setHomeOwnership] = useState<HomeOwnership>('Private rental');

  // Income
  const [incomeRange, setIncomeRange] = useState<IncomeRange>('£50,000–£59,999');

  // Tech & Media
  const [smartphoneBrand, setSmartphoneBrand] = useState<SmartphoneBrand>('Apple');
  const [operatingSystem, setOperatingSystem] = useState<OperatingSystem>('iOS');
  const [primaryDevice, setPrimaryDevice] = useState<PrimaryDevice>('Laptop');
  const [internetProvider, setInternetProvider] = useState<string>('BT Broadband');
  const [streamingServices, setStreamingServices] = useState<string[]>(['Netflix', 'BBC iPlayer']);
  const [socialMedia, setSocialMedia] = useState<string[]>(['LinkedIn', 'Instagram']);
  const [interests, setInterests] = useState<string[]>(['Technology', 'Travel', 'Reading']);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Available regions based on chosen constituent UK Country
  const eligibleRegions = UK_REGIONS.filter((r) => r.ukCountry === ukCountry);
  const currentRegionData = eligibleRegions.find((r) => r.region === region) || eligibleRegions[0] || UK_REGIONS[0];
  const availableCities = currentRegionData ? currentRegionData.cities : [];

  const handleCountryChange = (newCountry: UKCountry) => {
    setUkCountry(newCountry);
    const newRegions = UK_REGIONS.filter((r) => r.ukCountry === newCountry);
    if (newRegions.length > 0) {
      const firstReg = newRegions[0];
      setRegion(firstReg.region);
      setCity(firstReg.cities[0]);
      setSamplePostcode(generateUKPostcode(firstReg.postcodePrefixes[0]));
    }
  };

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const regData = UK_REGIONS.find((r) => r.region === newRegion);
    if (regData) {
      setCity(regData.cities[0]);
      setSamplePostcode(generateUKPostcode(regData.postcodePrefixes[0]));
    }
  };

  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    setDateOfBirth(generateDateOfBirthForAge(newAge));
  };

  const toggleStreaming = (service: string) => {
    if (streamingServices.includes(service)) {
      setStreamingServices(streamingServices.filter((s) => s !== service));
    } else {
      setStreamingServices([...streamingServices, service]);
    }
  };

  const toggleSocial = (platform: string) => {
    if (socialMedia.includes(platform)) {
      setSocialMedia(socialMedia.filter((s) => s !== platform));
    } else {
      setSocialMedia([...socialMedia, platform]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleAutofillRandom = () => {
    const random = generateRandomUKProfile();
    setFirstName(random.firstName);
    setLastName(random.lastName);
    setGender(random.gender);
    setAge(random.age);
    setDateOfBirth(random.dateOfBirth);
    setMaritalStatus(random.maritalStatus);
    setUkCountry(random.ukCountry || 'England');
    setRegion(random.region);
    setCity(random.city);
    setSamplePostcode(random.samplePostcode);
    setHousingType(random.housingType);
    setEmploymentStatus(random.employmentStatus);
    if (random.jobCategory) setJobCategory(random.jobCategory);
    setIndustry(random.industry);
    setJobTitle(random.jobTitle);
    setCompanyName(random.companyName);
    setCompanySize(random.companySize);
    setEducationLevel(random.educationLevel);
    setWorkingArrangement(random.workingArrangement);
    setHouseholdSize(random.householdSize);
    setNumberOfChildren(random.numberOfChildren);
    setHomeOwnership(random.homeOwnership);
    setIncomeRange(random.incomeRange);
    setSmartphoneBrand(random.smartphoneBrand);
    setOperatingSystem(random.operatingSystem);
    setPrimaryDevice(random.primaryDevice);
    setInternetProvider(random.internetProvider);
    setStreamingServices(random.streamingServices);
    setSocialMedia(random.socialMedia);
    setInterests(random.interests);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both a First Name and Last Name.');
      return;
    }

    if (interests.length === 0) {
      setErrorMessage('Please select at least 1 interest.');
      return;
    }

    let derivedProfileType: ProfileType = 'Full-time employed';
    if (employmentStatus === 'Retired') derivedProfileType = 'Retired';
    else if (employmentStatus === 'Student') derivedProfileType = 'Student';
    else if (employmentStatus === 'Unemployed') derivedProfileType = 'Unemployed';
    else if (employmentStatus === 'Self-employed') derivedProfileType = 'Self-employed';
    else if (employmentStatus === 'Freelancer') derivedProfileType = 'Freelancer';
    else if (employmentStatus === 'Part-time employed') derivedProfileType = 'Part-time employed';

    const newProfile: UKProfile = {
      id: profileId,
      createdAt: new Date().toISOString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      age: Number(age),
      ageGroup: getAgeGroupForAge(Number(age)),
      profileType: derivedProfileType,
      dateOfBirth,
      maritalStatus,
      country: 'United Kingdom',
      ukCountry,
      region,
      city,
      samplePostcode: samplePostcode.trim(),
      housingType,
      employmentStatus,
      jobCategory,
      jobTitle: jobTitle.trim() || 'Professional',
      industry,
      companyName: companyName.trim() || 'UK Enterprise Ltd',
      companySize,
      educationLevel,
      workingArrangement,
      householdSize: Number(householdSize),
      numberOfChildren: Number(numberOfChildren),
      homeOwnership,
      incomeRange,
      smartphoneBrand,
      operatingSystem,
      primaryDevice,
      internetProvider,
      streamingServices,
      socialMedia,
      interests,
    };

    onSaveProfile(newProfile);
    setSuccessMessage(`Profile ${profileId} saved to library successfully!`);
    setTimeout(() => {
      onCancel();
    }, 1200);
  };

  return (
    <div id="create-profile-page" className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <header className="border-b-2 border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-600 mb-2 font-mono font-semibold">
            <span>02</span>
            <span>/</span>
            <span>Build Profile</span>
            <span>•</span>
            <span className="text-black font-bold">A Creatiq Product</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Build Profile
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mt-2 leading-relaxed">
            Construct and define custom UK profiles across demographics, employment, household, and lifestyle dimensions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillRandom}
          className="bg-white text-black px-5 py-3 text-sm font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer flex items-center space-x-2 self-start sm:self-auto"
        >
          <Dices className="w-4 h-4" />
          <span>Autofill Form</span>
        </button>
      </header>

      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-700 text-red-900 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-black text-white text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-white shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* A. Personal Demographics */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              1. Personal Demographics
            </h2>
            <span className="font-mono text-xs sm:text-sm font-bold bg-black text-white px-2.5 py-0.5">
              {profileId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                First Name *
              </label>
              <input
                id="input-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Fiona"
                required
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Last Name *
              </label>
              <input
                id="input-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Campbell"
                required
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                id="select-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Age: <span className="font-mono text-black font-bold">{age}</span>
              </label>
              <input
                id="input-age"
                type="number"
                min={17}
                max={90}
                value={age}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Date of Birth
              </label>
              <input
                id="input-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Marital Status
              </label>
              <select
                id="select-marital"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {MARITAL_STATUSES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* B. Location & Housing */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              2. Location & Housing
            </h2>
            <span className="font-mono text-sm font-bold text-neutral-800">Country: United Kingdom</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                UK Country
              </label>
              <select
                id="select-uk-country"
                value={ukCountry}
                onChange={(e) => handleCountryChange(e.target.value as UKCountry)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {UK_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Region
              </label>
              <select
                id="select-region"
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {eligibleRegions.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                City / Town
              </label>
              <select
                id="select-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Postcode Prefix
              </label>
              <input
                id="input-postcode"
                type="text"
                value={samplePostcode}
                onChange={(e) => setSamplePostcode(e.target.value)}
                placeholder="e.g. M1 1AA"
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-mono font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Housing Type
              </label>
              <select
                id="select-housing"
                value={housingType}
                onChange={(e) => setHousingType(e.target.value as HousingType)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {HOUSING_TYPES.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* C. Employment & Education */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              3. Employment & Education
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Employment Status
              </label>
              <select
                id="select-emp-status"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                <option value="Full-time employed">Full-time employed</option>
                <option value="Part-time employed">Part-time employed</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Job Category
              </label>
              <select
                id="select-job-category"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value as JobCategory)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {JOB_CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Job Title
              </label>
              <input
                id="input-job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Project Manager"
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Industry
              </label>
              <select
                id="select-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {UK_JOB_CATEGORIES_DATA.map((item) => (
                  <option key={item.industry} value={item.industry}>
                    {item.industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Employer / Company
              </label>
              <input
                id="input-company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Meridian Labs Ltd"
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Company Size
              </label>
              <select
                id="select-company-size"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {COMPANY_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Education Level
              </label>
              <select
                id="select-education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {EDUCATION_LEVELS.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Working Arrangement
              </label>
              <select
                id="select-working-arr"
                value={workingArrangement}
                onChange={(e) => setWorkingArrangement(e.target.value as WorkingArrangement)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {WORKING_ARRANGEMENTS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* D. Household & E. Income */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              4 & 5. Household & Income
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Household Size
              </label>
              <input
                id="input-hh-size"
                type="number"
                min={1}
                max={10}
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Number of Children
              </label>
              <input
                id="input-children"
                type="number"
                min={0}
                max={8}
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(Number(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Home Ownership
              </label>
              <select
                id="select-ownership"
                value={homeOwnership}
                onChange={(e) => setHomeOwnership(e.target.value as HomeOwnership)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {HOME_OWNERSHIP.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Income Band
              </label>
              <select
                id="select-income"
                value={incomeRange}
                onChange={(e) => setIncomeRange(e.target.value as IncomeRange)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {INCOME_RANGES.map((inc) => (
                  <option key={inc} value={inc}>
                    {inc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* F. Technology & Media */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-6">
          <div className="border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              6 & 7. Technology & Digital Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Smartphone Brand
              </label>
              <select
                id="select-phone-brand"
                value={smartphoneBrand}
                onChange={(e) => setSmartphoneBrand(e.target.value as SmartphoneBrand)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {SMARTPHONE_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Operating System
              </label>
              <select
                id="select-os"
                value={operatingSystem}
                onChange={(e) => setOperatingSystem(e.target.value as OperatingSystem)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {OPERATING_SYSTEMS.map((os) => (
                  <option key={os} value={os}>
                    {os}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Primary Device
              </label>
              <select
                id="select-primary-device"
                value={primaryDevice}
                onChange={(e) => setPrimaryDevice(e.target.value as PrimaryDevice)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {PRIMARY_DEVICES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                Internet Provider
              </label>
              <select
                id="select-isp"
                value={internetProvider}
                onChange={(e) => setInternetProvider(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-black font-medium cursor-pointer"
              >
                {INTERNET_PROVIDERS.map((isp) => (
                  <option key={isp} value={isp}>
                    {isp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Streaming Services */}
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
              Streaming Services
            </label>
            <div className="flex flex-wrap gap-2">
              {STREAMING_SERVICES.map((s) => {
                const selected = streamingServices.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStreaming(s)}
                    className={`px-3.5 py-1.5 text-sm border-2 transition-colors cursor-pointer font-semibold ${
                      selected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-neutral-300 hover:border-black'
                    }`}
                  >
                    {s} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
              Social Media Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_MEDIA_PLATFORMS.map((sm) => {
                const selected = socialMedia.includes(sm);
                return (
                  <button
                    key={sm}
                    type="button"
                    onClick={() => toggleSocial(sm)}
                    className={`px-3.5 py-1.5 text-sm border-2 transition-colors cursor-pointer font-semibold ${
                      selected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-neutral-300 hover:border-black'
                    }`}
                  >
                    {sm} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* G. Interests & Lifestyle */}
        <section className="border-2 border-black p-6 sm:p-8 bg-white space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              8. Interests & Lifestyle ({interests.length} selected)
            </h2>
            <span className="text-xs text-neutral-600 font-semibold uppercase">Multi-select</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {INTERESTS_LIST.map((intItem) => {
              const selected = interests.includes(intItem);
              return (
                <button
                  key={intItem}
                  type="button"
                  onClick={() => toggleInterest(intItem)}
                  className={`px-4 py-2 text-sm border-2 transition-all cursor-pointer font-semibold ${
                    selected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-neutral-300 hover:border-black'
                  }`}
                >
                  {intItem} {selected ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 pt-4 border-t-2 border-neutral-200">
          <button
            type="button"
            id="cancel-create-btn"
            onClick={onCancel}
            className="px-6 py-3.5 bg-white text-black text-base font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="save-profile-btn"
            className="px-8 py-3.5 bg-black text-white text-base font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
