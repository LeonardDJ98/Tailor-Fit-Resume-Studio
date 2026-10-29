import React from 'react';
import {
  FolderLock,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  FileText,
  Target,
  FileUp,
} from 'lucide-react';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tab: 'tailor' | 'master', loadSampleJob?: boolean) => void;
}

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome to TailorFit Resume Studio
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tailor Your Resume to Any Job in One Click
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Applicant Tracking Systems (ATS) filter out up to 75% of resumes. TailorFit securely stores your complete career profile and generates role-specific resumes, tailored cover letters, and interview talking points in seconds.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 3 Core Pillars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FolderLock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">1. Master Resume Vault</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your single source of truth. Add experiences, skills, and projects, or paste your existing resume to import in seconds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">2. 1-Click Tailor Machine</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste any job description to instantly align your experience bullets, generate an ATS match score, and draft a custom cover letter.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">3. Resume Updater & Doctor</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  See exact before-and-after diffs. Apply tailored improvements back into your master resume with a single click.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Steps */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Where Should You Start?
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white">Check Your Master Resume:</strong> We've preloaded a sample senior engineer profile so you can explore right away, or click <em>AI Paste / Import</em> to load your real resume.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white">Run a 1-Click Tailor:</strong> Paste a target job post in the <em>1-Click Tailor</em> tab (or click a sample preset) to generate your customized resume, cover letter, and interview prep.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white">Review Diffs & Export:</strong> Inspect the tailored changes, apply improvements back to your Master Resume, and download your clean PDF.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onSelectAction('master');
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <FolderLock className="w-3.5 h-3.5" />
            Set Up My Master Resume
          </button>

          <button
            onClick={() => {
              onSelectAction('tailor', true);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start with 1-Click Tailor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
