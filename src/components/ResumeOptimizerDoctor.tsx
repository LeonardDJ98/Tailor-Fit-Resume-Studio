import React, { useState } from 'react';
import { ResumeProfile } from '../types/resume';
import { SAMPLE_JOB_TEMPLATES } from '../data/sampleResume';
import {
  Activity,
  Sparkles,
  Check,
  Plus,
  AlertCircle,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ResumeOptimizerDoctorProps {
  masterResume: ResumeProfile;
  onUpdateMasterResume: (updated: ResumeProfile) => void;
}

export const ResumeOptimizerDoctor: React.FC<ResumeOptimizerDoctorProps> = ({
  masterResume,
  onUpdateMasterResume,
}) => {
  const [jobText, setJobText] = useState('');
  const [appliedSuggestions, setAppliedSuggestions] = useState<Record<string, boolean>>({});

  // Compute common high-tech keywords extracted from typical ATS scans
  const candidateAllText = [
    masterResume.headline,
    masterResume.summary,
    ...masterResume.skills.flatMap((s) => s.items),
    ...masterResume.experience.flatMap((e) => [e.company, e.role, ...e.bullets, ...(e.techStack || [])]),
    ...(masterResume.projects || []).flatMap((p) => [p.title, p.description, ...p.highlights, ...(p.techStack || [])]),
  ]
    .join(' ')
    .toLowerCase();

  // Extract frequent technical terms from job text
  const commonTechKeywords = [
    'typescript',
    'javascript',
    'react',
    'next.js',
    'node.js',
    'python',
    'go',
    'golang',
    'graphql',
    'rest api',
    'microservices',
    'docker',
    'kubernetes',
    'aws',
    'gcp',
    'azure',
    'ci/cd',
    'postgresql',
    'redis',
    'kafka',
    'system design',
    'distributed systems',
    'performance',
    'latency',
    'security',
    'rbac',
    'llm',
    'vector',
    'caching',
    'testing',
    'agile',
    'accessibility',
    'wcag',
  ];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  commonTechKeywords.forEach((kw) => {
    const appearsInJob = jobText.toLowerCase().includes(kw);
    if (appearsInJob) {
      if (candidateAllText.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }
  });

  const totalEvaluated = matchedKeywords.length + missingKeywords.length;
  const matchRatio = totalEvaluated > 0 ? Math.round((matchedKeywords.length / totalEvaluated) * 100) : 85;

  const handleAddKeywordToSkills = (keyword: string) => {
    const updated = { ...masterResume };
    const firstGroup = updated.skills[0] || { category: 'Core Skills', items: [] };
    const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);

    if (!firstGroup.items.includes(capitalized)) {
      firstGroup.items.push(capitalized);
      if (!updated.skills[0]) {
        updated.skills.push(firstGroup);
      }
      onUpdateMasterResume(updated);
      setAppliedSuggestions((prev) => ({ ...prev, [keyword]: true }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              ATS Keyword Doctor & Resume Health Check
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Verify how your current Master Resume scores against any job description in real-time. Detect missing keywords and inject them into your resume with one click.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xl font-black text-indigo-400 block leading-tight">
                {jobText.trim() ? `${matchRatio}%` : '—'}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Keyword Density
              </span>
            </div>
          </div>
        </div>

        {/* Job Text Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Benchmark Job Description:
            </label>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium hidden sm:inline">Try Demo:</span>
              {SAMPLE_JOB_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setJobText(tmpl.description)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                >
                  {tmpl.company}
                </button>
              ))}
              {jobText.trim() && (
                <button
                  onClick={() => setJobText('')}
                  className="px-2 py-0.5 rounded bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
            placeholder="Paste target job requirements and qualifications here, or select a demo role above..."
          />
        </div>
      </div>

      {/* Audit Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Matched Keywords */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Detected Matched Keywords ({matchedKeywords.length})
            </h3>
            <span className="text-[11px] text-slate-400">Present in Master Resume</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No exact matches found yet.</span>
            ) : (
              matchedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing / High-Priority Keywords with 1-click adder */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Missing High-Value Keywords ({missingKeywords.length})
            </h3>
            <span className="text-[11px] text-slate-400">Click to add to Master</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The target job description emphasizes these terms. If you possess experience in them, add them to your Master Resume:
          </p>

          <div className="flex flex-wrap gap-2">
            {missingKeywords.length === 0 ? (
              <span className="text-xs text-emerald-400 font-medium">
                🎉 Perfect keyword coverage for this job description!
              </span>
            ) : (
              missingKeywords.map((kw, idx) => {
                const added = appliedSuggestions[kw];
                return (
                  <button
                    key={idx}
                    onClick={() => handleAddKeywordToSkills(kw)}
                    disabled={added}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      added
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-600/30 hover:bg-amber-900/60'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" /> Add "{kw}"
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
