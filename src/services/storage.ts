import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, ReportRecord } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'echoguard_user_profile',
  REPORTS: 'echoguard_reports_history',
  SUPABASE_CONFIG: 'echoguard_supabase_config',
};

// Initial default user profile (Abhishek Jadhav / EcoGuard Citizen)
export const initialUserProfile: UserProfile = {
  id: 'usr_abhishek_01',
  name: 'Abhishek Jadhav',
  email: 'abhijadhav9617@gmail.com',
  phone: '+91 98234 56789',
  location: 'Pune, Maharashtra, India',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  language: 'bilingual',
  scansCount: 4,
  reportsCount: 3,
  createdAt: '2026-03-15T10:00:00.000Z',
};

// Initial seed reports to showcase full functionality immediately
export const initialSeedReports: ReportRecord[] = [
  {
    id: 'EG-2026-8492',
    trackingNumber: 'TRK-MH-9281-PU',
    userId: 'usr_abhishek_01',
    userName: 'Abhishek Jadhav',
    userEmail: 'abhijadhav9617@gmail.com',
    userPhone: '+91 98234 56789',
    timestamp: '2026-09-24T14:32:00.000Z',
    location: {
      address: 'Mula-Mutha Riverbank, Bund Garden, Pune, Maharashtra',
      latitude: 18.5362,
      longitude: 73.8789,
      city: 'Pune',
      state: 'Maharashtra',
    },
    imageDataUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    analysis: {
      pollution_type: 'Plastic Litter & Microplastic Risk in Riverbed',
      category: 'Plastic Waste',
      description: 'Extensive accumulation of discarded polyethylene bags, PET water bottles, and fragmented styrofoam entangled in riparian vegetation along the river course.',
      severity: 'High',
      confidence: 94,
      environmental_impact: 'High hazard of plastics degrading into toxic microplastics that enter freshwater supply and aquatic biota. Traps water flow, increasing siltation and breeding mosquitoes.',
      recommended_action: 'Deploy municipal cleanup skimmers, organize civic containment drives, and notify Pune Municipal Corporation (PMC) Solid Waste Division.',
      detected_items: ['Polyethylene shopping bags', 'PET bottles', 'Food wrappers', 'Styrofoam packaging'],
      urgency_level: 'Immediate',
      marathi_summary: 'मुळा-मुठा नदीपात्रात मोठ्या प्रमाणात प्लास्टिक कचरा साचला असून यामुळे पाणी दूषित होऊन मायक्रोप्लास्टिकचा धोका निर्माण झाला आहे. तातडीने स्वच्छता आवश्यक आहे.',
      disclaimer: 'Note: AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical or microscopic pollutants.',
    },
    status: 'Verified',
    notes: 'Reported during citizen river audit near Bund Garden walkway.',
  },
  {
    id: 'EG-2026-7219',
    trackingNumber: 'TRK-MH-7219-BH',
    userId: 'usr_abhishek_01',
    userName: 'Abhishek Jadhav',
    userEmail: 'abhijadhav9617@gmail.com',
    userPhone: '+91 98234 56789',
    timestamp: '2026-09-22T09:15:00.000Z',
    location: {
      address: 'MIDC Phase II Industrial Zone, Bhosari, Pune',
      latitude: 18.6298,
      longitude: 73.8478,
      city: 'Pimpri-Chinchwad',
      state: 'Maharashtra',
    },
    imageDataUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    analysis: {
      pollution_type: 'Unfiltered Industrial Stack Emissions',
      category: 'Air Pollution',
      description: 'Dense dark particulate plume discharging from industrial furnace chimney into boundary atmosphere during morning thermal inversion.',
      severity: 'Medium',
      confidence: 88,
      environmental_impact: 'Elevated particulate matter (PM2.5 & PM10) concentrations leading to acute respiratory irritation for residential neighborhoods within 3 km radius.',
      recommended_action: 'Forward telemetry and image timestamp to Maharashtra Pollution Control Board (MPCB) Sub-Regional Office for continuous stack monitoring audit.',
      detected_items: ['Industrial chimney', 'Soot / Particulate plume', 'Dense atmospheric haze'],
      urgency_level: 'Moderate',
      marathi_summary: 'भोसरी एमआयडीसी भागात कारखान्यातून दाट काळा धूर हवेत सोडला जात असून यामुळे हवेची गुणवत्ता खालावली आहे. एमपीसीबीकडे तपासणीची मागणी नोंदवली आहे.',
      disclaimer: 'Note: AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical or microscopic pollutants.',
    },
    status: 'Under Review',
    notes: 'Visible smoke persisted for over 45 minutes.',
  },
  {
    id: 'EG-2026-6104',
    trackingNumber: 'TRK-MH-6104-NS',
    userId: 'usr_abhishek_01',
    userName: 'Abhishek Jadhav',
    userEmail: 'abhijadhav9617@gmail.com',
    userPhone: '+91 98234 56789',
    timestamp: '2026-09-18T16:40:00.000Z',
    location: {
      address: 'Old Agra Road Bypass, Nashik, Maharashtra',
      latitude: 19.9975,
      longitude: 73.7898,
      city: 'Nashik',
      state: 'Maharashtra',
    },
    imageDataUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    analysis: {
      pollution_type: 'Illegal Open Municipal Solid Waste Dump',
      category: 'Garbage/Waste',
      description: 'Mixed domestic refuse, decomposing organic waste, and plastic debris dumped on public road shoulder with signs of uncontained leachate.',
      severity: 'High',
      confidence: 91,
      environmental_impact: 'Groundwater contamination through toxic leachate seepage, foul odor nuisance, and hazard of open methane fires.',
      recommended_action: 'Sanitize site, install surveillance cameras, and clear waste through Nashik Municipal Corporation waste collection trucks.',
      detected_items: ['Decomposing organic waste', 'Scattered plastic bags', 'Cardboard packaging', 'Unsanitary trash pile'],
      urgency_level: 'Immediate',
      marathi_summary: 'महामार्गालगत उघड्यावर मोठा कचऱ्याचा ढीग साचला असून दुर्गंधी व रोगराईचा धोका निर्माण झाला आहे. महापालिकेने तातडीने उचल करणे आवश्यक आहे.',
      disclaimer: 'Note: AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical or microscopic pollutants.',
    },
    status: 'Submitted',
    notes: 'Public road shoulder used as illegal dumping point.',
  },
];

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

