"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import type { Mode } from "@/types";

const MODES: { value: Mode; label: string; icon: string; description: string }[] = [
  { 
    value: "analyze", 
    label: "Analyze", 
    icon: "⬡",
    description: "Get a match score (1-100) with detailed breakdown"
  },
  { 
    value: "cover-letter", 
    label: "Cover Letter", 
    icon: "✉",
    description: "Generate a tailored cover letter matching the JD"
  },
  { 
    value: "quick-tips", 
    label: "Quick Tips", 
    icon: "⚡",
    description: "Get actionable suggestions to improve your resume"
  },
  { 
    value: "latex", 
    label: "LaTeX", 
    icon: "⌘",
    description: "Create an ATS-optimized LaTeX resume"
  },
];

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 min-w-max rounded-lg bg-[#12151a] border border-[#1e2530] shadow-xl z-50"
        >
          <p className="font-mono text-[11px] text-[#78828f] leading-relaxed">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1e2530]" />
        </motion.div>
      )}
    </div>
  );
}

export default function ModeSwitcher() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#0a0c10] border border-[#1e2530] shadow-inner">
      {MODES.map((m) => {
        const isActive = mode === m.value;

        return (
          <Tooltip key={m.value} text={m.description}>
            <button
              onClick={() => setMode(m.value)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-syne font-bold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "text-black bg-[#2a9d8f] shadow-[0_0_20px_rgba(42,157,143,0.4)] scale-[1.02]"
                  : "text-[#78828f] hover:text-[#f5f5f4] hover:bg-[#12151a]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mode"
                  className="absolute inset-0 bg-[#2a9d8f] rounded-xl"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 text-base">{m.icon}</span>
              <span className="relative z-10 hidden sm:inline">{m.label}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
