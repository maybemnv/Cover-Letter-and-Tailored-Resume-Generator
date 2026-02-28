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
  const { setBaseLatexTemplate } = useAppStore();
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    fetch("/api/load-template")
      .then((r) => r.json())
      .then((d) => { if (d.latex) setBaseLatexTemplate(d.latex); })
      .catch(() => {});
  }, [setBaseLatexTemplate]);

  return (
    <>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#ffffff",
            fontFamily: "var(--font-dm-mono-var, 'DM Mono')",
            fontSize: "13px",
          },
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <div className="px-6 lg:px-16 xl:px-24">
          <Hero />
        </div>

        {/* Form Section */}
        <main id="form-section" className="relative z-10 w-full px-6 lg:px-16 xl:px-24 pb-32 flex-1 pt-12 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-6xl mx-auto"
          >
            <div className="flex justify-center -mb-2">
              <StepIndicator />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className={`glass-card rounded-[24px] p-6 lg:p-8 ${validationError ? "ring-1 ring-[#e76f51]/50" : ""}`}>
                <ResumeCard hasError={validationError} />
              </div>
              <div className={`glass-card rounded-[24px] p-6 lg:p-8 ${validationError ? "ring-1 ring-[#e76f51]/50" : ""}`}>
                <JDCard hasError={validationError} />
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 lg:p-8 space-y-6">
              <SettingsRow />
              <div className="h-px w-full bg-[rgba(255,255,255,0.06)]" />
              <ActionBar onValidationError={() => setValidationError(true)} />
            </div>

            <div className="pt-4">
              <OutputPanel />
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
