"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ModeSwitcher from "@/components/ModeSwitcher";
import ResumeCard from "@/components/ResumeCard";
import JDCard from "@/components/JDCard";
import SettingsRow from "@/components/SettingsRow";
import ActionBar from "@/components/ActionBar";
import OutputPanel from "@/components/OutputPanel";
import { useAppStore } from "@/store/appStore";

const workspace = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
};

export default function Home() {
  const mode = useAppStore((s) => s.mode);

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <Hero />

        <motion.div {...workspace} className="space-y-8">
          <ModeSwitcher />

          {/* Input grid */}
          <div className={`grid gap-6 ${mode === "quick-tips" ? "grid-cols-1" : "md:grid-cols-2"}`}>
            <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6">
              <ResumeCard />
            </div>
            {mode !== "quick-tips" && (
              <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6">
                <JDCard />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-5 space-y-5">
            <SettingsRow />
            <div className="h-px bg-[#1e2530]" />
            <ActionBar />
          </div>

          {/* Results */}
          <OutputPanel />
        </motion.div>
      </main>
    </div>
  );
}
