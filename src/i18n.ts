export type LanguageMode = 'en' | 'mr' | 'bilingual';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  taglineMarathi: string;
  developerCredit: string;
  developerName: string;
  // Navigation
  navHome: string;
  navHomeMr: string;
  navScan: string;
  navScanMr: string;
  navReports: string;
  navReportsMr: string;
  navProfile: string;
  navProfileMr: string;
  // Home
  welcome: string;
  welcomeMr: string;
  scanMainBtn: string;
  scanMainBtnMr: string;
  heroSubtext: string;
  heroSubtextMr: string;
  quickStats: string;
  totalScans: string;
  totalReports: string;
  highSeverityCount: string;
  recentScans: string;
  recentReports: string;
  viewAll: string;
  ecoTipsTitle: string;
  ecoTipsSubtitle: string;
  // Scan
  scanTitle: string;
  scanSubtitle: string;
  cameraBtn: string;
  uploadBtn: string;
  liveCameraBtn: string;
  testSamplesTitle: string;
  testSamplesSubtitle: string;
  locationLabel: string;
  detectingLocation: string;
  editLocation: string;
  notesPlaceholder: string;
  analyzeBtn: string;
  analyzingText: string;
  retakeImage: string;
  // Results
  aiAnalysisTitle: string;
  detectedIssue: string;
  category: string;
  severity: string;
  confidence: string;
  environmentalImpact: string;
  suggestedAction: string;
  generateReportBtn: string;
  disclaimerNotice: string;
  // Reports
  reportsTitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterHigh: string;
  filterMedium: string;
  filterLow: string;
  viewReport: string;
  downloadPdf: string;
  shareReport: string;
  noReportsFound: string;
  // Profile
  profileTitle: string;
  editProfile: string;
  saveProfile: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  locationProfileLabel: string;
  languageLabel: string;
  logoutBtn: string;
  loginBtn: string;
  supabaseSettings: string;
}

export const i18nText: TranslationDictionary = {
  appName: 'EchoGuard',
  tagline: 'See Pollution. Understand It. Report It.',
  taglineMarathi: 'प्रदूषण ओळखा. समजून घ्या. अहवाल नोंदवा.',
  developerCredit: 'Developed with Care by',
  developerName: 'Abhishek Jadhav',

  // Bottom Navigation
  navHome: 'Home',
  navHomeMr: 'मुख्यपृष्ठ',
  navScan: 'Scan Pollution',
  navScanMr: 'प्रदूषण स्कॅन',
  navReports: 'Reports',
  navReportsMr: 'अहवाल',
  navProfile: 'Profile',
  navProfileMr: 'प्रोफाइल',

  // Home Screen
  welcome: 'Welcome back,',
  welcomeMr: 'स्वागत आहे,',
  scanMainBtn: '🔍 Scan Now',
  scanMainBtnMr: '🔍 आता स्कॅन करा',
  heroSubtext: 'Capture an image of pollution for instant AI environmental diagnosis & certified civic reporting.',
  heroSubtextMr: 'प्रदूषणाचा फोटो काढा आणि तात्काळ AI विश्लेषण आणि अधिकृत अहवाल मिळवा.',
  quickStats: 'Community Impact',
  totalScans: 'Scans Done',
  totalReports: 'Reports Filed',
  highSeverityCount: 'Critical Alerts',
  recentScans: 'Recent Field Scans',
  recentReports: 'Recent Reports',
  viewAll: 'View All',
  ecoTipsTitle: 'Eco Awareness & Civic Guide',
  ecoTipsSubtitle: 'Simple daily steps to safeguard Maharashtra’s clean soil and waterways',

  // Scan Screen
  scanTitle: 'AI Pollution Scanner',
  scanSubtitle: 'Take a clear photograph of environmental waste, smoke, or water contamination.',
  cameraBtn: 'Take Photo',
  uploadBtn: 'Upload from Gallery',
  liveCameraBtn: 'Open Live Camera',
  testSamplesTitle: 'Or Try a Test Image',
  testSamplesSubtitle: 'Click any sample to test the AI vision analysis instantly',
  locationLabel: 'Incident Location',
  detectingLocation: 'Acquiring GPS location...',
  editLocation: 'Edit Location',
  notesPlaceholder: 'Add optional observations (e.g. Foul smell, ongoing burning, near school)...',
  analyzeBtn: 'Analyze with AI',
  analyzingText: 'EchoGuard AI is inspecting visual spectral patterns...',
  retakeImage: 'Choose Different Image',

  // Analysis Results
  aiAnalysisTitle: 'AI Environmental Analysis',
  detectedIssue: 'Detected Issue',
  category: 'Pollution Category',
  severity: 'Severity Level',
  confidence: 'AI Confidence',
  environmentalImpact: 'Possible Environmental Impact',
  suggestedAction: 'Recommended Immediate Action',
  generateReportBtn: 'Generate Official Report',
  disclaimerNotice: 'Image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical pollutants.',

  // Reports Screen
  reportsTitle: 'Report History',
  searchPlaceholder: 'Search by location, issue type, or report ID...',
  filterAll: 'All Levels',
  filterHigh: 'High Severity',
  filterMedium: 'Medium Severity',
  filterLow: 'Low Severity',
  viewReport: 'View Full Report',
  downloadPdf: 'Download PDF',
  shareReport: 'Share Report',
  noReportsFound: 'No environmental reports match your search criteria.',

  // Profile Screen
  profileTitle: 'User Profile & Settings',
  editProfile: 'Edit Profile Information',
  saveProfile: 'Save Profile Changes',
  nameLabel: 'Full Name',
  phoneLabel: 'Mobile Number',
  emailLabel: 'Email Address',
  locationProfileLabel: 'Primary Location',
  languageLabel: 'Display Language Preference',
  logoutBtn: 'Sign Out',
  loginBtn: 'Sign In / Register',
  supabaseSettings: 'Supabase Cloud Database Sync',
};

