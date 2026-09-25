import React from 'react';
import {
  Scan,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  CheckCircle2,
  Flame,
  Droplets,
  Recycle,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, ReportRecord } from '../types';
import { LanguageMode, i18nText, awarenessTips } from '../i18n';

interface HomeScreenProps {
  user: UserProfile;
  language: LanguageMode;
  reports: ReportRecord[];
  onScanClick: () => void;
  onViewReport: (report: ReportRecord) => void;
  onViewAllReports: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  language,
  reports,
  onScanClick,
  onViewReport,
  onViewAllReports,
}) => {
  const isMr = language === 'mr';
  const isBilingual = language === 'bilingual';

  // Stats calculation
  const totalReportsCount = reports.length;
  const highSeverityCount = reports.filter((r) => r.analysis?.severity === 'High').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved' || r.status === 'Verified').length;

  const recentReports = reports.slice(0, 3);

  const getTipIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Recycle':
        return <Recycle className="w-5 h-5 text-emerald-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 shadow-xl shadow-emerald-900/10">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Environmental Intelligence</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-200">
              {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isMr ? 'नमस्कार,' : isBilingual ? 'Welcome,' : 'Welcome back,'}{' '}
              <span className="text-emerald-200">{user.name.split(' ')[0]}</span>
            </h2>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-md leading-relaxed">
              {isMr
                ? i18nText.heroSubtextMr
                : isBilingual
                ? `${i18nText.heroSubtext} (${i18nText.heroSubtextMr})`
                : i18nText.heroSubtext}
            </p>
          </div>

          {/* MAIN PROMINENT BUTTON: 🔍 Scan Now */}
          <div className="pt-2">
            <button
              onClick={onScanClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-800 font-extrabold text-base rounded-2xl shadow-lg shadow-black/15 hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-left">
                <div className="text-base font-black leading-tight text-slate-900">
                  {isMr ? '🔍 आता स्कॅन करा' : '🔍 Scan Pollution Now'}
                </div>
                {(isBilingual || isMr) && (
                  <div className="text-[11px] font-semibold text-emerald-700">
                    {isMr ? 'AI विश्लेषण आणि तात्काळ अहवाल' : 'AI Instant Analysis & Report'}
                  </div>
                )}
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
            <Scan className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 leading-tight">
            {user.scansCount || totalReportsCount + 2}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {isMr ? 'एकूण स्कॅन' : 'Total Scans'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1.5">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 leading-tight">
            {totalReportsCount}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {isMr ? 'अहवाल सादर' : 'Reports Filed'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-1.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-rose-600 leading-tight">
            {highSeverityCount}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {isMr ? 'गंभीर नोंदी' : 'Critical Alerts'}
          </span>
        </div>
      </div>

      {/* Recent Field Reports */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isMr ? 'नुकतेच सादर केलेले अहवाल' : 'Recent Environmental Reports'}
            </h3>
            <p className="text-xs text-slate-500">
              {isMr ? 'स्थानिक प्रशासनासाठी अधिकृत नोंदी' : 'Official civic documentation'}
            </p>
          </div>
          {reports.length > 3 && (
            <button
              onClick={onViewAllReports}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              {isMr ? 'सर्व पहा' : 'View All'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {recentReports.map((report) => {
            const isHigh = report.analysis?.severity === 'High';
            const isMed = report.analysis?.severity === 'Medium';

            return (
              <div
                key={report.id}
                onClick={() => onViewReport(report)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center group"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={report.imageDataUrl}
                    alt={report.analysis?.pollution_type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span
                    className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold text-white ${
                      isHigh
                        ? 'bg-rose-600'
                        : isMed
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {report.analysis?.severity}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 font-mono tracking-wider">
                      {report.id}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {new Date(report.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {report.analysis?.pollution_type}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{report.location?.address}</span>
                  </div>

                  {report.analysis?.marathi_summary && isBilingual && (
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                      {report.analysis.marathi_summary}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Awareness & Civic Action Cards */}
      <div className="space-y-3 pt-2">
        <div className="px-1">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            {isMr ? 'पर्यावरण संवर्धन व मार्गदर्शक' : 'Environmental Action & Tips'}
          </h3>
          <p className="text-xs text-slate-500">
            {isMr
              ? 'प्रदूषण रोखण्यासाठी उपयुक्त नागरिक माहिती'
              : 'Actionable awareness for clean air, water, and soil'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {awarenessTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {getTipIcon(tip.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wide uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {tip.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {isMr ? tip.title_mr : tip.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isMr ? tip.summary_mr : tip.summary}
              </p>

              <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isMr ? tip.actionText_mr : tip.actionText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer and App Credit Badge */}
      <div className="text-center pt-4 pb-2 text-xs text-slate-600 border-t border-slate-200/70">
        <p className="font-semibold text-slate-600">
          EchoGuard • See Pollution. Understand It. Report It.
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Conceived & Developed by <strong className="text-emerald-700 font-bold">Abhishek Jadhav</strong>
        </p>
      </div>
    </div>
  );
};
