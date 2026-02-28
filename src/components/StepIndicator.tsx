"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function StepIndicator({ mode }: { mode: string }) {
  const { resumeText, jdText, status } = useAppStore();

  const needsResume = mode !== "latex";
  const needsJD = mode === "analyze" || mode === "cover-letter";

  const steps = [
    needsResume && { n: 1, label: "Resume", done: !!resumeText },
    (needsJD || mode === "latex") && {
      n: needsResume ? 2 : 1,
      label: mode === "latex" ? "Job Description" : "JD",
      done: !!jdText,
    },
    {
      n: (needsResume ? 1 : 0) + (needsJD || mode === "latex" ? 1 : 0) + 1,
      label:
        mode === "analyze" ? "Analyze"
        : mode === "cover-letter" ? "Generate"
        : mode === "quick-tips" ? "Get Tips"
        : "Tailor",
      active: true,
    },
  ].filter(Boolean) as { n: number; label: string; done?: boolean; active?: boolean }[];

  return (
    <div className="flex items-center gap-0 py-2">
      {steps.map((step, idx) => {
        const isActive = step.active;
        const isDone = step.done;

        return (
          <div key={step.n} className="flex items-center">
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-[#2a9d8f] text-[#08090a]"
                    : isActive
                    ? "bg-[#1f2123] text-[#f5f5f4] ring-1 ring-[#f5f5f4]/20"
                    : "bg-[#111213] text-[#374151] ring-1 ring-[#1f2123]"
                }`}
              >
                {isDone ? (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                ) : (
                  step.n
                )}
                {status === "processing" && isActive && (
                  <span className="absolute inset-0 rounded-full border border-[#2a9d8f] border-t-transparent animate-spin" />
                )}
              </div>
              <span
                className={`font-mono text-[10px] font-medium uppercase tracking-widest whitespace-nowrap ${
                  isDone
                    ? "text-[#2a9d8f]"
                    : isActive
                    ? "text-[#f5f5f4]"
                    : "text-[#374151]"
                }`}
              >
                {step.label}
              </span>
            </motion.div>

            {idx < steps.length - 1 && (
              <div className="mx-4 w-10 border-b border-dashed border-[#1f2123]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
