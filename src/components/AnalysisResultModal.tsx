import React from 'react';
import {
  X,
  FileCheck2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { PollutionAnalysis, ReportLocation } from '../types';
import { LanguageMode } from '../i18n';

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PollutionAnalysis | null;
  image: string | null;
  location: ReportLocation;
  userNotes?: string;
  onGenerateReport: () => void;
  language: LanguageMode;
}

export const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({
  isOpen,
  onClose,
  analysis,
  image,
  location,
  onGenerateReport,
  language,
}) => {
  if (!isOpen || !analysis) return null;

  const isMr = language === 'mr';
  const isBilingual = language === 'bilingual';

  const severity = analysis.severity || 'Medium';
  const isHigh = severity === 'High';
  const isMed = severity === 'Medium';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {isMr ? 'AI विश्लेषण निष्कर्ष' : 'AI Analysis Result'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMr ? 'पर्यावरण प्रदूषण तपासणी अहवाल' : 'Environmental Visual Evaluation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Image & Quick Badges Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {image && (
              <div className="w-full sm:w-44 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={image}
                  alt="Scanned item"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              {/* Severity & Confidence */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                    isHigh
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : isMed
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isHigh ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  ) : isMed ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>
                    {isMr
                      ? severity === 'High'
                        ? 'जास्त तीव्रता (High)'
                        : severity === 'Medium'
                        ? 'मध्यम तीव्रता (Medium)'
                        : 'कमी तीव्रता (Low)'
                      : `${severity} Severity`}
                  </span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {analysis.confidence}% {isMr ? 'निश्चितता' : 'Confidence'}
                </span>

                {analysis.category && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {analysis.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="text-lg font-black text-slate-900 leading-snug">
                {analysis.pollution_type}
              </h4>

              {/* Date & Location */}
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{location.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {new Date().toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Marathi Regional Summary if available */}
          {analysis.marathi_summary && (isMr || isBilingual) && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs space-y-1">
              <span className="font-extrabold text-[11px] text-amber-800 uppercase tracking-wider block">
                स्थानिक सारांश (Regional Insight)
              </span>
              <p className="leading-relaxed font-medium">
                {analysis.marathi_summary}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              {isMr ? 'तपशीलवार निरीक्षण' : 'Visual Observations'}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {analysis.description}
            </p>
          </div>

          {/* Environmental Impact */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-800 text-xs font-extrabold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{isMr ? 'पर्यावरणीय व आरोग्य परिणाम' : 'Possible Environmental Impact'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {analysis.environmental_impact}
            </p>
          </div>

          {/* Suggested Remedial Action */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{isMr ? 'शिफारस केलेली तत्काळ कृती' : 'Suggested Action / Remediation'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {analysis.recommended_action}
            </p>
          </div>

          {/* Detected Items Pill list */}
          {analysis.detected_items && analysis.detected_items.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-600">
                {isMr ? 'ओळखलेले घटक:' : 'Identified Visual Artifacts:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.detected_items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium"
                  >
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Disclaimer */}
          <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-normal">
              {isMr
                ? 'महत्त्वाची सूचना: एआय प्रतिमा विश्लेषण हे केवळ प्राथमिक दृश्य निरीक्षणावर आधारित संकेत देते आणि प्रतिमेवरून रासायनिक किंवा सूक्ष्म घटकांची प्रत्यक्ष पडताळणी न झाल्यास ते वैज्ञानिकदृष्ट्या अंतिम मानले जाऊ शकत नाही.'
                : analysis.disclaimer}
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
          >
            {isMr ? 'बंद करा' : 'Close'}
          </button>

          <button
            onClick={onGenerateReport}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isMr ? 'अधिकृत अहवाल तयार करा' : 'Generate Official Report'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
