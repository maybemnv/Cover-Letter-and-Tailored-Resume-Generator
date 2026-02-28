"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { analyzeMatch } from "@/lib/api";

interface ActionBarProps {
  onValidationError?: () => void;
}

export default function ActionBar({ onValidationError }: ActionBarProps) {
  const {
    resumeText, jdText, creativity, loading,
    updateOutput, setLoading, setStatus,
  } = useAppStore();

  const handleRun = async () => {
    if (!resumeText.trim() || !jdText.trim()) return onValidationError?.();

    setLoading(true);
    setStatus("processing");

    try {
      // Step 1: Always run the initial matching analysis
      const matchResult = await analyzeMatch(resumeText, jdText, creativity);
      updateOutput({ matchResult });
      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus("error");
      console.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading) {
          if (!resumeText.trim() || !jdText.trim()) return onValidationError?.();
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, resumeText, jdText, onValidationError]);

  return (
    <div className="space-y-3">
      <button
        onClick={handleRun}
        disabled={loading}
        className="relative overflow-hidden w-full py-4 px-6 rounded-lg bg-[#e8ff47] text-[#05070f] font-semibold text-[15px] tracking-wide transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#05070f]/10 to-transparent pointer-events-none" />

        {loading ? (
          <>
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            <svg className="animate-spin w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Analyze Resume Match</span>
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
