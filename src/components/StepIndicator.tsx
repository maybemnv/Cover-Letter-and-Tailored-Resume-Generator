"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function StepIndicator({ mode }: { mode: string }) {
  const { resumeText, jdText, status } = useAppStore();
  
  const needsResume = mode !== "latex";
  const needsJD = mode === "analyze" || mode === "cover-letter";

  const steps = [
    needsResume && { n: 1, label: needsResume ? "Resume" : "JD", done: !!resumeText },
    (needsJD || mode === "latex") && { 
      n: needsResume ? 2 : 1, 
      label: mode === "latex" ? "Job Description" : "JD",
      done: !!jdText 
    },
    { 
      n: (needsResume ? 1 : 0) + (needsJD || mode === "latex" ? 1 : 0) + 1, 
      label: mode === "analyze" ? "Analyze" : mode === "cover-letter" ? "Generate" : mode === "quick-tips" ? "Get Tips" : "Tailor",
      active: true
    },
  ].filter(Boolean) as { n: number; label: string; done?: boolean; active?: boolean }[];

  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, idx) => (
        <div key={step.n} className="flex items-center">
          <motion.div 
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`relative w-7 h-7 rounded-full border font-mono text-[11px] font-bold flex items-center justify-center transition-all duration-300 ${
              step.done || step.active
                ? "border-[#2a9d8f] bg-[#2a9d8f] text-[#030405] shadow-[0_0_12px_rgba(42,157,143,0.4)]"
                : "border-[#1e2530] bg-[#12151a] text-[#4b5563]"
            }`}>
              {step.done ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                step.n
              )}
              {status === "processing" && step.active && (
                <span className="absolute inset-0 rounded-full border-2 border-[#2a9d8f] border-t-transparent animate-spin" />
              )}
            </div>
            <span className={`font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
              step.done || step.active
                ? "text-[#2a9d8f]"
                : "text-[#4b5563]"
            }`}>
              {step.label}
            </span>
          </motion.div>
          {idx < steps.length - 1 && (
            <div className="w-8 md:w-12 h-px bg-[#1e2530] mx-2 shrink-0 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-[#2a9d8f]"
                initial={{ width: "0%" }}
                animate={{ width: step.done ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
