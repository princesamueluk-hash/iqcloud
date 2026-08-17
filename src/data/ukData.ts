import { UKCountry, JobCategory } from '../types';

export const UK_COUNTRIES: UKCountry[] = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

export const UK_FIRST_NAMES = {
  Female: [
    'Emma', 'Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Grace', 'Freya', 'Charlotte',
    'Lily', 'Sophie', 'Emily', 'Poppy', 'Ella', 'Evie', 'Jessica', 'Daisy', 'Ruby',
    'Chloe', 'Lucy', 'Zoe', 'Hannah', 'Eleanor', 'Phoebe', 'Alice', 'Harriet', 'Gemma',
    'Bethany', 'Claire', 'Victoria', 'Fiona', 'Nicola', 'Helen', 'Sarah', 'Joanne',
    'Rachel', 'Laura', 'Gillian', 'Kirsty', 'Catriona', 'Sian', 'Eilidh', 'Niamh', 'Megan', 'Imogen'
  ],
  Male: [
    'Oliver', 'George', 'Harry', 'Noah', 'Jack', 'Leo', 'Arthur', 'Muhammad', 'Oscar',
    'Charlie', 'Henry', 'Thomas', 'Freddie', 'Alfie', 'Theo', 'William', 'James', 'Joshua',
    'Alexander', 'Edward', 'Samuel', 'Daniel', 'Benjamin', 'Lucas', 'Callum', 'Liam',
    'Connor', 'Alistair', 'Duncan', 'Gareth', 'Rhys', 'Declan', 'Kieran', 'Ian', 'Colin',
    'Mark', 'Stephen', 'David', 'Andrew', 'Richard', 'Craig', 'Stuart', 'Hamish', 'Lewis', 'Rory'
  ]
};

export const UK_SURNAMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas',
  'Johnson', 'Roberts', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes',
  'Edwards', 'Green', 'Hall', 'Wood', 'Harris', 'Martin', 'Jackson', 'Clarke', 'Clark',
  'Turnbull', 'Campbell', 'Stewart', 'Patel', 'MacDonald', 'Scott', 'Reid', 'Fisher',
  'Fletcher', 'Booth', 'Gibson', 'Sinclair', 'Morrison', 'Graham', 'Khan', 'Begum',
  'Shah', 'O\'Connor', 'Murphy', 'Kelly', 'Walsh', 'MacKenzie', 'Fraser', 'Jenkins',
  'Owen', 'Price', 'Griffiths', 'Lewis', 'Morgan', 'Phillips', 'Watson', 'Barnes', 'Webb'
];

export interface RegionMapping {
  ukCountry: UKCountry;
  region: string;
  cities: string[];
  postcodePrefixes: string[];
}

