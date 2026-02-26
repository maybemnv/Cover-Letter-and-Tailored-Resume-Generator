"use client";

import { useState } from "react";
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

export default function ActionBar({ onValidationError }: { onValidationError?: () => void }) {
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
          MODE_LABELS[mode]
        )}
      </button>
    </div>
  );
}