export const sampleImagesList = [
  {
    id: 'sample-plastic-river',
    title: 'Riverbank Plastic Waste',
    title_mr: 'नदी काठचा प्लास्टिक कचरा',
    category: 'Plastic Waste',
    location: 'Mula-Mutha Riverbank, Pune, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    description: 'Accumulation of discarded single-use plastic bottles, packets, and styrofoam along riverbed.',
  },
  {
    id: 'sample-smoke-industrial',
    title: 'Dense Industrial Smoke Plume',
    title_mr: 'कारखान्यातील दाट धूर',
    category: 'Air Pollution',
    location: 'MIDC Industrial Area, Bhosari, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    description: 'Black particulate smoke and emission plume rising from manufacturing chimney into atmosphere.',
  },
  {
    id: 'sample-garbage-open',
    title: 'Illegal Open Garbage Dump',
    title_mr: 'उघड्यावरील कचऱ्याचा ढीग',
    category: 'Garbage & Waste',
    location: 'Highway Bypass, Nashik Road, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    description: 'Unsegregated municipal waste heap rotting beside public roadway, attracting pests and stray cattle.',
  },
  {
    id: 'sample-water-toxic',
    title: 'Toxic Foamy Water Drain',
    title_mr: 'पाण्यावरील फेस आणि सांडपाणी',
    category: 'Water Pollution',
    location: 'Drainage Channel, Thane Creek, Mumbai, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Stagnant chemical foam and untreated industrial effluent spilling into coastal waterway.',
  },
];

export const awarenessTips = [
  {
    id: 'tip-1',
    title: 'Microplastic Contamination in Waterways',
    title_mr: 'जलस्रोतांमध्ये मायक्रोप्लास्टिकचा धोका',
    category: 'Plastic Awareness',
    summary: 'Single-use plastic takes 450+ years to break down, fracturing into microscopic particles that enter municipal water and marine food chains.',
    summary_mr: 'सिंगल-युज प्लास्टिक नष्ट होण्यास ४५० पेक्षा जास्त वर्षे लागतात. त्याचे मायक्रोप्लास्टिकमध्ये रूपांतर होऊन ते पिण्याच्या पाण्यात व अन्नसाखळीत मिसळते.',
    actionText: 'Carry reusable cotton bags & steel water bottles.',
    actionText_mr: 'नेहमी कापडी पिशव्या आणि स्टीलच्या बाटल्या वापरा.',
    iconName: 'ShieldAlert',
  },
  {
    id: 'tip-2',
    title: 'Report Illegal Open Burning (Section 19 Air Act)',
    title_mr: 'कचरा जाळण्याविरोधात तत्काळ तक्रार नोंदवा',
    category: 'Air Quality',
    summary: 'Burning dry leaves, rubber, or plastic releases carcinogenic dioxins, furans, and particulate PM2.5, triggering severe asthma among children.',
    summary_mr: 'प्लास्टिक किंवा सुका कचरा जाळल्याने अत्यंत विषारी वायू आणि धूर हवेत पसरतो, ज्यामुळे लहान मुले आणि ज्येष्ठांना श्वसनाचे त्रास होतात.',
    actionText: 'Report to local Municipal Ward Officer or Fire Services.',
    actionText_mr: 'स्थानिक मनपा कार्यालय किंवा अग्निशामक दलाकडे तत्काळ तक्रार करा.',
    iconName: 'Flame',
  },
  {
    id: 'tip-3',
    title: 'Segregation at Source: Wet vs Dry Waste',
    title_mr: 'कचऱ्याचे वर्गीकरण: ओला आणि सुका कचरा',
    category: 'Waste Management',
    summary: 'Mixing kitchen waste with plastics prevents recycling and creates combustible methane gases in landfill dump yards.',
    summary_mr: 'ओला आणि सुका कचरा एकत्र केल्याने त्याचे पुनर्वापर करता येत नाही आणि कचरा डेपोमध्ये आगी व विषारी वायू तयार होतात.',
    actionText: 'Keep separate green (organic) & blue (dry) bins.',
    actionText_mr: 'घरात ओल्या कचऱ्यासाठी हिरवी व सुक्या कचऱ्यासाठी निळी कचराकुंडी ठेवा.',
    iconName: 'Recycle',
  },
  {
    id: 'tip-4',
    title: 'Protecting Urban Wetlands & Lakes',
    title_mr: 'शहरातील तलाव आणि नद्यांचे रक्षण करा',
    category: 'Water Conservation',
    summary: 'Dumping construction debris or domestic sewage into water bodies chokes natural aquifers and destroys local bird biodiversity.',
    summary_mr: 'तलावात राडारोडा किंवा सांडपाणी सोडल्याने भूजल प्रदूषित होते आणि जलचर जीव धोक्यात येतात.',
    actionText: 'Generate an EchoGuard report to notify local authorities.',
    actionText_mr: 'अशा ठिकाणी त्वरित EchoGuard द्वारे अहवाल तयार करा.',
    iconName: 'Droplets',
  },
];
