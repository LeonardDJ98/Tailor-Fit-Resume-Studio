import React, { useState } from 'react';
import { ResumeProfile } from '../types/resume';
import { FileUp, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedResume: ResumeProfile) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError('Please paste your resume text first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) {
        throw new Error('Unable to parse resume text. Please check the content and try again.');
      }

      const data: ResumeProfile = await res.json();
      if (!data.fullName) {
        throw new Error('Parsed data did not contain valid resume information.');
      }

      onImport(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error parsing resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Import Existing Resume</h3>
              <p className="text-xs text-slate-400">
                Paste raw text from your current PDF, Word doc, or LinkedIn profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="text-xs text-slate-300 leading-relaxed bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Our AI parser extracts your work history, skills, contact info, projects, and education into your structured Master Resume Vault automatically.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Paste Resume Text:
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g.
Jane Doe - Lead Software Architect
jdoe@example.com | San Francisco, CA | linkedin.com/in/janedoe

Summary:
Over 8 years of engineering leadership building scalable cloud microservices...

Experience:
Senior Software Engineer, TechCorp (2021 - Present)
- Led team of 6 engineers...
- Architected data warehouse..."
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={loading || !rawText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Parsing Resume with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Extract into Master Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
