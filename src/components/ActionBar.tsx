"use client";

import { useAppStore } from "@/store/appStore";
import type { AppOutput } from "@/types";

const MODE_CONFIG = {
  analyze: {
    primary: "Analyze Match",
    secondaryA: { label: "Cover Letter", mode: "cover-letter" as const },
    secondaryB: { label: "Quick Tips",   mode: "quick-tips"   as const },
  },
  "cover-letter": {
    primary: "Generate Cover Letter",
    secondaryA: { label: "Analyze Match", mode: "analyze"    as const },
    secondaryB: { label: "Quick Tips",    mode: "quick-tips" as const },
  },
  "quick-tips": {
    primary: "Get Quick Tips",
    secondaryA: { label: "Analyze Match",   mode: "analyze"        as const },
    secondaryB: { label: "Cover Letter",    mode: "cover-letter"   as const },
  },
};

export default function ActionBar() {
  const { mode, setMode, resumeText, jdText, creativity, setOutput, setLoading, setStatus, loading } =
    useAppStore();

  const config = MODE_CONFIG[mode];

  const handleRun = async () => {
    if (!resumeText.trim()) return;
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
        output = { type: "analyze", matchResult: data };
      } else if (mode === "cover-letter") {
        const res = await fetch("/api/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jdText, creativity }),
        });
        const data = await res.json();
        output = { type: "cover-letter", coverLetter: data.coverLetter };
      } else {
        const res = await fetch("/api/quick-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, creativity }),
        });
        const data = await res.json();
        output = { type: "quick-tips", tips: data.tips };
      }

      setOutput(output);
      setStatus("complete");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleRun}
        disabled={loading || !resumeText.trim()}
        className="flex-1 min-w-[180px] py-3 px-6 rounded-xl bg-[#2a9d8f] text-black font-bold text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_24px_rgba(42,157,143,0.45)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {loading ? "Processing..." : config.primary}
      </button>

      <button
        onClick={() => setMode(config.secondaryA.mode)}
        disabled={loading}
        className="py-3 px-5 rounded-xl bg-[#0f1215] border border-[#1e2530] text-[#8a939e] text-sm font-semibold transition-all duration-200 hover:border-[#e9c46a]/50 hover:text-[#e9c46a] disabled:opacity-40"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {config.secondaryA.label}
      </button>

      <button
        onClick={() => setMode(config.secondaryB.mode)}
        disabled={loading}
        className="py-3 px-5 rounded-xl bg-[#0f1215] border border-[#1e2530] text-[#8a939e] text-sm font-semibold transition-all duration-200 hover:border-[#2a9d8f]/50 hover:text-[#2a9d8f] disabled:opacity-40"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {config.secondaryB.label}
      </button>
    </div>
  );
}
