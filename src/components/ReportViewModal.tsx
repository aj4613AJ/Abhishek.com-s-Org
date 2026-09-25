import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Printer,
  Shield,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { ReportRecord } from '../types';
import { generatePollutionReportPDF } from '../services/pdfGenerator';
import { LanguageMode } from '../i18n';

interface ReportViewModalProps {
  report: ReportRecord | null;
  onClose: () => void;
  language: LanguageMode;
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({
  report,
  onClose,
  language,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!report) return null;

  const isMr = language === 'mr';
  const severity = report.analysis?.severity || 'Medium';
  const isHigh = severity === 'High';
  const isMed = severity === 'Medium';

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePollutionReportPDF(report);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShare = async () => {
    const shareText = `EchoGuard Incident Report [${report.id}]: ${report.analysis?.pollution_type} at ${report.location?.address}. Severity: ${report.analysis?.severity}. Verified by EchoGuard AI.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `EchoGuard Report - ${report.id}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
              {report.id}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {new Date(report.timestamp).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Share Incident Report"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Download Official PDF Report"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-emerald-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Echo<span className="text-emerald-600">Guard</span>
                </h2>
                <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase mt-0.5">
                  Official Environmental Incident Report
                </p>
                <p className="text-[10px] text-slate-400">
                  Certified AI Vision Field Observation
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-700">
                REF: {report.trackingNumber || report.id}
              </div>
              <div className="text-[11px] text-slate-500">
                {new Date(report.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status: {report.status}
              </div>
            </div>
          </div>

          {/* Observer & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Field Reporter
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{report.userName}</p>
              <p className="text-slate-500">{report.userPhone || report.userEmail || 'Certified Citizen'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Incident Location
              </span>
              <p className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{report.location?.address}</span>
              </p>
              {report.location?.latitude && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  GPS: {report.location.latitude.toFixed(4)}°N, {report.location.longitude?.toFixed(4)}°E
                </p>
              )}
            </div>
          </div>

          {/* Evidence Image and Classification */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-full sm:w-56 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src={report.imageDataUrl}
                alt="Photographic evidence"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                    isHigh
                      ? 'bg-rose-600'
                      : isMed
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {severity.toUpperCase()} SEVERITY
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {report.analysis?.confidence}% AI Confidence
                </span>

                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {report.analysis?.category || 'Pollution'}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {report.analysis?.pollution_type}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {report.analysis?.description}
              </p>
            </div>
          </div>

          {/* Environmental Impact Box */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
            <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider block">
              Potential Environmental & Ecological Impact
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.analysis?.environmental_impact}
            </p>
          </div>

          {/* Suggested Remediation Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              Recommended Remedial & Civic Action Steps
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.analysis?.recommended_action}
            </p>
          </div>

          {/* Marathi Regional Summary if present */}
          {report.analysis?.marathi_summary && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
              <span className="font-bold text-[10px] text-amber-800 uppercase tracking-wider block mb-1">
                स्थानिक प्रशासनासाठी सूचना (Regional Insight)
              </span>
              <p className="italic">{report.analysis.marathi_summary}</p>
            </div>
          )}

          {/* Scientific Disclaimer & Sign-off Stamp */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="max-w-md">
              <p className="font-semibold text-slate-600">Verification Disclaimer:</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                {report.analysis?.disclaimer ||
                  'AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical composition or microscopic pollutants.'}
              </p>
            </div>

            <div className="border-2 border-dashed border-emerald-600/40 p-2.5 rounded-xl text-center shrink-0 w-36 bg-emerald-50/30">
              <div className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider">
                EchoGuard Verified
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-700">
                {report.id}
              </div>
              <div className="text-[8px] text-slate-400">Citizen Submission</div>
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Lead Developer: <strong className="text-slate-800">Abhishek Jadhav</strong>
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Preparing PDF...' : 'Download Official PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 border border-slate-300 hover:bg-white text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
            >
              {isMr ? 'बंद करा' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
