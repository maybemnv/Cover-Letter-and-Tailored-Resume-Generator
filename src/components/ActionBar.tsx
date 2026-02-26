"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";

const MODE_LABELS: Record<string, string> = {
  analyze:        "Analyze Match",
  "cover-letter": "Generate Cover Letter",
  "quick-tips":   "Get Quick Tips",
  latex:          "Tailor LaTeX Resume",
};

// Fix #5 — terminal-style processing steps
const PROCESSING_STEPS: Record<string, string[]> = {
  analyze:        ["Parsing resume...", "Extracting keywords...", "Running ATS check...", "Scoring match..."],
  "cover-letter": ["Parsing resume...", "Reading job description...", "Drafting cover letter..."],
  "quick-tips":   ["Parsing resume...", "Identifying gaps...", "Generating tips..."],
  latex:          ["Loading template...", "Reading job description...", "Tailoring LaTeX resume..."],
};

function TerminalLoader({ mode }: { mode: string }) {
  const steps = PROCESSING_STEPS[mode] ?? ["Processing..."];
  const [step, setStep] = useState(0);

  // advance steps on interval
  useState(() => {
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1200);
    return () => clearInterval(iv);
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030405]/80 backdrop-blur-sm rounded-2xl z-20">
      <div className="w-full max-w-xs space-y-2 px-6">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? (i < step ? 0.35 : 1) : 0, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`font-mono text-sm flex items-center gap-2 ${i < step ? "text-[#3a4450]" : "text-[#2a9d8f]"}`}
          >
            <span className="text-[#3a4450]">$</span>
            {i < step ? (
              <span>{s}</span>
            ) : i === step ? (
              <>
                <span>{s}</span>
                <span className="cursor-blink w-[2px] h-4 bg-current inline-block" />
              </>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ActionBar({ onValidationError }: { onValidationError?: () => void }) {
  const {
    mode, resumeText, jdText, creativity, loading,
    baseLatexTemplate,
    setOutput, setLoading, setStatus, setLatexOutput,
  } = useAppStore();

  const [showLoader, setShowLoader] = useState(false);

  const handleRun = async () => {
    // Fix #6 — validation before submit
    const needsResume = mode !== "latex";
    const needsJD = mode === "analyze" || mode === "cover-letter";

    if (needsResume && !resumeText.trim()) {
      onValidationError?.();
      return;
    }
    if (needsJD && !jdText.trim()) {
      onValidationError?.();
      return;
    }
    if (mode === "latex" && !jdText.trim()) {
      onValidationError?.();
      return;
    }

    setLoading(true);
    setStatus("processing");
    setShowLoader(true);

    try {
      let output;

      if (mode === "analyze") {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jdText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "analyze" as const, matchResult: data };

      } else if (mode === "cover-letter") {
        const res = await fetch("/api/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jdText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "cover-letter" as const, coverLetter: data.coverLetter };

      } else if (mode === "quick-tips") {
        const res = await fetch("/api/quick-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "quick-tips" as const, tips: data.tips };

      } else {
        const res = await fetch("/api/latex", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jdText, baseLatex: baseLatexTemplate, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setLatexOutput(data.latexCode);
        output = { type: "latex" as const, latexCode: data.latexCode };
      }

      setOutput(output);
      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // still show error in status
      setStatus("error");
      console.error(msg);
    } finally {
      setLoading(false);
      setTimeout(() => setShowLoader(false), 400);
    }
  };

  return (
    <div className="pt-2 pb-1 relative">
      {/* Fix #5 — terminal loading overlay */}
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
