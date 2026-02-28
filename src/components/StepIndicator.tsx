"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function StepIndicator() {
  const { resumeText, jdText, status } = useAppStore();

  const steps = [
    { n: 1, label: "Resume", done: !!resumeText },
    { n: 2, label: "Job Description", done: !!jdText },
    { n: 3, label: "Analyze", active: true },
  ];

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
                    ? "bg-[#e8ff47] text-[#05070f]"
                    : isActive
                    ? "bg-[rgba(255,255,255,0.03)] text-white border border-[rgba(255,255,255,0.08)]"
                    : "bg-[#0c0e18] text-[#374151] border border-[#1a1d2e]"
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
                  <span className="absolute inset-0 rounded-full border border-t-[#e8ff47] border-white/10 animate-spin" />
                )}
              </div>
              <span
                className={`font-mono text-[10px] font-medium uppercase tracking-widest whitespace-nowrap ${
                  isDone
                    ? "text-[#e8ff47]"
                    : isActive
                    ? "text-white"
                    : "text-[#374151]"
                }`}
              >
                {step.label}
              </span>
            </motion.div>

            {idx < steps.length - 1 && (
               <div className="mx-4 w-10 border-b border-dashed border-[rgba(255,255,255,0.08)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
