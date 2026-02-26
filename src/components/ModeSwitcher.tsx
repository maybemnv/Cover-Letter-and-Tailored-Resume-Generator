"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import type { Mode } from "@/types";


const MODES: { value: Mode; label: string; ready: boolean }[] = [
  { value: "analyze",       label: "Analyze Match",  ready: true },
  { value: "cover-letter",  label: "Cover Letter",   ready: true },
  { value: "quick-tips",    label: "Quick Tips",     ready: true },
  { value: "latex",         label: "LaTeX Resume",   ready: true },
];

export default function ModeSwitcher() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0a0c10] border border-[#1e2530] shadow-inner mt-2">
      {MODES.map((m) => {
        const isActive = mode === m.value;

        if (!m.ready) {
          return (
            <div key={m.value} className="relative px-5 py-2.5 rounded-xl cursor-not-allowed opacity-40 select-none">
              <span className="font-syne text-sm font-bold text-[#4b5563]">{m.label}</span>
              <span className="absolute -top-2 -right-2 font-mono text-[8px] font-bold tracking-wider bg-[#1e2530] text-[#78828f] px-1.5 py-0.5 rounded uppercase border border-[#2a3540]">
                soon
              </span>
            </div>
          );
        }

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
            {isActive && (
              <motion.div
                layoutId="active-mode"
                className="absolute inset-0 bg-[#2a9d8f] rounded-xl"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
