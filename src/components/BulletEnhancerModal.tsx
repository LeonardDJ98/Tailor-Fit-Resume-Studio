import React, { useState } from 'react';
import { BulletEnhancement } from '../types/resume';
import { Sparkles, Check, X, Loader2, ArrowRight } from 'lucide-react';

interface BulletEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  targetRole?: string;
  targetCompany?: string;
  onApply: (newBullet: string) => void;
}

export const BulletEnhancerModal: React.FC<BulletEnhancerModalProps> = ({
  isOpen,
  onClose,
  originalBullet,
  targetRole = 'Senior Software Engineer',
  targetCompany = 'Top Tech Company',
  onApply,
}) => {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<BulletEnhancement[]>([]);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && originalBullet) {
      handleGenerate();
    } else {
      setVariations([]);
      setError(null);
    }
  }, [isOpen, originalBullet]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: originalBullet,
          targetRole,
          targetCompany,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate bullet variations');
      }

      const data = await res.json();
      setVariations(data.variations || []);
    } catch (err: any) {
      setError(err.message || 'Error enhancing bullet');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">AI Bullet Point Enhancer</h3>
              <p className="text-xs text-slate-400">
                Rewriting with Google's X-Y-Z formula: Accomplished [X] by doing [Z], measured by [Y]
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Original bullet box */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Current Bullet
            </span>
            <p className="text-sm text-slate-300 italic">"{originalBullet}"</p>
          </div>

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
              <p className="text-sm">Synthesizing high-impact achievement variations...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleGenerate}
                className="text-xs font-semibold underline text-red-200 ml-4 hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && variations.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Select an enhanced version:
              </span>
              {variations.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    onApply(item.text);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.type}
                    </span>
                    <button className="text-xs font-medium text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                      Use This <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                  <p className="text-sm text-white font-medium leading-relaxed">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-2 italic">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Regenerate Variations
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
