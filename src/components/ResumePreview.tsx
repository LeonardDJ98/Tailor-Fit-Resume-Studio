import React, { useState } from 'react';
import { ResumeProfile, BulletDiff } from '../types/resume';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Printer,
  FileText,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeProfile;
  diffs?: BulletDiff[];
  highlightChanges?: boolean;
  onApplyChangesToMaster?: () => void;
  titleBadge?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  diffs = [],
  highlightChanges = false,
  onApplyChangesToMaster,
  titleBadge,
}) => {
  const [theme, setTheme] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let plainText = `${resume.fullName.toUpperCase()}\n`;
    plainText += `${resume.headline}\n`;
    plainText += `${resume.email} | ${resume.phone} | ${resume.location}\n`;
    if (resume.website || resume.linkedin || resume.github) {
      plainText += `${[resume.website, resume.linkedin, resume.github].filter(Boolean).join(' | ')}\n`;
    }
    plainText += `\nSUMMARY\n${resume.summary}\n\n`;

    plainText += `SKILLS\n`;
    resume.skills.forEach((cat) => {
      plainText += `${cat.category}: ${cat.items.join(', ')}\n`;
    });

    plainText += `\nEXPERIENCE\n`;
    resume.experience.forEach((exp) => {
      plainText += `\n${exp.role} - ${exp.company} (${exp.startDate} to ${exp.endDate})\n`;
      exp.bullets.forEach((b) => {
        plainText += `• ${b}\n`;
      });
    });

    if (resume.projects?.length) {
      plainText += `\nPROJECTS\n`;
      resume.projects.forEach((p) => {
        plainText += `\n${p.title}: ${p.description}\n`;
        p.highlights.forEach((h) => {
          plainText += `• ${h}\n`;
        });
      });
    }

    if (resume.education?.length) {
      plainText += `\nEDUCATION\n`;
      resume.education.forEach((edu) => {
        plainText += `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.endDate})\n`;
      });
    }

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find if a bullet has a diff
  const getBulletDiff = (bulletText: string) => {
    if (!diffs || diffs.length === 0) return null;
    return diffs.find((d) => d.tailoredBullet === bulletText || d.originalBullet === bulletText);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Preview Toolbar */}
      <div className="no-print flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Format:
          </span>
          <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setTheme('modern')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'modern'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Modern Tech
            </button>
            <button
              onClick={() => setTheme('classic')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'classic'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive Serif
            </button>
            <button
              onClick={() => setTheme('minimal')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'minimal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clean Minimal
            </button>
          </div>
          {titleBadge && (
            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              {titleBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onApplyChangesToMaster && (
            <button
              onClick={onApplyChangesToMaster}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              title="Apply these optimized bullets and summary back to your master resume"
            >
              <Check className="w-3.5 h-3.5" />
              Apply to Master
            </button>
          )}

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Sheet Container with realistic paper feel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 flex justify-center">
        <div
          id="printable-resume"
          className={`resume-print-sheet w-full max-w-[820px] bg-white text-slate-900 rounded-lg shadow-xl p-8 md:p-12 transition-all ${
            theme === 'classic'
              ? 'font-serif'
              : theme === 'minimal'
              ? 'font-mono text-[13px]'
              : 'font-sans text-[13.5px]'
          }`}
        >
          {/* Header */}
          <header className={`border-b pb-5 mb-5 ${theme === 'minimal' ? 'border-slate-300' : 'border-slate-200'}`}>
            <h1
              className={`text-2xl md:text-3xl font-bold tracking-tight text-slate-900 ${
                theme === 'modern' ? 'text-indigo-950' : ''
              }`}
            >
              {resume.fullName || 'Candidate Name'}
            </h1>
            <p
              className={`text-sm md:text-base font-semibold mt-1 ${
                theme === 'modern' ? 'text-indigo-700' : 'text-slate-700'
              }`}
            >
              {resume.headline || 'Professional Headline'}
            </p>

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
              {resume.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {resume.email}
                </span>
              )}
              {resume.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {resume.phone}
                </span>
              )}
              {resume.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {resume.location}
                </span>
              )}
              {resume.website && (
                <a
                  href={resume.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  {resume.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {resume.linkedin && (
                <a
                  href={resume.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Linkedin className="w-3 h-3" />
                  LinkedIn
                </a>
              )}
              {resume.github && (
                <a
                  href={resume.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          {resume.summary && (
            <section className="mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  theme === 'modern'
                    ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                    : 'text-slate-900 border-b border-slate-300 pb-1'
                }`}
              >
                Executive Summary
              </h2>
              <p
                className={`text-slate-700 leading-relaxed ${
                  highlightChanges ? 'bg-amber-50/60 p-2 rounded border border-amber-200/50' : ''
                }`}
              >
                {resume.summary}
              </p>
            </section>
          )}

          {/* Core Competencies & Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                  theme === 'modern'
                    ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                    : 'text-slate-900 border-b border-slate-300 pb-1'
                }`}
              >
                Core Technical Skills & Expertise
              </h2>
              <div className="space-y-1.5 text-xs">
                {resume.skills.map((skillGroup, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <span className="font-bold text-slate-800 min-w-[150px]">
                      {skillGroup.category}:
                    </span>
                    <span className="text-slate-600 leading-snug">
                      {skillGroup.items.join(' • ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  theme === 'modern'
                    ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                    : 'text-slate-900 border-b border-slate-300 pb-1'
                }`}
              >
                Professional Experience
              </h2>
              <div className="space-y-5">
                {resume.experience.map((exp) => (
                  <div key={exp.id || exp.company} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                        <p className="text-xs font-medium text-slate-700">
                          <span className="font-semibold text-indigo-900">{exp.company}</span>
                          {exp.location ? ` • ${exp.location}` : ''}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono sm:text-right mt-0.5 sm:mt-0">
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>

                    {/* Bullets */}
                    <ul className="mt-2 space-y-1.5 list-disc list-outside ml-4 text-slate-700 leading-relaxed text-xs">
                      {exp.bullets.map((bullet, bIdx) => {
                        const diff = getBulletDiff(bullet);
                        const isTailoredChanged = highlightChanges && diff;

                        return (
                          <li
                            key={bIdx}
                            className={`transition-colors ${
                              isTailoredChanged
                                ? 'bg-emerald-50 text-emerald-950 font-medium px-1.5 py-0.5 rounded border border-emerald-200'
                                : ''
                            }`}
                          >
                            <span>{bullet}</span>
                            {isTailoredChanged && diff?.reason && (
                              <span className="no-print block text-[11px] text-emerald-700 font-normal italic mt-0.5">
                                ✨ Tailored: {diff.reason}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Tech stack tags */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-600">Technologies: </span>
                        {exp.techStack.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  theme === 'modern'
                    ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                    : 'text-slate-900 border-b border-slate-300 pb-1'
                }`}
              >
                Key Projects & Impact
              </h2>
              <div className="space-y-3.5">
                {resume.projects.map((proj) => (
                  <div key={proj.id || proj.title}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</h3>
                        {proj.role && <span className="text-xs text-slate-500">({proj.role})</span>}
                      </div>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 hover:underline font-mono"
                        >
                          {proj.url.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                    <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-slate-700">
                      {proj.highlights.map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-600">Built with: </span>
                        {proj.techStack.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Certifications row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {resume.education && resume.education.length > 0 && (
              <section>
                <h2
                  className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                    theme === 'modern'
                      ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                      : 'text-slate-900 border-b border-slate-300 pb-1'
                  }`}
                >
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu) => (
                    <div key={edu.id || edu.institution} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.institution}</div>
                      <div className="text-slate-700">
                        {edu.degree} in {edu.fieldOfStudy}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        Graduated {edu.endDate} {edu.gpaOrHonors ? `• ${edu.gpaOrHonors}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resume.certifications && resume.certifications.length > 0 && (
              <section>
                <h2
                  className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                    theme === 'modern'
                      ? 'text-indigo-900 border-b border-indigo-100 pb-1'
                      : 'text-slate-900 border-b border-slate-300 pb-1'
                  }`}
                >
                  Certifications
                </h2>
                <div className="space-y-2">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id || cert.name} className="text-xs">
                      <div className="font-bold text-slate-900">{cert.name}</div>
                      <div className="text-slate-600">
                        {cert.issuer} • <span className="font-mono text-[11px]">{cert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
