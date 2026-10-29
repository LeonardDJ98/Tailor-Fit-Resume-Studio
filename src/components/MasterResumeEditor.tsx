import React, { useState } from 'react';
import { ResumeProfile, ExperienceItem, ProjectItem, EducationItem, CertificationItem } from '../types/resume';
import {
  User,
  Briefcase,
  Wrench,
  FolderGit2,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileUp,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
} from 'lucide-react';
import { BulletEnhancerModal } from './BulletEnhancerModal';
import { ResumeImportModal } from './ResumeImportModal';
import { INITIAL_SAMPLE_RESUME } from '../data/sampleResume';
import { exportResumeAsMarkdown } from '../services/storage';

interface MasterResumeEditorProps {
  resume: ResumeProfile;
  onChange: (updated: ResumeProfile) => void;
}

export const MasterResumeEditor: React.FC<MasterResumeEditorProps> = ({
  resume,
  onChange,
}) => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [enhancerModalOpen, setEnhancerModalOpen] = useState(false);
  const [selectedBulletContext, setSelectedBulletContext] = useState<{
    bullet: string;
    expIndex?: number;
    bulletIndex?: number;
  } | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);

  // Field update helpers
  const updateField = (field: keyof ResumeProfile, val: any) => {
    onChange({ ...resume, [field]: val });
  };

  // Skills helpers
  const addSkillCategory = () => {
    const updated = [...resume.skills, { category: 'New Category', items: ['Sample Skill'] }];
    updateField('skills', updated);
  };

  const removeSkillCategory = (idx: number) => {
    const updated = resume.skills.filter((_, i) => i !== idx);
    updateField('skills', updated);
  };

  const updateSkillCategoryName = (idx: number, name: string) => {
    const updated = [...resume.skills];
    updated[idx].category = name;
    updateField('skills', updated);
  };

  const addSkillItem = (catIdx: number, item: string) => {
    if (!item.trim()) return;
    const updated = [...resume.skills];
    if (!updated[catIdx].items.includes(item.trim())) {
      updated[catIdx].items.push(item.trim());
      updateField('skills', updated);
    }
  };

  const removeSkillItem = (catIdx: number, itemIdx: number) => {
    const updated = [...resume.skills];
    updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    updateField('skills', updated);
  };

  // Experience helpers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      role: 'Job Title',
      location: 'City, ST',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: ['Accomplished significant technical milestone by implementing modern infrastructure.'],
      techStack: ['TypeScript', 'React'],
    };
    updateField('experience', [newExp, ...resume.experience]);
  };

  const removeExperience = (idx: number) => {
    const updated = resume.experience.filter((_, i) => i !== idx);
    updateField('experience', updated);
  };

  const updateExperienceField = (idx: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...resume.experience];
    updated[idx] = { ...updated[idx], [field]: val };
    updateField('experience', updated);
  };

  const addBullet = (expIdx: number) => {
    const updated = [...resume.experience];
    updated[expIdx].bullets.push('Led project initiative delivering measurable performance improvements.');
    updateField('experience', updated);
  };

  const updateBullet = (expIdx: number, bulletIdx: number, text: string) => {
    const updated = [...resume.experience];
    updated[expIdx].bullets[bulletIdx] = text;
    updateField('experience', updated);
  };

  const removeBullet = (expIdx: number, bulletIdx: number) => {
    const updated = [...resume.experience];
    updated[expIdx].bullets = updated[expIdx].bullets.filter((_, i) => i !== bulletIdx);
    updateField('experience', updated);
  };

  // Projects helpers
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Project Name',
      description: 'Brief overview of what this application or system delivers.',
      highlights: ['Key architectural achievement or business metric.'],
      techStack: ['React', 'Node.js'],
    };
    updateField('projects', [newProj, ...(resume.projects || [])]);
  };

  const removeProject = (idx: number) => {
    const updated = (resume.projects || []).filter((_, i) => i !== idx);
    updateField('projects', updated);
  };

  // Backup & Restore
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.fullName.replace(/\s+/g, '_')}_Master_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.fullName) {
          onChange(json);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyMarkdown = () => {
    const md = exportResumeAsMarkdown(resume);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleResetSample = () => {
    if (window.confirm('Reset Master Resume to the rich sample template? Any unsaved edits will be replaced.')) {
      onChange(INITIAL_SAMPLE_RESUME);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top action toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Master Resume Vault
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Source of Truth
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition"
          >
            <FileUp className="w-3.5 h-3.5" />
            AI Paste / Import
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedMd ? 'Copied' : 'Markdown'}
          </button>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Download JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
          </label>

          <button
            onClick={handleResetSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title="Reset to sample profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section Accordions / Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {[
            { id: 'personal', label: 'Contact', icon: User },
            { id: 'skills', label: 'Skills', icon: Wrench },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'projects', label: 'Projects', icon: FolderGit2 },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'certifications', label: 'Certifications', icon: Award },
          ].map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* SECTION: PERSONAL & CONTACT */}
        {activeSection === 'personal' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Candidate Profile & Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={resume.headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer | Distributed Systems"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location / Work Authorization</label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Portfolio / Personal Website</label>
                <input
                  type="text"
                  value={resume.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={resume.linkedin || ''}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub / Code Repository</label>
                <input
                  type="text"
                  value={resume.github || ''}
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Executive Summary */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Executive Summary / Professional Bio
                </label>
                <button
                  onClick={() => {
                    setSelectedBulletContext({ bullet: resume.summary });
                    setEnhancerModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Polish Summary
                </button>
              </div>
              <textarea
                value={resume.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* SECTION: SKILLS */}
        {activeSection === 'skills' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo-400" />
                  Skills & Technical Competencies
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Group by category (e.g., Languages, Frameworks, Cloud, Databases). The Tailor Engine uses these for ATS keyword matching.
                </p>
              </div>
              <button
                onClick={addSkillCategory}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {resume.skills.map((cat, catIdx) => (
                <div key={catIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => updateSkillCategoryName(catIdx, e.target.value)}
                      className="bg-transparent border-b border-slate-700 focus:border-indigo-500 text-xs font-bold text-white px-1 py-0.5 focus:outline-none"
                    />
                    <button
                      onClick={() => removeSkillCategory(catIdx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillItem(catIdx, sIdx)}
                          className="text-slate-400 hover:text-red-400 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add skill input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add skill (press Enter)..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillItem(catIdx, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: EXPERIENCE */}
        {activeSection === 'experience' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Work Experience ({resume.experience.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Include quantifiable impact, metrics, and technologies. Use the AI Polish button to rewrite any bullet into the Google X-Y-Z formula.
                </p>
              </div>
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            <div className="space-y-5">
              {resume.experience.map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">
                      Position #{expIdx + 1}
                    </span>
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove Position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperienceField(expIdx, 'company', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperienceField(expIdx, 'role', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperienceField(expIdx, 'location', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Dates</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperienceField(expIdx, 'startDate', e.target.value)}
                          placeholder="2022-01"
                          className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-slate-500">-</span>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperienceField(expIdx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Impact & Achievement Bullets ({exp.bullets.length})
                      </label>
                      <button
                        onClick={() => addBullet(expIdx)}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-indigo-500 text-sm mt-1">•</span>
                        <textarea
                          value={bullet}
                          onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                          rows={2}
                          className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none focus:ring-0 leading-relaxed resize-y"
                        />
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedBulletContext({
                                bullet,
                                expIndex: expIdx,
                                bulletIndex: bIdx,
                              });
                              setEnhancerModalOpen(true);
                            }}
                            className="p-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-medium flex items-center gap-1 transition"
                            title="AI Polish this bullet"
                          >
                            <Sparkles className="w-3 h-3" />
                            AI
                          </button>
                          <button
                            onClick={() => removeBullet(expIdx, bIdx)}
                            className="p-1 text-slate-600 hover:text-red-400 text-xs transition"
                            title="Delete bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Technologies Used (comma-separated)</label>
                    <input
                      type="text"
                      value={(exp.techStack || []).join(', ')}
                      onChange={(e) =>
                        updateExperienceField(
                          expIdx,
                          'techStack',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="React, TypeScript, AWS, Redis..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  Key Projects & Open Source
                </h3>
              </div>
              <button
                onClick={addProject}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {(resume.projects || []).map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...(resume.projects || [])];
                        updated[pIdx].title = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="Project Title"
                      className="bg-transparent text-xs font-bold text-white border-b border-slate-700 px-1 py-0.5 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => removeProject(pIdx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={proj.role || ''}
                      onChange={(e) => {
                        const updated = [...(resume.projects || [])];
                        updated[pIdx].role = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="Role (e.g. Lead Architect)"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={proj.url || ''}
                      onChange={(e) => {
                        const updated = [...(resume.projects || [])];
                        updated[pIdx].url = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="URL (e.g. https://github.com/...)"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...(resume.projects || [])];
                      updated[pIdx].description = e.target.value;
                      updateField('projects', updated);
                    }}
                    rows={2}
                    placeholder="Short description of the project..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: EDUCATION */}
        {activeSection === 'education' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Education
            </h3>
            <div className="space-y-3">
              {(resume.education || []).map((edu, eduIdx) => (
                <div key={edu.id || eduIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...(resume.education || [])];
                        updated[eduIdx].institution = e.target.value;
                        updateField('education', updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Degree & Field</label>
                    <input
                      type="text"
                      value={`${edu.degree} in ${edu.fieldOfStudy}`}
                      onChange={(e) => {
                        const [deg, ...rest] = e.target.value.split(' in ');
                        const updated = [...(resume.education || [])];
                        updated[eduIdx].degree = deg || '';
                        updated[eduIdx].fieldOfStudy = rest.join(' in ') || '';
                        updateField('education', updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: CERTIFICATIONS */}
        {activeSection === 'certifications' && (
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              Certifications & Credentials
            </h3>
            <div className="space-y-3">
              {(resume.certifications || []).map((cert, cIdx) => (
                <div key={cert.id || cIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={cert.name}
                    placeholder="Certification Name"
                    onChange={(e) => {
                      const updated = [...(resume.certifications || [])];
                      updated[cIdx].name = e.target.value;
                      updateField('certifications', updated);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    placeholder="Issuer (e.g. AWS)"
                    onChange={(e) => {
                      const updated = [...(resume.certifications || [])];
                      updated[cIdx].issuer = e.target.value;
                      updateField('certifications', updated);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={cert.date}
                    placeholder="Date (e.g. 2023-08)"
                    onChange={(e) => {
                      const updated = [...(resume.certifications || [])];
                      updated[cIdx].date = e.target.value;
                      updateField('certifications', updated);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ResumeImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={(imported) => onChange(imported)}
      />

      <BulletEnhancerModal
        isOpen={enhancerModalOpen}
        onClose={() => {
          setEnhancerModalOpen(false);
          setSelectedBulletContext(null);
        }}
        originalBullet={selectedBulletContext?.bullet || ''}
        targetRole={resume.headline}
        onApply={(enhancedText) => {
          if (
            selectedBulletContext?.expIndex !== undefined &&
            selectedBulletContext?.bulletIndex !== undefined
          ) {
            updateBullet(
              selectedBulletContext.expIndex,
              selectedBulletContext.bulletIndex,
              enhancedText
            );
          } else {
            updateField('summary', enhancedText);
          }
        }}
      />
    </div>
  );
};
