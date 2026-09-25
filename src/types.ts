export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface PollutionAnalysis {
  pollution_type: string;
  category?: string;
  description: string;
  severity: SeverityLevel;
  confidence: number;
  environmental_impact: string;
  recommended_action: string;
  detected_items?: string[];
  urgency_level?: string;
  marathi_summary?: string;
  disclaimer: string;
}

export interface ReportLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
}

export interface ReportRecord {
  id: string; // e.g. "EG-2026-9281"
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  timestamp: string;
  location: ReportLocation;
  imageDataUrl: string;
  analysis: PollutionAnalysis;
  status: 'Submitted' | 'Under Review' | 'Verified' | 'Resolved';
  notes?: string;
  trackingNumber: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  language: 'en' | 'mr' | 'bilingual';
  scansCount: number;
  reportsCount: number;
  createdAt: string;
}

export interface EnvironmentalTip {
  id: string;
  title: string;
  title_mr: string;
  category: string;
  summary: string;
  summary_mr: string;
  actionText: string;
  actionText_mr: string;
  iconName: string;
}

export interface SamplePollutionImage {
  id: string;
  title: string;
  title_mr: string;
  category: string;
  location: string;
  imageUrl: string;
  description: string;
}
