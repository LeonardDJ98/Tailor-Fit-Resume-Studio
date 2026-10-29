import React, { useState, useEffect } from 'react';
import { ResumeProfile, TailoredApplication } from './types/resume';
import {
  loadMasterResume,
  saveMasterResume,
  loadApplications,
  saveApplications,
  saveApplication,
  deleteApplication,
} from './services/storage';
import { MasterResumeEditor } from './components/MasterResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { TailorEngine } from './components/TailorEngine';
import { ApplicationsTracker } from './components/ApplicationsTracker';
import { ResumeOptimizerDoctor } from './components/ResumeOptimizerDoctor';
import { WelcomeGuideModal } from './components/WelcomeGuideModal';
import {
  Sparkles,
  Zap,
  FolderLock,
  Layers,
  Activity,
  CheckCircle,
  FileText,
  Eye,
  X,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [masterResume, setMasterResume] = useState<ResumeProfile>(loadMasterResume);
  const [applications, setApplications] = useState<TailoredApplication[]>(loadApplications);
  const [activeTab, setActiveTab] = useState<'tailor' | 'master' | 'tracker' | 'optimizer'>('tailor');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(() => {
    return !localStorage.getItem('tailorfit_has_seen_welcome_guide');
  });
  const [autoLoadDemoJob, setAutoLoadDemoJob] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleCloseWelcome = () => {
    localStorage.setItem('tailorfit_has_seen_welcome_guide', 'true');
    setShowWelcomeGuide(false);
  };

  const handleWelcomeSelectAction = (tab: 'tailor' | 'master', loadSampleJob?: boolean) => {
    handleCloseWelcome();
    setActiveTab(tab);
    if (loadSampleJob) {
      setAutoLoadDemoJob(true);
    }
  };

  // Sync Master Resume to localStorage whenever it changes
  const handleUpdateMasterResume = (updated: ResumeProfile) => {
    setMasterResume(updated);
    saveMasterResume(updated);
    showToast('Master resume updated successfully');
  };

  // Sync Applications to localStorage
  const handleSaveApplication = (app: TailoredApplication) => {
    saveApplication(app);
    setApplications(loadApplications());
    showToast(`Saved tailored application for ${app.company}`);
  };

  const handleUpdateApplication = (app: TailoredApplication) => {
    saveApplication(app);
    setApplications(loadApplications());
  };

  const handleDeleteApplication = (id: string) => {
    deleteApplication(id);
    setApplications(loadApplications());
    showToast('Application deleted');
  };

  const handleApplyTailoredToMaster = (app: TailoredApplication) => {
    setMasterResume(app.tailoredResume);
    saveMasterResume(app.tailoredResume);
    showToast(`Master resume updated with ${app.company} tailored version`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="no-print sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  TailorFit
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Resume Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                1-Click Tailored Applications & ATS Optimizer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('tailor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'tailor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              1-Click Tailor
            </button>

            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'master'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderLock className="w-3.5 h-3.5" />
              Master Vault
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'tracker'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Applications
              {applications.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-indigo-300 font-bold">
                  {applications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('optimizer')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'optimizer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              ATS Doctor
            </button>
          </nav>

          {/* Right Header info & quick resume preview button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWelcomeGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
              title="Learn how this app works and where to start"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              title="Preview active master resume"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Preview Master</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'tailor' && (
          <TailorEngine
            masterResume={masterResume}
            onUpdateMasterResume={handleUpdateMasterResume}
            onSaveApplication={handleSaveApplication}
            autoLoadSample={autoLoadDemoJob}
          />
        )}

        {activeTab === 'master' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
            {/* Left side: Editor */}
            <div className="lg:col-span-7 h-full">
              <MasterResumeEditor
                resume={masterResume}
                onChange={handleUpdateMasterResume}
              />
            </div>

            {/* Right side: Live Preview */}
            <div className="lg:col-span-5 h-full hidden lg:block">
              <ResumePreview
                resume={masterResume}
                titleBadge="Master Live Preview"
              />
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <ApplicationsTracker
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            onApplyToMaster={handleApplyTailoredToMaster}
          />
        )}

        {activeTab === 'optimizer' && (
          <ResumeOptimizerDoctor
            masterResume={masterResume}
            onUpdateMasterResume={handleUpdateMasterResume}
          />
        )}
      </main>

      {/* Master Resume Quick Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-800/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Active Master Resume ({masterResume.fullName})
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <ResumePreview resume={masterResume} />
            </div>
          </div>
        </div>
      )}

      {/* First-Time Welcome Guide Modal */}
      <WelcomeGuideModal
        isOpen={showWelcomeGuide}
        onClose={handleCloseWelcome}
        onSelectAction={handleWelcomeSelectAction}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>
          TailorFit Resume Studio • Store your master credentials, tailor applications with 1 click, and optimize for ATS algorithms.
        </p>
      </footer>
    </div>
  );
}