export const UK_REGIONS: RegionMapping[] = [
  // --- ENGLAND ---
  {
    ukCountry: 'England',
    region: 'Greater London',
    cities: ['London (Westminster)', 'London (Camden)', 'London (Greenwich)', 'London (Croydon)', 'London (Islington)', 'London (Richmond)', 'London (Wandsworth)', 'London (Southwark)', 'London (Ealing)', 'London (Bromley)'],
    postcodePrefixes: ['SW1A', 'EC1A', 'W1D', 'N1', 'SE1', 'E1', 'NW1', 'CR0', 'BR1', 'TW9']
  },
  {
    ukCountry: 'England',
    region: 'Greater Manchester',
    cities: ['Manchester', 'Salford', 'Bolton', 'Stockport', 'Rochdale', 'Oldham', 'Bury', 'Wigan', 'Altrincham', 'Trafford'],
    postcodePrefixes: ['M1', 'M4', 'M14', 'M50', 'BL1', 'SK1', 'OL1', 'WN1', 'WA14']
  },
  {
    ukCountry: 'England',
    region: 'West Midlands',
    cities: ['Birmingham', 'Coventry', 'Wolverhampton', 'Solihull', 'Dudley', 'Walsall', 'West Bromwich', 'Sutton Coldfield'],
    postcodePrefixes: ['B1', 'B15', 'CV1', 'WV1', 'B91', 'DY1', 'WS1']
  },
  {
    ukCountry: 'England',
    region: 'West Yorkshire',
    cities: ['Leeds', 'Bradford', 'Wakefield', 'Huddersfield', 'Halifax', 'Dewsbury', 'Keighley'],
    postcodePrefixes: ['LS1', 'LS6', 'BD1', 'WF1', 'HD1', 'HX1']
  },
  {
    ukCountry: 'England',
    region: 'Merseyside',
    cities: ['Liverpool', 'St Helens', 'Southport', 'Birkenhead', 'Wallasey', 'Crosby', 'Bootle'],
    postcodePrefixes: ['L1', 'L3', 'L8', 'WA10', 'PR8', 'CH41']
  },
  {
    ukCountry: 'England',
    region: 'South Yorkshire',
    cities: ['Sheffield', 'Doncaster', 'Rotherham', 'Barnsley'],
    postcodePrefixes: ['S1', 'S10', 'DN1', 'S60', 'S70']
  },
  {
    ukCountry: 'England',
    region: 'Hampshire',
    cities: ['Southampton', 'Portsmouth', 'Winchester', 'Basingstoke', 'Andover', 'Fareham', 'Eastleigh'],
    postcodePrefixes: ['SO14', 'SO23', 'PO1', 'PO4', 'RG21', 'SP10']
  },
  {
    ukCountry: 'England',
    region: 'Kent',
    cities: ['Canterbury', 'Maidstone', 'Tunbridge Wells', 'Ashford', 'Dover', 'Dartford', 'Sevenoaks', 'Folkestone'],
    postcodePrefixes: ['CT1', 'ME14', 'TN1', 'TN23', 'CT16', 'DA1']
  },
  {
    ukCountry: 'England',
    region: 'Essex',
    cities: ['Chelmsford', 'Colchester', 'Southend-on-Sea', 'Basildon', 'Harlow', 'Brentwood', 'Braintree'],
    postcodePrefixes: ['CM1', 'CO1', 'SS1', 'SS14', 'CM20', 'CM14']
  },
  {
    ukCountry: 'England',
    region: 'Surrey',
    cities: ['Guildford', 'Woking', 'Epsom', 'Farnham', 'Reigate', 'Redhill', 'Staines-upon-Thames'],
    postcodePrefixes: ['GU1', 'GU21', 'KT18', 'GU9', 'RH2', 'TW18']
  },
  {
    ukCountry: 'England',
    region: 'Bristol & Avon',
    cities: ['Bristol', 'Bath', 'Weston-super-Mare', 'Keynsham', 'Clevedon'],
    postcodePrefixes: ['BS1', 'BS8', 'BS3', 'BS6', 'BS7', 'BA1']
  },
  {
    ukCountry: 'England',
    region: 'Tyne and Wear',
    cities: ['Newcastle upon Tyne', 'Sunderland', 'Gateshead', 'South Shields', 'Tynemouth', 'Whitley Bay'],
    postcodePrefixes: ['NE1', 'NE2', 'SR1', 'NE8', 'NE33', 'NE30']
  },
  {
    ukCountry: 'England',
    region: 'Nottinghamshire',
    cities: ['Nottingham', 'Mansfield', 'Newark-on-Trent', 'Worksop', 'Beeston', 'West Bridgford'],
    postcodePrefixes: ['NG1', 'NG7', 'NG18', 'NG24', 'S80', 'NG2']
  },
  {
    ukCountry: 'England',
    region: 'Lancashire',
    cities: ['Preston', 'Lancaster', 'Blackpool', 'Blackburn', 'Burnley', 'Morecambe', 'Ormskirk'],
    postcodePrefixes: ['PR1', 'LA1', 'FY1', 'BB1', 'BB11', 'L39']
  },
  {
    ukCountry: 'England',
    region: 'Cheshire',
    cities: ['Chester', 'Warrington', 'Crewe', 'Macclesfield', 'Ellesmere Port', 'Wilmslow', 'Knutsford'],
    postcodePrefixes: ['CH1', 'WA1', 'CW1', 'SK10', 'CH65', 'SK9']
  },
  {
    ukCountry: 'England',
    region: 'Cambridgeshire',
    cities: ['Cambridge', 'Peterborough', 'Ely', 'Huntingdon', 'St Neots', 'Wisbech'],
    postcodePrefixes: ['CB1', 'CB2', 'PE1', 'CB7', 'PE29', 'PE19']
  },
  {
    ukCountry: 'England',
    region: 'Oxfordshire',
    cities: ['Oxford', 'Banbury', 'Bicester', 'Abingdon', 'Witney', 'Didcot', 'Henley-on-Thames'],
    postcodePrefixes: ['OX1', 'OX2', 'OX16', 'OX26', 'OX14', 'OX28', 'RG9']
  },

  // --- SCOTLAND ---
  {
    ukCountry: 'Scotland',
    region: 'Scotland (Central Belt)',
    cities: ['Edinburgh', 'Glasgow', 'Stirling', 'Falkirk', 'Livingston', 'Paisley', 'Dunfermline'],
    postcodePrefixes: ['EH1', 'EH3', 'EH12', 'G1', 'G12', 'G42', 'FK1', 'FK8', 'PA1', 'KY12']
  },
  {
    ukCountry: 'Scotland',
    region: 'Scotland (North East & Tayside)',
    cities: ['Aberdeen', 'Dundee', 'Perth', 'Arbroath', 'Montrose'],
    postcodePrefixes: ['AB10', 'AB24', 'DD1', 'DD2', 'PH1', 'DD11']
  },
  {
    ukCountry: 'Scotland',
    region: 'Scotland (Highlands & Borders)',
    cities: ['Inverness', 'Fort William', 'Dumfries', 'Ayr', 'Kilmarnock', 'Elgin'],
    postcodePrefixes: ['IV1', 'IV2', 'PH33', 'DG1', 'KA1', 'IV30']
  },

  // --- WALES ---
  {
    ukCountry: 'Wales',
    region: 'Wales (South & Valleys)',
    cities: ['Cardiff', 'Swansea', 'Newport', 'Bridgend', 'Barry', 'Caerphilly', 'Merthyr Tydfil', 'Llanelli'],
    postcodePrefixes: ['CF10', 'CF24', 'SA1', 'SA2', 'NP20', 'CF31', 'CF83', 'SA15']
  },
  {
    ukCountry: 'Wales',
    region: 'Wales (North & Mid Wales)',
    cities: ['Wrexham', 'Bangor', 'Rhyl', 'Llandudno', 'Aberystwyth', 'Colwyn Bay'],
    postcodePrefixes: ['LL11', 'LL13', 'LL57', 'LL18', 'LL30', 'SY23']
  },

  // --- NORTHERN IRELAND ---
  {
    ukCountry: 'Northern Ireland',
    region: 'Northern Ireland (Greater Belfast)',
    cities: ['Belfast', 'Lisburn', 'Bangor', 'Newtownards', 'Carrickfergus', 'Castlereagh'],
    postcodePrefixes: ['BT1', 'BT7', 'BT9', 'BT15', 'BT28', 'BT20', 'BT23']
  },
  {
    ukCountry: 'Northern Ireland',
    region: 'Northern Ireland (North & West)',
    cities: ['Derry / Londonderry', 'Newry', 'Coleraine', 'Craigavon', 'Ballymena', 'Omagh', 'Enniskillen'],
    postcodePrefixes: ['BT48', 'BT34', 'BT52', 'BT64', 'BT42', 'BT78', 'BT74']
  }
];

