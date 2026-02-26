"use client";

import { useAppStore } from "@/store/appStore";
import type { Mode } from "@/types";

const MODES: { value: Mode; label: string }[] = [
  { value: "analyze",      label: "Analyze Match" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "quick-tips",   label: "Quick Tips" },
  { value: "latex",        label: "LaTeX Resume" },
];

export default function ModeSwitcher() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0a0c10] border border-[#1e2530] shadow-inner mt-2">
      {MODES.map((m) => {
        const isActive = mode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-syne font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isActive
                ? "text-black bg-[#2a9d8f] shadow-[0_0_20px_rgba(42,157,143,0.4)] scale-[1.02]"
                : "text-[#78828f] hover:text-[#f5f5f4] hover:bg-[#12151a]"
            }`}
          >
            <span className="relative z-10">{m.label}</span>
            {isActive && (
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
}