// Helper to get or set Supabase client
let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  // Check env vars first
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    try {
      supabaseClientInstance = createClient(envUrl, envKey);
      return supabaseClientInstance;
    } catch (e) {
      console.error('Error creating Supabase client with env vars:', e);
    }
  }

  // Check stored custom config in localStorage
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (storedConfig) {
      const parsed: SupabaseConfig = JSON.parse(storedConfig);
      if (parsed.url && parsed.anonKey) {
        supabaseClientInstance = createClient(parsed.url, parsed.anonKey);
        return supabaseClientInstance;
      }
    }
  } catch (e) {
    console.error('Error reading stored Supabase config:', e);
  }

  return null;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (!url || !anonKey) {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
      supabaseClientInstance = null;
      return true;
    }
    const client = createClient(url, anonKey);
    supabaseClientInstance = client;
    localStorage.setItem(
      STORAGE_KEYS.SUPABASE_CONFIG,
      JSON.stringify({ url, anonKey, isConnected: true })
    );
    return true;
  } catch (e) {
    console.error('Invalid Supabase configuration:', e);
    return false;
  }
}

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
}

// User Profile Storage
export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load profile from localStorage:', e);
  }
  // Store initial profile
  saveUserProfile(initialUserProfile);
  return initialUserProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));

    // Async sync with Supabase if configured
    const client = getSupabaseClient();
    if (client) {
      client
        .from('profiles')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          avatar: profile.avatar,
          language: profile.language,
          scans_count: profile.scansCount,
          reports_count: profile.reportsCount,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase profile sync notice:', error.message);
        });
    }
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

// Reports Storage
export function loadReports(): ReportRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (raw) {
      const reports = JSON.parse(raw);
      if (Array.isArray(reports) && reports.length > 0) {
        return reports;
      }
    }
  } catch (e) {
    console.error('Failed to load reports from localStorage:', e);
  }
  // Seed initial reports
  saveReports(initialSeedReports);
  return initialSeedReports;
}

export function saveReports(reports: ReportRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage:', e);
  }
}

export async function addReport(newReport: ReportRecord): Promise<void> {
  const current = loadReports();
  const updated = [newReport, ...current];
  saveReports(updated);

  // Update profile counts
  const profile = loadUserProfile();
  profile.reportsCount = (profile.reportsCount || 0) + 1;
  profile.scansCount = (profile.scansCount || 0) + 1;
  saveUserProfile(profile);

  // Sync to Supabase if client is active
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('reports').insert({
        id: newReport.id,
        tracking_number: newReport.trackingNumber,
        user_id: newReport.userId,
        user_name: newReport.userName,
        user_email: newReport.userEmail,
        user_phone: newReport.userPhone,
        timestamp: newReport.timestamp,
        location: newReport.location,
        image_url: newReport.imageDataUrl.startsWith('data:') ? 'base64_stored_locally' : newReport.imageDataUrl,
        analysis: newReport.analysis,
        status: newReport.status,
        notes: newReport.notes,
      });
    } catch (err) {
      console.warn('Supabase report insertion notice:', err);
    }
  }
}

export function deleteReport(reportId: string): void {
  const current = loadReports();
  const updated = current.filter((r) => r.id !== reportId);
  saveReports(updated);
}

// SQL Schema script for Supabase tables
export const SUPABASE_SQL_SCHEMA = `-- EchoGuard Supabase SQL Migration
-- Run this in your Supabase SQL Editor to enable cloud sync & RLS

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  avatar TEXT,
  language TEXT DEFAULT 'bilingual',
  scans_count INTEGER DEFAULT 0,
  reports_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  tracking_number TEXT,
  user_id TEXT REFERENCES public.profiles(id),
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location JSONB,
  image_url TEXT,
  analysis JSONB,
  status TEXT DEFAULT 'Submitted',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 4. Open Policies for prototype/public citizen reporting
CREATE POLICY "Allow public read of reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow insert of reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update of reports" ON public.reports FOR UPDATE USING (true);

CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow upsert of profiles" ON public.profiles FOR ALL USING (true);
`;