export const HOUSING_TYPES = [
  'Detached House',
  'Semi-Detached House',
  'Terraced House',
  'Flat / Apartment',
  'Bungalow',
  'Maisonette'
] as const;

export const HOME_OWNERSHIP = [
  'Own home outright',
  'Own with mortgage',
  'Private rental',
  'Social housing',
  'Living with family',
  'Other'
] as const;

export const MARITAL_STATUSES = [
  'Single',
  'Married',
  'Civil Partnership',
  'Divorced',
  'Widowed',
  'Co-habiting'
] as const;

export const EDUCATION_LEVELS = [
  'Secondary Education (GCSE/O-Levels)',
  'Further Education (A-Levels/BTEC)',
  'Undergraduate Degree (BSc/BA)',
  'Postgraduate Degree (MSc/MA)',
  'Doctorate (PhD)',
  'Vocational / Apprenticeship',
  'No Formal Qualifications'
] as const;

export const WORKING_ARRANGEMENTS = [
  'On-site / Office',
  'Hybrid (2-3 days remote)',
  'Fully Remote',
  'Field-based / Mobile',
  'Not Applicable'
] as const;

export const COMPANY_SIZES = [
  '1–9 (Micro)',
  '10–49 (Small)',
  '50–249 (Medium)',
  '250–999 (Large)',
  '1,000+ (Enterprise)',
  'Self-employed / Solo',
  'Not Applicable'
] as const;

