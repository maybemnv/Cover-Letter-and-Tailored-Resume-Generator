"use client";

import { useEffect } from "react";
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

export default function Home() {
  const { mode, setBaseLatexTemplate } = useAppStore();

  // Load LaTeX template once on mount
  useEffect(() => {
    fetch("/api/load-template")
      .then((r) => r.json())
      .then((d) => { if (d.latex) setBaseLatexTemplate(d.latex); })
      .catch(() => {});
  }, [setBaseLatexTemplate]);

  const showJD = mode === "analyze" || mode === "cover-letter";
  const showResume = mode !== "latex";

  return (
    <>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "#0f1215",
            border: "1px solid #1e2530",
            color: "#eae8e3",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "13px",
          },
        }}
      />

      <div className="relative min-h-screen">
        <Navbar />

        <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          {/* Hero + ModeSwitcher */}
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Input cards */}
            <div className={`grid gap-5 ${showResume && showJD ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {showResume && (
                <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6">
                  <ResumeCard />
                </div>
              )}
              {showJD && (
                <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6">
                  <JDCard />
                </div>
              )}
              {/* LaTeX mode: only JD */}
              {mode === "latex" && (
                <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6">
                  <JDCard />
                </div>
              )}
            </div>

            {/* Settings + CTA */}
            <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-5 space-y-4">
              <SettingsRow />
              <div className="h-px bg-[#1e2530]" />
              <ActionBar />
            </div>

            {/* Output */}
            <OutputPanel />
          </motion.div>
        </main>
      </div>
    </>
  );
}
