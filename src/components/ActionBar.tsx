"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
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

  const handleRun = async () => {
    const needsResume = mode !== "latex";
    const needsJD = mode === "analyze" || mode === "cover-letter";

    if (needsResume && !resumeText.trim()) return onValidationError?.();
    if (needsJD && !jdText.trim()) return onValidationError?.();
    if (mode === "latex" && !jdText.trim()) return onValidationError?.();

    setLoading(true);
    setStatus("processing");

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
    }
  };

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
    <div className="space-y-3">
      <button
        onClick={handleRun}
        disabled={loading}
        className="relative overflow-hidden w-full py-4 px-6 rounded-xl bg-[#00c8b4] text-[#05070f] font-semibold text-[15px] tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,200,180,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#05070f]/10 to-transparent pointer-events-none" />

        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{MODE_LABELS[mode]}</span>
            <span className="sm:hidden">Run</span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/15 text-[10px] font-mono">
              ⌘ Enter
            </kbd>
          </>
        )}
      </button>

      <p className="text-center font-mono text-[10px] text-[#6b7280]">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa]">Ctrl</kbd>
        {" + "}
        <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa]">Enter</kbd>{" "}
        to run
      </p>
    </div>
  );
}
