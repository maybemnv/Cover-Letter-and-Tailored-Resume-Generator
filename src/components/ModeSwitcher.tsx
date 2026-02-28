"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import type { Mode } from "@/types";

const MODES: { value: Mode; label: string; description: string }[] = [
  { value: "analyze",      label: "Analyze",      description: "Get a match score (1–100) with detailed breakdown" },
  { value: "cover-letter", label: "Cover Letter",  description: "Generate a tailored cover letter matching the JD" },
  { value: "quick-tips",  label: "Quick Tips",    description: "Get actionable suggestions to improve your resume" },
  { value: "latex",        label: "LaTeX",         description: "Create an ATS-optimized LaTeX resume" },
];

export default function ModeSwitcher() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.06)]">
      {MODES.map((m) => {
        const isActive = mode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            title={m.description}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              isActive ? "text-[#00c8b4]" : "text-[#a1a1aa] hover:text-[#f0f2ff]"
            }`}
          >
            {m.label}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00c8b4]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
