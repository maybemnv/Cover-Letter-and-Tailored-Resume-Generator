"use client";

import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import type { AppOutput } from "@/types";

const MODE_LABELS: Record<string, string> = {
  analyze:       "Analyze Match",
  "cover-letter": "Generate Cover Letter",
  "quick-tips":  "Get Quick Tips",
  latex:         "Tailor LaTeX Resume",
};

export default function ActionBar() {
  const {
    mode, resumeText, jdText, creativity, loading,
    baseLatexTemplate,
    setOutput, setLoading, setStatus, setLatexOutput,
  } = useAppStore();

  const handleRun = async () => {
    if (!resumeText.trim() && mode !== "latex") {
      toast.error("Paste your resume first.");
      return;
    }
    if (mode === "latex" && !baseLatexTemplate) {
      toast.error("LaTeX template not loaded yet. Wait a moment.");
      return;
    }
    if ((mode === "analyze" || mode === "cover-letter") && !jdText.trim()) {
      toast.error("Paste a job description too.");
      return;
    }

    setLoading(true);
    setStatus("processing");

    try {
      let output: AppOutput;

      if (mode === "analyze") {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jdText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "analyze", matchResult: data };

      } else if (mode === "cover-letter") {
        const res = await fetch("/api/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jdText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "cover-letter", coverLetter: data.coverLetter };

      } else if (mode === "quick-tips") {
        const res = await fetch("/api/quick-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        output = { type: "quick-tips", tips: data.tips };

      } else {
        const res = await fetch("/api/latex", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jdText, baseLatex: baseLatexTemplate, creativity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setLatexOutput(data.latexCode);
        output = { type: "latex", latexCode: data.latexCode };
      }

      setOutput(output);
      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2 pb-1">
      <button
        onClick={handleRun}
        disabled={loading}
        className="relative overflow-hidden w-full py-5 px-6 rounded-2xl bg-[#2a9d8f] text-[#030405] font-syne font-extrabold text-lg tracking-[0.05em] uppercase transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(42,157,143,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 group"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5 text-current opacity-70" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </>
        ) : (
          MODE_LABELS[mode]
        )}
      </button>

      {/* Tailwind shimmer keyframes config is needed, but we can do a simple translation without custom config using left */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