export interface JobTaxonomyItem {
  category: JobCategory;
  jobType: string;
  industry: string;
  titles: string[];
  fictionalCompanies: string[];
}

export const UK_JOB_TAXONOMY: JobTaxonomyItem[] = [
  // --- 1. Technology & IT ---
  {
    category: 'Technology & IT',
    jobType: 'Cybersecurity',
    industry: 'Technology & Cybersecurity',
    titles: [
      'Cybersecurity Analyst',
      'Information Security Specialist',
      'SOC Analyst',
      'Penetration Tester',
      'Security Operations Engineer',
      'Cyber Risk Consultant'
    ],
    fictionalCompanies: [
      'Sentinel Cyber UK',
      'Apex Defense Technologies Ltd',
      'Strata Threat Intelligence',
      'Meridian Security Labs',
      'Vanguard InfoSec UK'
    ]
  },
  {
    category: 'Technology & IT',
    jobType: 'Software Engineering',
    industry: 'Technology & Software',
    titles: [
      'Senior Software Engineer',
      'Full Stack Web Developer',
      'Frontend React Engineer',
      'Backend API Developer',
      'Mobile Application Developer',
      'QA & Automation Test Engineer'
    ],
    fictionalCompanies: [
      'Meridian Digital Labs Ltd',
      'Apex Cloud Solutions UK',
      'Strata Software Systems Ltd',
      'Beacon Byte UK',
      'Pennine Data Innovations'
    ]
  },
  {
    category: 'Technology & IT',
    jobType: 'Cloud & DevOps',
    industry: 'Technology & Infrastructure',
    titles: [
      'Cloud Solutions Architect',
      'DevOps Specialist',
      'Site Reliability Engineer (SRE)',
      'Systems Administrator',
      'Network Infrastructure Engineer'
    ],
    fictionalCompanies: [
      'Apex Cloud Solutions UK',
      'Strata Software Systems Ltd',
      'Kestrel Logic Technologies',
      'Northgate Infrastructure UK'
    ]
  },
  {
    category: 'Technology & IT',
    jobType: 'Data & Artificial Intelligence',
    industry: 'Data Analytics & AI',
    titles: [
      'Data Scientist',
      'Machine Learning Engineer',
      'Senior Data Analyst',
      'Business Intelligence Developer',
      'Database Administrator'
    ],
    fictionalCompanies: [
      'Thames Valley Analytics',
      'Pennine Data Innovations',
      'Meridian Digital Labs Ltd',
      'Beacon Byte UK'
    ]
  },
  {
    category: 'Technology & IT',
    jobType: 'IT Support & Systems',
    industry: 'Information Technology Services',
    titles: [
      'IT Support Team Lead',
      'Technical Helpdesk Specialist',
      'IT Systems Technician',
      'Desktop Support Engineer',
      'IT Service Delivery Coordinator'
    ],
    fictionalCompanies: [
      'Strata Managed IT Services',
      'Severn Technical Support',
      'Apex Cloud Solutions UK'
    ]
  },
  {
    category: 'Technology & IT',
    jobType: 'Product & Agile Delivery',
    industry: 'Digital Product Management',
    titles: [
      'Product Manager',
      'Scrum Master & Agile Coach',
      'Digital Delivery Lead',
      'IT Business Systems Analyst',
      'UX/UI Designer'
    ],
    fictionalCompanies: [
      'Meridian Digital Labs Ltd',
      'Apex Cloud Solutions UK',
      'Silverline Creative Group'
    ]
  },

  // --- 2. Healthcare & Social Care ---
  {
    category: 'Healthcare & Social Care',
    jobType: 'Nursing',
    industry: 'Healthcare & Clinical Care',
    titles: [
      'Registered Nurse',
      'Clinical Specialist Nurse',
      'Ward Sister / Charge Nurse',
      'Community Healthcare Nurse',
      'Critical Care Nurse',
      'Neonatal Specialist Nurse'
    ],
    fictionalCompanies: [
      'Crown Health Partners UK',
      'Mercia Clinical Services Ltd',
      'Highland Care Alliance',
      'Albion Healthcare Trust (Sample Body)'
    ]
  },
  {
    category: 'Healthcare & Social Care',
    jobType: 'Clinical Medicine',
    industry: 'Healthcare & Medicine',
    titles: [
      'General Practitioner (GP)',
      'Consultant Physician',
      'Specialist Registrar',
      'Clinical Fellow',
      'Medical Director'
    ],
    fictionalCompanies: [
      'Crown Health Partners UK',
      'Mercia Clinical Services Ltd',
      'Albion Diagnostics Group'
    ]
  },
  {
    category: 'Healthcare & Social Care',
    jobType: 'Allied Health & Therapy',
    industry: 'Healthcare & Rehabilitation',
    titles: [
      'Senior Physiotherapist',
      'Occupational Therapist',
      'Diagnostic Radiographer',
      'Speech & Language Specialist',
      'Dietitian & Nutrition Lead'
    ],
    fictionalCompanies: [
      'Beacon Allied Health Ltd',
      'Crown Health Partners UK',
      'Mercia Clinical Services Ltd'
    ]
  },
  {
    category: 'Healthcare & Social Care',
    jobType: 'Pharmacy & Diagnostics',
    industry: 'Healthcare & Life Sciences',
    titles: [
      'Clinical Pharmacist',
      'Senior Biomedical Scientist',
      'Medical Laboratory Specialist',
      'Pharmacy Operations Lead',
      'Clinical Trials Coordinator'
    ],
    fictionalCompanies: [
      'Albion Diagnostics',
      'Beacon Biosystems Ltd',
      'Mercia Clinical Services Ltd'
    ]
  },
  {
    category: 'Healthcare & Social Care',
    jobType: 'Care & Community Support',
    industry: 'Social Care & Community Services',
    titles: [
      'Care Home Manager',
      'Senior Care Coordinator',
      'Social Worker',
      'Mental Health Support Worker',
      'Community Support Lead'
    ],
    fictionalCompanies: [
      'Highland Care Alliance',
      'Sovereign Care Group UK',
      'Mercia Community Care'
    ]
  },

  // --- 3. Finance & Accounting ---
  {
    category: 'Finance & Accounting',
    jobType: 'Accounting',
    industry: 'Accounting & Audit',
    titles: [
      'Management Accountant',
      'Chartered Accountant (ACA)',
      'Financial Controller',
      'Senior Tax Consultant',
      'Auditor & Assurance Specialist',
      'Accounts Payable Lead'
    ],
    fictionalCompanies: [
      'Lombard & Sterling Advisory',
      'Wessex Capital Management',
      'Grosvenor Wealth Partners Ltd',
      'Severn Financial Group'
    ]
  },
  {
    category: 'Finance & Accounting',
    jobType: 'Banking & Lending',
    industry: 'Financial Services & Banking',
    titles: [
      'Commercial Lending Manager',
      'Investment Analyst',
      'Branch Operations Supervisor',
      'Treasury Specialist',
      'Commercial Underwriter'
    ],
    fictionalCompanies: [
      'Meridian Mutual UK',
      'Severn Financial Group',
      'Lombard & Sterling Advisory'
    ]
  },
  {
    category: 'Finance & Accounting',
    jobType: 'Wealth Management',
    industry: 'Wealth Management & Private Advisory',
    titles: [
      'Independent Financial Adviser',
      'Wealth Management Consultant',
      'Mortgage & Protection Specialist',
      'Pensions & Retirement Consultant',
      'Private Client Portfolio Lead'
    ],
    fictionalCompanies: [
      'Grosvenor Wealth Partners Ltd',
      'Wessex Capital Management',
      'Lombard & Sterling Advisory'
    ]
  },
  {
    category: 'Finance & Accounting',
    jobType: 'Risk & Actuarial',
    industry: 'Risk Management & Actuarial Science',
    titles: [
      'Financial Risk Analyst',
      'Actuarial Consultant',
      'Fraud & AML Compliance Officer',
      'Credit Risk Specialist',
      'Regulatory Compliance Lead'
    ],
    fictionalCompanies: [
      'Severn Financial Group',
      'Meridian Mutual UK',
      'Wessex Capital Management'
    ]
  },

  // --- 4. Engineering & Manufacturing ---
  {
    category: 'Engineering & Manufacturing',
    jobType: 'Mechanical & Electrical',
    industry: 'Engineering & Design',
    titles: [
      'Senior Mechanical Engineer',
      'Electrical Design Engineer',
      'Mechatronics Specialist',
      'Building Services Engineer',
      'CAD Design Engineer'
    ],
    fictionalCompanies: [
      'Vanguard Precision Works Ltd',
      'Caledonian Component Engineering',
      'Albion Precision Motors'
    ]
  },
  {
    category: 'Engineering & Manufacturing',
    jobType: 'Civil & Structural',
    industry: 'Civil Engineering & Infrastructure',
    titles: [
      'Civil Infrastructure Engineer',
      'Structural Safety Consultant',
      'Highways Design Engineer',
      'Environmental Engineering Consultant',
      'Geotechnical Specialist'
    ],
    fictionalCompanies: [
      'Crownstone Developments Ltd',
      'Pennine Infrastructure UK',
      'Thamesway Construction Group'
    ]
  },
  {
    category: 'Engineering & Manufacturing',
    jobType: 'Manufacturing & Production',
    industry: 'Advanced Manufacturing',
    titles: [
      'Manufacturing Process Specialist',
      'Automation & Robotics Technician',
      'Production Plant Manager',
      'CNC Precision Machinist',
      'Quality Assurance Inspector'
    ],
    fictionalCompanies: [
      'Northgate Robotics UK',
      'Severn Aerospace Components',
      'Albion Precision Motors'
    ]
  },

  // --- 5. Creative, Media & Marketing ---
  {
    category: 'Creative, Media & Marketing',
    jobType: 'Digital Marketing & Growth',
    industry: 'Digital Marketing & Advertising',
    titles: [
      'Digital Marketing Strategist',
      'SEO & Content Specialist',
      'PPC & Performance Marketing Lead',
      'Social Media Campaign Manager',
      'E-commerce Growth Specialist'
    ],
    fictionalCompanies: [
      'Silverline Creative Group',
      'Kestrel Media Network Ltd',
      'Apex Storytelling UK'
    ]
  },
  {
    category: 'Creative, Media & Marketing',
    jobType: 'Brand & Communications',
    industry: 'Media & Public Relations',
    titles: [
      'Brand Communications Manager',
      'Public Relations Executive',
      'Corporate Communications Lead',
      'Senior Copywriter & Editor',
      'Brand Marketing Strategist'
    ],
    fictionalCompanies: [
      'Strata Communications Agency',
      'Silverline Creative Group',
      'Apex Storytelling UK'
    ]
  },
  {
    category: 'Creative, Media & Marketing',
    jobType: 'Design & Multimedia',
    industry: 'Creative Design & Production',
    titles: [
      'UX/UI Designer',
      'Senior Graphic Designer',
      'Motion Graphics Artist',
      'Creative Art Director',
      'Video Production Lead'
    ],
    fictionalCompanies: [
      'Silverline Creative Group',
      'Kestrel Media Network Ltd',
      'Apex Storytelling UK'
    ]
  },

  // --- 6. Business & Administration ---
  {
    category: 'Business & Administration',
    jobType: 'Operations & Strategy',
    industry: 'Business Operations & Management',
    titles: [
      'Operations Director',
      'Business Development Manager',
      'Strategy Consultant',
      'Continuous Improvement Lead',
      'Executive Project Coordinator'
    ],
    fictionalCompanies: [
      'Grosvenor Business Consulting',
      'Meridian Operations Group Ltd',
      'Pennine Commercial Associates'
    ]
  },
  {
    category: 'Business & Administration',
    jobType: 'Human Resources',
    industry: 'Human Resources & People Operations',
    titles: [
      'HR People Partner',
      'Talent Acquisition Manager',
      'Learning & Development Lead',
      'Employee Relations Specialist',
      'People Operations Coordinator'
    ],
    fictionalCompanies: [
      'Strata People Solutions UK',
      'Meridian Operations Group Ltd',
      'Civic Services Directorate'
    ]
  },
  {
    category: 'Business & Administration',
    jobType: 'Public Sector & Governance',
    industry: 'Public Sector & Local Governance',
    titles: [
      'Senior Policy Advisor',
      'Urban Planning Officer',
      'Public Procurement Specialist',
      'Statutory Compliance Officer',
      'Casework Management Lead'
    ],
    fictionalCompanies: [
      'Regional Public Authority (Sample Body)',
      'Civic Services Directorate',
      'District Partnership Board'
    ]
  },

  // --- 7. Education & Academia ---
  {
    category: 'Education & Academia',
    jobType: 'Primary & Secondary Education',
    industry: 'Primary & Secondary Education',
    titles: [
      'Secondary School Subject Lead',
      'Primary School Teacher',
      'Head of Department (Science/Maths)',
      'Special Educational Needs Coordinator (SENCO)',
      'Assistant Headteacher'
    ],
    fictionalCompanies: [
      'Community Academy Trust (Sample Institution)',
      'County Education Federation',
      'Regional Grammar School Trust'
    ]
  },
  {
    category: 'Education & Academia',
    jobType: 'Higher Education & Research',
    industry: 'Higher Education & Research',
    titles: [
      'University Senior Lecturer',
      'Postdoctoral Academic Fellow',
      'Research Faculty Associate',
      'Academic Programme Leader',
      'Admissions & Student Experience Lead'
    ],
    fictionalCompanies: [
      'Regional University Faculty (Sample Body)',
      'Institute of Higher Research',
      'Caledonian Academic Trust'
    ]
  },

  // --- 8. Retail & Hospitality ---
  {
    category: 'Retail & Hospitality',
    jobType: 'Store Management & Retail',
    industry: 'Retail & Consumer Goods',
    titles: [
      'Store Operations Manager',
      'Visual Merchandising Specialist',
      'Inventory Control Supervisor',
      'Retail Customer Lead',
      'Department Store Section Leader'
    ],
    fictionalCompanies: [
      'Albion Goods & Provisions Ltd',
      'Meridian Retail Holdings',
      'Beacon Department Stores Ltd'
    ]
  },
  {
    category: 'Retail & Hospitality',
    jobType: 'Hotel & Accommodation',
    industry: 'Hospitality & Leisure',
    titles: [
      'Hotel General Operations Manager',
      'Hospitality Team Supervisor',
      'Conference & Events Coordinator',
      'Guest Experience Adviser',
      'Leisure Facility Duty Manager'
    ],
    fictionalCompanies: [
      'Sovereign Heritage Hotels Ltd',
      'Grosvenor Hospitality UK',
      'Highland Lodge Collection'
    ]
  },
  {
    category: 'Retail & Hospitality',
    jobType: 'Culinary & Food Service',
    industry: 'Food & Beverage Operations',
    titles: [
      'Executive Head Chef',
      'Sous Chef',
      'Food & Beverage Operations Lead',
      'Catering Operations Manager',
      'Pastry Chef Specialist'
    ],
    fictionalCompanies: [
      'Albion Dining & Hospitality Ltd',
      'Sovereign Heritage Hotels Ltd',
      'Grosvenor Hospitality UK'
    ]
  },

  // --- 9. Trades & Construction ---
  {
    category: 'Trades & Construction',
    jobType: 'Construction Management',
    industry: 'Construction & Property Development',
    titles: [
      'Chartered Quantity Surveyor',
      'Site Engineering Manager',
      'Architectural Technologist',
      'Building Control Inspector',
      'Health & Safety Site Officer'
    ],
    fictionalCompanies: [
      'Crownstone Developments Ltd',
      'Mercia Civils & Build Ltd',
      'Thamesway Construction Group'
    ]
  },
  {
    category: 'Trades & Construction',
    jobType: 'Skilled Trades',
    industry: 'Skilled Trades & Building Services',
    titles: [
      'Certified Electrician & Systems Specialist',
      'Plumbing & Heating Engineer',
      'Commercial Joiner & Carpenter',
      'HVAC Systems Installation Lead',
      'Maintenance Engineering Specialist'
    ],
    fictionalCompanies: [
      'Pennine Infrastructure UK',
      'Vanguard Technical Trades Ltd',
      'Mercia Building Solutions'
    ]
  },
  {
    category: 'Trades & Construction',
    jobType: 'Logistics & Supply Chain',
    industry: 'Logistics, Transport & Supply Chain',
    titles: [
      'Supply Chain Logistics Planner',
      'Warehouse Operations Supervisor',
      'Transport Operations Coordinator',
      'Commercial Fleet Planner',
      'Distribution Centre Team Leader'
    ],
    fictionalCompanies: [
      'Severn Logistics & Distribution',
      'Pennine Freight Systems UK',
      'Caledonian Transit Services'
    ]
  }
];

