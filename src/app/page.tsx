"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { useAppStore } from "@/store/appStore";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeCard from "@/components/ResumeCard";
import JDCard from "@/components/JDCard";
import SettingsRow from "@/components/SettingsRow";
import ActionBar from "@/components/ActionBar";
import OutputPanel from "@/components/OutputPanel";

// Fix #3 — step indicator
function StepIndicator({ mode }: { mode: string }) {
  const needsResume = mode !== "latex";
  const needsJD = mode === "analyze" || mode === "cover-letter";

  const steps = [
    needsResume && { n: 1, label: "Paste Resume" },
    (needsJD || mode === "latex") && { n: needsResume ? 2 : 1, label: mode === "latex" ? "Paste Job Description" : "Paste JD" },
    { n: (needsResume ? 1 : 0) + (needsJD || mode === "latex" ? 1 : 0) + 1, label: mode === "analyze" ? "Analyze" : mode === "cover-letter" ? "Generate" : mode === "quick-tips" ? "Get Tips" : "Tailor" },
  ].filter(Boolean) as { n: number; label: string }[];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => (
        <div key={step.n} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#12151a] border border-[#2a9d8f]/50 text-[#2a9d8f] font-mono text-[11px] font-bold flex items-center justify-center">
              {step.n}
            </div>
            <span className="font-mono text-[11px] font-bold text-[#78828f] uppercase tracking-widest whitespace-nowrap">
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-10 md:w-16 h-px bg-[#1e2530] mx-3 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { mode, setBaseLatexTemplate } = useAppStore();
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    fetch("/api/load-template")
      .then((r) => r.json())
      .then((d) => { if (d.latex) setBaseLatexTemplate(d.latex); })
      .catch(() => {});
  }, [setBaseLatexTemplate]);

  // Clear validation error when user changes mode
  useEffect(() => { setValidationError(false); }, [mode]);

  const showJD = mode === "analyze" || mode === "cover-letter";
  const showResume = mode !== "latex";

  return (
    <>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0a0c10",
            border: "1px solid #1e2530",
            color: "#f5f5f4",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "13px",
          },
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        <Navbar />

        <main className="relative z-10 w-full px-4 sm:px-8 lg:px-16 xl:px-24 pb-32 flex-1">
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 mt-4"
          >
            {/* Fix #3 — step indicator */}
            <StepIndicator mode={mode} />

            {/* Input Cards */}
            <div className={`grid gap-6 ${showResume && showJD ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              {showResume && (
                <div className="glass-panel p-6 sm:p-8 rounded-[2rem]">
                  <ResumeCard hasError={validationError} />
                </div>
              )}
              {showJD && (
                <div className={`glass-panel p-6 sm:p-8 rounded-[2rem] ${validationError ? "ring-1 ring-[#e76f51]/30" : ""}`}>
                  <JDCard hasError={validationError} />
                </div>
              )}
              {mode === "latex" && (
                <div className={`glass-panel p-6 sm:p-8 rounded-[2rem] ${validationError ? "ring-1 ring-[#e76f51]/30" : ""}`}>
                  <JDCard hasError={validationError} />
                </div>
              )}
            </div>

            {/* Central control */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a9d8f]/5 blur-3xl rounded-full pointer-events-none" />
              <SettingsRow />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e2530] to-transparent" />
              <ActionBar onValidationError={() => setValidationError(true)} />
            </div>

            <OutputPanel />
          </motion.div>
        </main>
      </div>
    </>
  );
}
