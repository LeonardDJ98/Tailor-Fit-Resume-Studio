import React, { useState } from 'react';
import {
  ResumeProfile,
  TailoredApplication,
  ATSAnalysis,
  BulletDiff,
  CoverLetter,
  ScreeningAnswer,
  InterviewTip,
} from '../types/resume';
import { SAMPLE_JOB_TEMPLATES, JobTemplate } from '../data/sampleResume';
import { ResumePreview } from './ResumePreview';
import {
  Sparkles,
  Zap,
  Target,
  FileCheck2,
  FileText,
  MessageSquareQuote,
  Lightbulb,
  Check,
  Copy,
  Download,
  AlertTriangle,
  ArrowRight,
  Split,
  Layers,
  ChevronRight,
  BookmarkCheck,
  Building,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface TailorEngineProps {
  masterResume: ResumeProfile;
  onUpdateMasterResume: (updatedResume: ResumeProfile) => void;
  onSaveApplication: (application: TailoredApplication) => void;
  autoLoadSample?: boolean;
}

export const TailorEngine: React.FC<TailorEngineProps> = ({
  masterResume,
  onUpdateMasterResume,
  onSaveApplication,
  autoLoadSample = false,
}) => {
  const [jobTitle, setJobTitle] = useState(autoLoadSample ? SAMPLE_JOB_TEMPLATES[0].title : '');
  const [company, setCompany] = useState(autoLoadSample ? SAMPLE_JOB_TEMPLATES[0].company : '');
  const [jobLocation, setJobLocation] = useState(autoLoadSample ? SAMPLE_JOB_TEMPLATES[0].location : '');
  const [jobDescription, setJobDescription] = useState(autoLoadSample ? SAMPLE_JOB_TEMPLATES[0].description : '');

  React.useEffect(() => {
    if (autoLoadSample && !company && !jobDescription) {
      loadTemplate(SAMPLE_JOB_TEMPLATES[0]);
    }
  }, [autoLoadSample]);

  const clearInputs = () => {
    setJobTitle('');
    setCompany('');
    setJobLocation('');
    setJobDescription('');
    setError(null);
  };

  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [currentResult, setCurrentResult] = useState<TailoredApplication | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'resume' | 'diff' | 'cover' | 'qa' | 'ats'>('resume');
  const [copiedCover, setCopiedCover] = useState(false);
  const [appliedToMasterSuccess, setAppliedToMasterSuccess] = useState(false);
  const [savedToTrackerSuccess, setSavedToTrackerSuccess] = useState(false);

  const loadingSteps = [
    'Parsing job description & extracting ATS key competencies...',
    'Evaluating match against candidate credentials...',
    'Rewriting bullet points with quantified impact & target keywords...',
    'Composing bespoke executive cover letter...',
    'Formulating interview screening answers & strategic prep tips...',
  ];

  const loadTemplate = (tmpl: JobTemplate) => {
    setJobTitle(tmpl.title);
    setCompany(tmpl.company);
    setJobLocation(tmpl.location);
    setJobDescription(tmpl.description);
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStep(0);
    setAppliedToMasterSuccess(false);
    setSavedToTrackerSuccess(false);

    // Step simulator for feedback
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch('/api/gemini/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterResume,
          jobTitle,
          company,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to tailor application.');
      }

      const data = await response.json();

      const newApplication: TailoredApplication = {
        id: `app-${Date.now()}`,
        createdAt: new Date().toISOString(),
        jobTitle,
        company,
        jobLocation,
        jobDescription,
        status: 'Saved',
        atsAnalysis: data.atsAnalysis,
        tailoredResume: data.tailoredResume,
        tailoredSummary: data.tailoredSummary,
        bulletDiffs: data.bulletDiffs || [],
        coverLetter: data.coverLetter,
        screeningAnswers: data.screeningAnswers || [],
        interviewPrepTips: data.interviewPrepTips || [],
      };

      setCurrentResult(newApplication);
      setActiveResultTab('resume');
      // Automatically save to local tracker
      onSaveApplication(newApplication);
      setSavedToTrackerSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error tailoring resume');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleApplyToMaster = () => {
    if (!currentResult) return;
    onUpdateMasterResume(currentResult.tailoredResume);
    setAppliedToMasterSuccess(true);
    setTimeout(() => setAppliedToMasterSuccess(false), 3000);
  };

  const handleCopyCoverLetter = () => {
    if (!currentResult) return;
    const { coverLetter } = currentResult;
    const fullText = `${coverLetter.subject}\n\n${coverLetter.salutation}\n\n${coverLetter.body}\n\n${coverLetter.signOff}\n${currentResult.tailoredResume.fullName}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Preset Loaders */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                1-Click Tailored Application & Resume Optimizer
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Paste any job post. Gemini analyzes the role requirements, optimizes your resume bullets to highlight relevant keywords and metrics, creates a tailored cover letter, and generates interview screening QA.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Demo Roles:</span>
            {SAMPLE_JOB_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => loadTemplate(tmpl)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-indigo-900/50 hover:text-indigo-200 text-slate-300 border border-slate-700/80 transition cursor-pointer"
              >
                {tmpl.company}
              </button>
            ))}
            {(company || jobTitle || jobDescription) && (
              <button
                onClick={clearInputs}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
                title="Clear job form"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Google"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Target Job Title
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Location / Arrangement
            </label>
            <input
              type="text"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              placeholder="e.g. San Francisco / Remote"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Job Description Textarea */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Job Description & Qualifications (Paste full text)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            placeholder="Paste complete job requirements, qualifications, and role description..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
          />
        </div>

        {/* Action Button & Error */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Using Master Resume: <strong className="text-white">{masterResume.fullName}</strong> ({masterResume.experience.length} experiences, {masterResume.skills.length} skill groups)
          </div>

          <button
            onClick={handleTailor}
            disabled={loading || !jobDescription.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Tailoring Application...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                1-Click Tailor Application & Optimize Resume
              </>
            )}
          </button>
        </div>

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-5 p-5 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                {loadingSteps[progressStep]}
              </span>
              <span className="text-slate-400 font-mono">
                Step {progressStep + 1} of {loadingSteps.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${((progressStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* RESULTS SUITE */}
      {currentResult && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Top Scorecard & Quick Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Scorecard */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Radial Score Gauge */}
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-950 border-4 border-indigo-500 shadow-inner">
                  <div className="text-center">
                    <span className="text-lg font-black text-white leading-none">
                      {currentResult.atsAnalysis.overallScore}%
                    </span>
                    <span className="block text-[9px] uppercase tracking-wider text-indigo-300 font-semibold">
                      ATS Match
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {company} — {jobTitle}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Skills Match: <strong className="text-indigo-300">{currentResult.atsAnalysis.skillsMatchScore}%</strong> • Experience Alignment: <strong className="text-emerald-300">{currentResult.atsAnalysis.experienceMatchScore}%</strong>
                  </p>
                </div>
              </div>

              {/* Keyword Stats Chips */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  ✓ {currentResult.atsAnalysis.keywordsFound.length} Keywords Matched
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  ⚡ {currentResult.atsAnalysis.keywordsMissing.length} Missing High-Value Terms
                </span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  ✨ {currentResult.bulletDiffs.length} Bullets Tailored
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleApplyToMaster}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition shadow-md ${
                  appliedToMasterSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                }`}
                title="Update your Master Resume with all tailored bullet points & summary"
              >
                {appliedToMasterSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {appliedToMasterSuccess ? 'Master Resume Updated!' : 'Update Master Resume'}
              </button>

              <button
                onClick={() => {
                  onSaveApplication(currentResult);
                  setSavedToTrackerSuccess(true);
                  setTimeout(() => setSavedToTrackerSuccess(false), 2500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" />
                {savedToTrackerSuccess ? 'Saved in Tracker' : 'Save Application'}
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveResultTab('resume')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeResultTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Tailored Resume
            </button>

            <button
              onClick={() => setActiveResultTab('diff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeResultTab === 'diff'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              What Changed ({currentResult.bulletDiffs.length} Bullets)
            </button>

            <button
              onClick={() => setActiveResultTab('ats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeResultTab === 'ats'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              ATS Audit & Keywords
            </button>

            <button
              onClick={() => setActiveResultTab('cover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeResultTab === 'cover'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Tailored Cover Letter
            </button>

            <button
              onClick={() => setActiveResultTab('qa')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeResultTab === 'qa'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              Screening QA & Prep
            </button>
          </div>

          {/* TAB 1: TAILORED RESUME PREVIEW */}
          {activeResultTab === 'resume' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Showing tailored resume optimized for <strong>{company}</strong>. Green highlights denote optimized bullets and keywords.
                </span>
              </div>
              <div className="h-[750px]">
                <ResumePreview
                  resume={currentResult.tailoredResume}
                  diffs={currentResult.bulletDiffs}
                  highlightChanges={true}
                  onApplyChangesToMaster={handleApplyToMaster}
                  titleBadge={`Tailored for ${company}`}
                />
              </div>
            </div>
          )}

          {/* TAB 2: DIFF COMPARISON */}
          {activeResultTab === 'diff' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Split className="w-4 h-4 text-indigo-400" />
                    Resume Optimization Diff
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Side-by-side breakdown showing how each bullet was elevated to align with {company}'s requirements.
                  </p>
                </div>
                <button
                  onClick={handleApplyToMaster}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition self-start"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply All Changes to Master Resume
                </button>
              </div>

              {/* Summary Diff */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  Executive Summary Comparison
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Original Master Summary:
                    </span>
                    <p className="text-slate-400 leading-relaxed">{masterResume.summary}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                    <span className="text-[11px] font-semibold text-indigo-300 block mb-1">
                      ✨ Tailored for {company}:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {currentResult.tailoredSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bullet Diffs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Work Experience Bullet Adjustments ({currentResult.bulletDiffs.length})
                </h4>

                {currentResult.bulletDiffs.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        Adjustment #{idx + 1} {diff.company ? `(${diff.company})` : ''}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {diff.reason}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-red-950/15 border border-red-900/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                          Original
                        </span>
                        <p className="text-slate-300 leading-relaxed">{diff.originalBullet}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-600/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          ✨ Tailored
                        </span>
                        <p className="text-slate-100 font-medium leading-relaxed">
                          {diff.tailoredBullet}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATS AUDIT & KEYWORDS */}
          {activeResultTab === 'ats' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  ATS Optimization & Keyword Audit
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How automated Applicant Tracking Systems and hiring managers score this application against the job description.
                </p>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Matched Core Keywords ({currentResult.atsAnalysis.keywordsFound.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentResult.atsAnalysis.keywordsFound.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-600/30 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing High Priority Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Missing or Low-Density Keywords ({currentResult.atsAnalysis.keywordsMissing.length})
                </span>
                <p className="text-xs text-slate-400">
                  These terms were heavily emphasized in the job description. We injected related keywords into your tailored resume; if you have personal familiarity with them, emphasize them in your interview talking points:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentResult.atsAnalysis.keywordsMissing.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-600/30"
                    >
                      ⚡ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Strengths */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  Identified Strengths for this Role
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentResult.atsAnalysis.strengths.map((str, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Strategic Adjustments */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Strategic Advice & Application Recommendations
                </span>
                <div className="space-y-2">
                  {currentResult.atsAnalysis.recommendedAdjustments.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TAILORED COVER LETTER */}
          {activeResultTab === 'cover' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Bespoke Cover Letter for {company}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Carefully tailored to match the job requirements, company culture, and candidate highlights.
                  </p>
                </div>
                <button
                  onClick={handleCopyCoverLetter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition self-start"
                >
                  {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCover ? 'Copied to Clipboard' : 'Copy Cover Letter'}
                </button>
              </div>

              <div className="bg-white text-slate-900 p-8 md:p-10 rounded-xl shadow-lg font-sans text-xs sm:text-sm leading-relaxed space-y-4 max-w-3xl mx-auto">
                <div className="border-b border-slate-200 pb-3">
                  <div className="font-bold text-slate-900 text-base">
                    {currentResult.tailoredResume.fullName}
                  </div>
                  <div className="text-xs text-slate-600">
                    {currentResult.tailoredResume.email} • {currentResult.tailoredResume.phone} • {currentResult.tailoredResume.location}
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>

                <div className="font-semibold text-slate-800">
                  Subject: {currentResult.coverLetter.subject}
                </div>

                <div className="font-medium text-slate-800">
                  {currentResult.coverLetter.salutation}
                </div>

                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {currentResult.coverLetter.body}
                </div>

                <div className="pt-4">
                  <div className="text-slate-800 font-medium">{currentResult.coverLetter.signOff}</div>
                  <div className="font-bold text-slate-900 mt-1">{currentResult.tailoredResume.fullName}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCREENING QA & INTERVIEW PREP */}
          {activeResultTab === 'qa' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-indigo-400" />
                  Screening Questions & Interview Cheat Sheet
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Anticipated screening questions for {jobTitle} at {company}, with custom answers drawing from your real experience.
                </p>
              </div>

              {/* Questions list */}
              <div className="space-y-4">
                {currentResult.screeningAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-indigo-400 block">
                      Q{idx + 1}: {item.question}
                    </span>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans">
                      <strong className="text-slate-400 block mb-1">Recommended Response:</strong>
                      {item.suggestedAnswer}
                    </div>
                    {item.keyPointsToMention?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        <span className="text-slate-400 font-medium">Key Points to Mention:</span>
                        {item.keyPointsToMention.map((kp, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            • {kp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Strategic Tips */}
              {currentResult.interviewPrepTips?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    Strategic Interview Talking Points
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentResult.interviewPrepTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1"
                      >
                        <span className="font-bold text-indigo-300 block">{tip.category}</span>
                        <p className="text-slate-300 leading-relaxed">{tip.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
