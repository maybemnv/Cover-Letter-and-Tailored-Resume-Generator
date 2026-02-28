"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import TerminalLoader from "@/components/TerminalLoader";
import { analyzeMatch, generateCoverLetter, getQuickTips, generateLatexResume } from "@/lib/api";

const MODE_LABELS: Record<string, string> = {
  analyze:        "Analyze Match",
  "cover-letter": "Generate Cover Letter",
  "quick-tips":   "Get Quick Tips",
  latex:          "Tailor LaTeX Resume",
};

interface ActionBarProps {
  onValidationError?: () => void;
}

export default function ActionBar({ onValidationError }: ActionBarProps) {
  const {
    mode, resumeText, jdText, creativity, loading,
    baseLatexTemplate,
    setOutput, setLoading, setStatus, setLatexOutput,
  } = useAppStore();

  const [showLoader, setShowLoader] = useState(false);

  const handleRun = async () => {
    const needsResume = mode !== "latex";
    const needsJD = mode === "analyze" || mode === "cover-letter";

    if (needsResume && !resumeText.trim()) return onValidationError?.();
    if (needsJD && !jdText.trim()) return onValidationError?.();
    if (mode === "latex" && !jdText.trim()) return onValidationError?.();

    setLoading(true);
    setStatus("processing");
    setShowLoader(true);

    try {
      let output;

      if (mode === "analyze") {
        const matchResult = await analyzeMatch(resumeText, jdText, creativity);
        output = { type: "analyze" as const, matchResult };

      } else if (mode === "cover-letter") {
        const coverLetter = await generateCoverLetter(resumeText, jdText, creativity);
        output = { type: "cover-letter" as const, coverLetter };

      } else if (mode === "quick-tips") {
        const tips = await getQuickTips(resumeText, jdText, creativity);
        output = { type: "quick-tips" as const, tips };

      } else {
        const latexCode = await generateLatexResume(jdText, baseLatexTemplate, creativity);
        setLatexOutput(latexCode);
        output = { type: "latex" as const, latexCode };
      }

      setOutput(output);
      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus("error");
      console.error(msg);
    } finally {
      setLoading(false);
      setTimeout(() => setShowLoader(false), 400);
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading) {
          const needsResume = mode !== "latex";
          const needsJD = mode === "analyze" || mode === "cover-letter";

          if (needsResume && !resumeText.trim()) return onValidationError?.();
          if (needsJD && !jdText.trim()) return onValidationError?.();
          if (mode === "latex" && !jdText.trim()) return onValidationError?.();
          
          handleRun();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, mode, resumeText, jdText, onValidationError]);

  return (
    <div className="pt-2 pb-1 relative">
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TerminalLoader mode={mode} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <button
          onClick={handleRun}
          disabled={loading}
          className="relative overflow-hidden w-full py-5 px-6 rounded-2xl bg-[#2a9d8f] text-[#030405] font-syne font-extrabold text-lg tracking-[0.05em] uppercase transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(42,157,143,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 group"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{MODE_LABELS[mode]}</span>
              <span className="sm:hidden">Run</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded bg-black/20 text-[10px] font-mono font-medium">
                <span className="text-[8px]">⌘</span> Enter
              </kbd>
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="font-mono text-[10px] text-[#4b5563]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#12151a] border border-[#1e2530] text-[#78828f]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[#12151a] border border-[#1e2530] text-[#78828f]">Enter</kbd> to run
        </span>
      </div>
    </div>
  );
}
