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
import StepIndicator from "@/components/StepIndicator";

export default function Home() {
  const { mode, setBaseLatexTemplate } = useAppStore();
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    fetch("/api/load-template")
      .then((r) => r.json())
      .then((d) => { if (d.latex) setBaseLatexTemplate(d.latex); })
      .catch(() => {});
  }, [setBaseLatexTemplate]);

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
            fontFamily: "var(--font-dm-mono-var, 'DM Mono')",
            fontSize: "13px",
          },
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        <Navbar />

        <main className="relative z-10 w-full px-3 sm:px-6 lg:px-12 xl:px-16 pb-24 flex-1">
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 mt-2"
          >
            <StepIndicator mode={mode} />

            <div className={`grid gap-5 ${showResume && showJD ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              {showResume && (
                <div className="glass-panel p-5 sm:p-6 rounded-[2rem]">
                  <ResumeCard hasError={validationError} />
                </div>
              )}
              {showJD && (
                <div className={`glass-panel p-5 sm:p-6 rounded-[2rem] ${validationError ? "ring-1 ring-[#e76f51]/30" : ""}`}>
                  <JDCard hasError={validationError} />
                </div>
              )}
              {mode === "latex" && (
                <div className={`glass-panel p-5 sm:p-6 rounded-[2rem] ${validationError ? "ring-1 ring-[#e76f51]/30" : ""}`}>
                  <JDCard hasError={validationError} />
                </div>
              )}
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-[2rem] space-y-5 relative overflow-hidden">
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
