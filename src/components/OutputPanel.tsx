"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { generateCoverLetter, getQuickTips, generateLatexResume } from "@/lib/api";
import { TabMode } from "@/types";
import ChatPanel from "./ChatPanel";
import { ScoreSkeleton, CoverLetterSkeleton, TipsSkeleton, CardSkeleton } from "./loading";
import AnalyzeResult from "./output/AnalyzeResult";
import CoverLetterResult from "./output/CoverLetterResult";
import QuickTipsResult from "./output/QuickTipsResult";
import LatexResult from "./output/LatexResult";

const TABS: { id: TabMode; label: string }[] = [
  { id: "analyze", label: "Analysis" },
  { id: "cover-letter", label: "Cover Letter" },
  { id: "quick-tips", label: "Quick Tips" },
  { id: "latex", label: "LaTeX" },
];

export default function OutputPanel() {
  const { output, resumeText, jdText, creativity, baseLatexTemplate, updateOutput } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabMode>("analyze");
  const [loadingTab, setLoadingTab] = useState<TabMode | null>(null);

  const handleTabSwitch = useCallback(async (tab: TabMode) => {
    setActiveTab(tab);
    
    // Check if we already have the data
    if (tab === "analyze" && output?.matchResult) return;
    if (tab === "cover-letter" && output?.coverLetter) return;
    if (tab === "quick-tips" && output?.tips) return;
    if (tab === "latex" && output?.latexCode) return;

    if (!resumeText || !jdText) return;

    // Lazy load the data
    setLoadingTab(tab);
    try {
      if (tab === "cover-letter") {
        const coverLetter = await generateCoverLetter(resumeText, jdText, creativity);
        updateOutput({ coverLetter });
      } else if (tab === "quick-tips") {
        const tips = await getQuickTips(resumeText, jdText, creativity);
        updateOutput({ tips });
      } else if (tab === "latex") {
        const latexCode = await generateLatexResume(jdText, baseLatexTemplate, creativity);
        updateOutput({ latexCode });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load tab content");
    } finally {
      setLoadingTab(null);
    }
  }, [output, resumeText, jdText, creativity, baseLatexTemplate, updateOutput]);

  const renderContent = useMemo(() => {
    if (loadingTab === activeTab) {
      if (activeTab === "analyze") return <ScoreSkeleton />;
      if (activeTab === "cover-letter") return <CoverLetterSkeleton />;
      if (activeTab === "quick-tips") return <TipsSkeleton />;
      if (activeTab === "latex") return <CardSkeleton />;
    }

    if (activeTab === "analyze" && output?.matchResult) {
      return <AnalyzeResult matchResult={output.matchResult} />;
    }
    if (activeTab === "cover-letter" && output?.coverLetter) {
      return <CoverLetterResult coverLetter={output.coverLetter} />;
    }
    if (activeTab === "quick-tips" && output?.tips) {
      return <QuickTipsResult tips={output.tips} />;
    }
    if (activeTab === "latex" && output?.latexCode) {
      return (
        <LatexResult
          latexCode={output.latexCode}
          copied={false}
          onCopy={() => {}}
          onDownload={() => {}}
        />
      );
    }
    return null;
  }, [activeTab, loadingTab, output]);

  if (!output) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Sticky Pill-Style Tab Switcher */}
      <div className="sticky top-6 z-20 flex justify-center">
        <div className="flex items-center gap-1.5 p-1.5 glass-card rounded-full shadow-[0_0_24px_rgba(232,255,71,0.05)]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`relative px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? "text-[#05070f]" : "text-[#6b7280] hover:text-[#f0f2ff]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bubble"
                    className="absolute inset-0 bg-[#e8ff47] rounded-full shadow-[0_0_12px_rgba(232,255,71,0.2)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {renderContent}
          </motion.div>
        </AnimatePresence>
      </div>

      <ChatPanel />
    </motion.div>
  );
}
