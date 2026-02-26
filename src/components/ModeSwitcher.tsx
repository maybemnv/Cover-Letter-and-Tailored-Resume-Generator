"use client";

import { useAppStore } from "@/store/appStore";
import type { Mode } from "@/types";

const MODES: { value: Mode; label: string }[] = [
  { value: "analyze", label: "Analyze Match" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "quick-tips", label: "Quick Tips" },
];

export default function ModeSwitcher() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0f1215] border border-[#1e2530]">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              mode === m.value
                ? "bg-[#2a9d8f] text-black"
                : "text-[#5a6470] hover:text-[#eae8e3] hover:bg-[#161b20]"
            }`}
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
