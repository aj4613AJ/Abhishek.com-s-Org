import React, { useState, useEffect } from 'react';
import { UserProfile, ReportRecord, PollutionAnalysis, ReportLocation } from './types';
import { LanguageMode } from './i18n';
import {
  loadUserProfile,
  saveUserProfile,
  loadReports,
  addReport,
  deleteReport,
} from './services/storage';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ScanScreen } from './components/ScanScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AnalysisResultModal } from './components/AnalysisResultModal';
import { ReportViewModal } from './components/ReportViewModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<UserProfile>(() => loadUserProfile());
  const [reports, setReports] = useState<ReportRecord[]>(() => loadReports());
  const [language, setLanguage] = useState<LanguageMode>(() => user.language || 'bilingual');

  // Active scan state
  const [currentAnalysis, setCurrentAnalysis] = useState<PollutionAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<ReportLocation>({
    address: 'Bund Garden, Pune, Maharashtra',
    latitude: 18.5362,
    longitude: 73.8789,
    city: 'Pune',
    state: 'Maharashtra',
  });
  const [currentUserNotes, setCurrentUserNotes] = useState('');

  // Modals state
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<ReportRecord | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync language changes with user profile
  const handleLanguageChange = (lang: LanguageMode) => {
    setLanguage(lang);
    const updated = { ...user, language: lang };
    setUser(updated);
    saveUserProfile(updated);
  };

  // Called when AI scan finishes
  const handleAnalysisSuccess = (
    analysis: PollutionAnalysis,
    image: string,
    location: ReportLocation,
    notes: string
  ) => {
    setCurrentAnalysis(analysis);
    setCurrentImage(image);
    setCurrentLocation(location);
    setCurrentUserNotes(notes);
    setIsAnalysisModalOpen(true);
  };

  // Called when user clicks "Generate Official Report" from analysis modal
  const handleGenerateReport = async () => {
    if (!currentAnalysis || !currentImage) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newReport: ReportRecord = {
      id: `EG-2026-${randomNum}`,
      trackingNumber: `TRK-MH-${randomNum}-${(currentLocation.city || 'MH').slice(0, 2).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      timestamp: new Date().toISOString(),
      location: currentLocation,
      imageDataUrl: currentImage,
      analysis: currentAnalysis,
      status: 'Submitted',
      notes: currentUserNotes,
    };

    await addReport(newReport);
    const updatedReports = loadReports();
    setReports(updatedReports);

    // Update user profile counts in state
    setUser((prev) => ({
      ...prev,
      reportsCount: (prev.reportsCount || 0) + 1,
      scansCount: (prev.scansCount || 0) + 1,
    }));

    // Close analysis modal and open the created report modal directly
    setIsAnalysisModalOpen(false);
    setViewingReport(newReport);
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId);
    setReports(loadReports());
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    saveUserProfile(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Mobile-first Android app wrapper container */}
      <div className="w-full max-w-2xl bg-slate-50 min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/60">
        {/* Sticky Header */}
        <Header
          user={user}
          language={language}
          onLanguageChange={handleLanguageChange}
          onProfileClick={() => setActiveTab('profile')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              language={language}
              reports={reports}
              onScanClick={() => setActiveTab('scan')}
              onViewReport={(r) => setViewingReport(r)}
              onViewAllReports={() => setActiveTab('reports')}
            />
          )}

          {activeTab === 'scan' && (
            <ScanScreen
              language={language}
              onAnalysisSuccess={handleAnalysisSuccess}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsScreen
              reports={reports}
              onViewReport={(r) => setViewingReport(r)}
              onDeleteReport={handleDeleteReport}
              onScanClick={() => setActiveTab('scan')}
              language={language}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={() => setIsAuthModalOpen(true)}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reportsCount={reports.length}
          language={language}
        />

        {/* AI Analysis Result Modal */}
        <AnalysisResultModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          analysis={currentAnalysis}
          image={currentImage}
          location={currentLocation}
          userNotes={currentUserNotes}
          onGenerateReport={handleGenerateReport}
          language={language}
        />

        {/* Official Report View Modal (with PDF Download & Share) */}
        <ReportViewModal
          report={viewingReport}
          onClose={() => setViewingReport(null)}
          language={language}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(loggedUser) => {
            setUser(loggedUser);
            saveUserProfile(loggedUser);
          }}
          language={language}
        />
      </div>
    </div>
  );
}
