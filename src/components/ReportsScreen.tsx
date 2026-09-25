import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Trash2,
  Share2,
  Scan,
} from 'lucide-react';
import { ReportRecord } from '../types';
import { generatePollutionReportPDF } from '../services/pdfGenerator';
import { LanguageMode } from '../i18n';

interface ReportsScreenProps {
  reports: ReportRecord[];
  onViewReport: (report: ReportRecord) => void;
  onDeleteReport: (reportId: string) => void;
  onScanClick: () => void;
  language: LanguageMode;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  reports,
  onViewReport,
  onDeleteReport,
  onScanClick,
  language,
}) => {
  const isMr = language === 'mr';
  const isBilingual = language === 'bilingual';

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filtered reports
  const filteredReports = reports.filter((report) => {
    // Search query matches id, type, location address, or category
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      report.id.toLowerCase().includes(q) ||
      report.analysis?.pollution_type?.toLowerCase().includes(q) ||
      report.location?.address?.toLowerCase().includes(q) ||
      report.analysis?.category?.toLowerCase().includes(q);

    // Severity match
    const matchesSeverity =
      severityFilter === 'All' || report.analysis?.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const handleDownload = async (e: React.MouseEvent, report: ReportRecord) => {
    e.stopPropagation();
    setDownloadingId(report.id);
    try {
      await generatePollutionReportPDF(report);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (window.confirm(isMr ? 'हा अहवाल हटवायचा आहे का?' : 'Delete this report record?')) {
      onDeleteReport(reportId);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isMr ? 'अहवाल इतिहास' : 'Pollution Reports History'}
              </h2>
              <p className="text-xs text-slate-500">
                {isMr ? 'सर्व नोंदवलेले पर्यावरणीय अहवाल' : 'Official documentation & certified PDF exports'}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
            {reports.length} {isMr ? 'नोंदी' : 'Reports'}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isMr
                ? 'ठिकाण, अहवाल क्रमांक किंवा प्रदूषण प्रकार शोधा...'
                : 'Search by location, issue type, or report ID...'
            }
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            {isMr ? 'तीव्रता:' : 'Filter:'}
          </span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((lvl) => {
            const isActive = severityFilter === lvl;
            let activeColor = 'bg-slate-900 text-white';
            if (lvl === 'High') activeColor = 'bg-rose-600 text-white';
            if (lvl === 'Medium') activeColor = 'bg-amber-600 text-white';
            if (lvl === 'Low') activeColor = 'bg-emerald-600 text-white';

            return (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? `${activeColor} shadow-xs font-extrabold`
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lvl === 'All'
                  ? isMr
                    ? 'सर्व'
                    : 'All'
                  : lvl === 'High'
                  ? isMr
                    ? 'जास्त (High)'
                    : 'High'
                  : lvl === 'Medium'
                  ? isMr
                    ? 'मध्यम (Med)'
                    : 'Medium'
                  : isMr
                  ? 'कमी (Low)'
                  : 'Low'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const isHigh = report.analysis?.severity === 'High';
            const isMed = report.analysis?.severity === 'Medium';

            return (
              <div
                key={report.id}
                onClick={() => onViewReport(report)}
                className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                {/* Top Row: ID, Date, Severity */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800">
                      {report.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(report.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                      isHigh
                        ? 'bg-rose-600'
                        : isMed
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {isHigh ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : isMed ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    <span>{report.analysis?.severity}</span>
                  </span>
                </div>

                {/* Middle Content: Thumbnail + Details */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={report.imageDataUrl}
                      alt={report.analysis?.pollution_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {report.analysis?.pollution_type}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location?.address}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.analysis?.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-700">
                    {report.analysis?.confidence}% AI Confidence
                  </span>

                  <div className="flex items-center gap-2">
                    {/* View Report Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReport(report);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isMr ? 'पहा' : 'View'}</span>
                    </button>

                    {/* Download PDF Button */}
                    <button
                      onClick={(e) => handleDownload(e, report)}
                      disabled={downloadingId === report.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingId === report.id ? '...' : 'PDF'}</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800">
              {isMr ? 'कोणतेही अहवाल सापडले नाहीत' : 'No Reports Found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Try adjusting your search keywords or filter settings.'
                : 'You have not scanned any pollution sites yet. Capture an image to generate your first environmental report!'}
            </p>
          </div>

          <button
            onClick={onScanClick}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>{isMr ? 'नवीन स्कॅन सुरू करा' : 'Start New Scan'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