// Compatibility backward alias for UK_JOB_CATEGORIES_DATA
export interface CategorizedJobEntry {
  category: JobCategory;
  industry: string;
  titles: string[];
  fictionalCompanies: string[];
}

export const UK_JOB_CATEGORIES_DATA: CategorizedJobEntry[] = UK_JOB_TAXONOMY.map((item) => ({
  category: item.category,
  industry: item.industry,
  titles: item.titles,
  fictionalCompanies: item.fictionalCompanies,
}));

export const JOB_CATEGORIES_LIST: JobCategory[] = [
  'Technology & IT',
  'Healthcare & Social Care',
  'Finance & Accounting',
  'Engineering & Manufacturing',
  'Creative, Media & Marketing',
  'Business & Administration',
  'Education & Academia',
  'Retail & Hospitality',
  'Trades & Construction'
];

/** Lookup all distinct Job Types for a category */
export function getJobTypesForCategory(category?: JobCategory | 'Any'): string[] {
  if (!category || category === 'Any') {
    const allTypes = new Set<string>();
    UK_JOB_TAXONOMY.forEach((item) => allTypes.add(item.jobType));
    return Array.from(allTypes);
  }
  return UK_JOB_TAXONOMY.filter((item) => item.category === category).map((item) => item.jobType);
}

