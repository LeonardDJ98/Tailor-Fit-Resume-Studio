import React, { useState } from 'react';
import { TailoredApplication } from '../types/resume';
import {
  Building2,
  Calendar,
  Sparkles,
  ExternalLink,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
  FileText,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { ResumePreview } from './ResumePreview';

interface ApplicationsTrackerProps {
  applications: TailoredApplication[];
  onUpdateApplication: (app: TailoredApplication) => void;
  onDeleteApplication: (id: string) => void;
  onApplyToMaster: (app: TailoredApplication) => void;
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onApplyToMaster,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<TailoredApplication | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'resume' | 'cover' | 'qa'>('resume');
  const [copiedCover, setCopiedCover] = useState(false);

  const statuses: TailoredApplication['status'][] = [
    'Saved',
    'Applied',
    'Interviewing',
    'Offer',
    'Archived',
  ];

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: TailoredApplication['status']) => {
    switch (status) {
      case 'Saved':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Applied':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Interviewing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Offer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Archived':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleStatusChange = (app: TailoredApplication, newStatus: TailoredApplication['status']) => {
    const updated = { ...app, status: newStatus, updatedAt: new Date().toISOString() };
    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) {
      setSelectedApp(updated);
    }
  };

  const handleNotesChange = (app: TailoredApplication, notes: string) => {
    const updated = { ...app, notes, updatedAt: new Date().toISOString() };
    onUpdateApplication(updated);
    if (selectedApp?.id === app.id) {
      setSelectedApp(updated);
    }
  };

  const handleCopyCover = () => {
    if (!selectedApp) return;
    const { coverLetter } = selectedApp;
    const text = `${coverLetter.subject}\n\n${coverLetter.salutation}\n\n${coverLetter.body}\n\n${coverLetter.signOff}\n${selectedApp.tailoredResume.fullName}`;
    navigator.clipboard.writeText(text);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or job title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applications */}
      {filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No applications found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {applications.length === 0
              ? 'Use the 1-Click Tailor tab to tailor your resume for a job posting. Tailored applications will be saved here automatically!'
              : 'No applications match your search query.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {app.atsAnalysis?.overallScore || 85}% Match
                    </span>
                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                  {app.jobTitle}
                </h4>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  {app.company} {app.jobLocation ? `• ${app.jobLocation}` : ''}
                </div>

                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  {new Date(app.createdAt).toLocaleDateString()}
                  {app.bulletDiffs?.length ? ` • ${app.bulletDiffs.length} tailored bullets` : ''}
                </div>

                {app.notes && (
                  <p className="mt-2.5 text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 italic">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app, e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View Package <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedApp.company} — {selectedApp.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Created: {new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-indigo-300 font-semibold">
                      {selectedApp.atsAnalysis?.overallScore}% ATS Match
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onApplyToMaster(selectedApp)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  title="Make this tailored resume your active Master Resume"
                >
                  <Check className="w-3.5 h-3.5" />
                  Make Master Resume
                </button>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-950/50 border-b border-slate-800">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveModalTab('resume')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    activeModalTab === 'resume'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tailored Resume
                </button>
                <button
                  onClick={() => setActiveModalTab('cover')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    activeModalTab === 'cover'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cover Letter
                </button>
                <button
                  onClick={() => setActiveModalTab('qa')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    activeModalTab === 'qa'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Screening Answers ({selectedApp.screeningAnswers?.length || 0})
                </button>
              </div>

              {/* Status updater */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/70">
              {activeModalTab === 'resume' && (
                <div className="h-full">
                  <ResumePreview
                    resume={selectedApp.tailoredResume}
                    diffs={selectedApp.bulletDiffs}
                    highlightChanges={true}
                    onApplyChangesToMaster={() => onApplyToMaster(selectedApp)}
                    titleBadge={`Tailored for ${selectedApp.company}`}
                  />
                </div>
              )}

              {activeModalTab === 'cover' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={handleCopyCover}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                    >
                      {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCover ? 'Copied' : 'Copy Letter'}
                    </button>
                  </div>
                  <div className="bg-white text-slate-900 p-8 rounded-xl shadow-xl font-sans text-xs sm:text-sm leading-relaxed space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <div className="font-bold text-slate-900 text-base">
                        {selectedApp.tailoredResume.fullName}
                      </div>
                      <div className="text-xs text-slate-600">
                        {selectedApp.tailoredResume.email} • {selectedApp.tailoredResume.phone}
                      </div>
                    </div>
                    <div className="font-semibold text-slate-800">
                      Subject: {selectedApp.coverLetter.subject}
                    </div>
                    <div className="font-medium text-slate-800">
                      {selectedApp.coverLetter.salutation}
                    </div>
                    <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                      {selectedApp.coverLetter.body}
                    </div>
                    <div className="pt-2 font-medium text-slate-800">
                      {selectedApp.coverLetter.signOff}
                      <div className="font-bold text-slate-900 mt-1">
                        {selectedApp.tailoredResume.fullName}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'qa' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  {selectedApp.screeningAnswers?.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300">
                        Question {idx + 1}: {item.question}
                      </h4>
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        {item.suggestedAnswer}
                      </div>
                      {item.keyPointsToMention?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                          <span className="text-slate-400">Key Points:</span>
                          {item.keyPointsToMention.map((kp, kIdx) => (
                            <span
                              key={kIdx}
                              className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            >
                              {kp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center gap-3">
              <label className="text-xs text-slate-400 font-medium shrink-0">
                Application Notes:
              </label>
              <input
                type="text"
                value={selectedApp.notes || ''}
                onChange={(e) => handleNotesChange(selectedApp, e.target.value)}
                placeholder="e.g. Applied via referral from Sarah, first round scheduled for Thursday..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
