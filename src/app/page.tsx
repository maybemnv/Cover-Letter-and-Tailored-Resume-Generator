"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { useAppStore } from "@/store/appStore";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeCard from "@/components/ResumeCard";
import JDCard from "@/components/JDCard";
import SettingsRow from "@/components/SettingsRow";
import ActionBar from "@/components/ActionBar";
import OutputPanel from "@/components/OutputPanel";
import { useEffect } from "react";

export default function Home() {
  const { mode, setBaseLatexTemplate } = useAppStore();

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

        <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 flex-1">
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 mt-4"
          >
            {/* Input Cards Area */}
            <div className={`grid gap-6 ${showResume && showJD ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              {showResume && (
                <div className="glass-panel p-6 sm:p-8 rounded-[2rem]">
                  <ResumeCard />
                </div>
              )}
              {showJD && (
                <div className="glass-panel p-6 sm:p-8 rounded-[2rem]">
                  <JDCard />
                </div>
              )}
              {mode === "latex" && (
                <div className="glass-panel p-6 sm:p-8 rounded-[2rem]">
                  <JDCard />
                </div>
              )}
            </div>

            {/* Central Control Unit */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a9d8f]/5 blur-3xl rounded-full pointer-events-none" />
              <SettingsRow />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e2530] to-transparent" />
              <ActionBar />
            </div>

            {/* AI Output Result */}
            <OutputPanel />
          </motion.div>
        </main>
      </div>
    </>
  );
}