/** Lookup all distinct Job Titles for a category and optional job type */
export function getJobTitlesForCategoryAndType(
  category?: JobCategory | 'Any',
  jobType?: string | 'Any'
): string[] {
  let filtered = UK_JOB_TAXONOMY;
  if (category && category !== 'Any') {
    filtered = filtered.filter((item) => item.category === category);
  }
  if (jobType && jobType !== 'Any') {
    filtered = filtered.filter((item) => item.jobType === jobType);
  }
  const titlesSet = new Set<string>();
  filtered.forEach((item) => {
    item.titles.forEach((t) => titlesSet.add(t));
  });
  return Array.from(titlesSet);
}

/** Get full taxonomy entry for category, job type, and title */
export function findJobTaxonomyMatch(
  category?: JobCategory | 'Any',
  jobType?: string | 'Any',
  jobTitle?: string | 'Any'
): JobTaxonomyItem {
  let filtered = UK_JOB_TAXONOMY;
  if (category && category !== 'Any') {
    const matchCat = filtered.filter((i) => i.category === category);
    if (matchCat.length > 0) filtered = matchCat;
  }
  if (jobType && jobType !== 'Any') {
    const matchType = filtered.filter((i) => i.jobType === jobType);
    if (matchType.length > 0) filtered = matchType;
  }
  if (jobTitle && jobTitle !== 'Any') {
    const matchTitle = filtered.filter((i) => i.titles.includes(jobTitle));
    if (matchTitle.length > 0) return matchTitle[0];
  }
  return filtered[Math.floor(Math.random() * filtered.length)] || UK_JOB_TAXONOMY[0];
}

export const SMARTPHONE_BRANDS = ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Other'] as const;

export const OPERATING_SYSTEMS = ['iOS', 'Android', 'Windows', 'macOS'] as const;

export const PRIMARY_DEVICES = ['Smartphone', 'Laptop', 'Desktop', 'Tablet'] as const;

export const INTERNET_PROVIDERS = [
  'BT Broadband',
  'Sky Broadband',
  'Virgin Media',
  'Vodafone UK',
  'TalkTalk',
  'Plusnet',
  'Community Fibre',
  'Hyperoptic',
  'Zen Internet',
  'EE Broadband'
];

export const STREAMING_SERVICES = [
  'Netflix',
  'Disney+',
  'Amazon Prime Video',
  'NOW',
  'Apple TV+',
  'BBC iPlayer',
  'Channel 4 (All4)',
  'ITVX'
];

export const SOCIAL_MEDIA_PLATFORMS = [
  'Facebook',
  'Instagram',
  'TikTok',
  'X (Twitter)',
  'LinkedIn',
  'Snapchat',
  'Reddit',
  'Pinterest',
  'YouTube'
];

export const INTERESTS_LIST = [
  'Football',
  'Gaming',
  'Technology',
  'Travel',
  'Movies',
  'Fitness',
  'Music',
  'Reading',
  'Cooking',
  'Fashion',
  'Finance',
  'Cars',
  'Pets',
  'Home Improvement',
  'Gardening',
  'Photography',
  'Theatre & Arts',
  'Cycling',
  'Hiking & Outdoors',
  'Board Games & Puzzles'
];

export const INCOME_RANGES = [
  'Under £20,000',
  '£20,000–£29,999',
  '£30,000–£39,999',
  '£40,000–£49,999',
  '£50,000–£59,999',
  '£60,000–£74,999',
  '£75,000–£99,999',
  '£100,000+'
] as const;
