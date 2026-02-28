"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MatchResult, Priority } from "@/types";

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   "border-l-[#f5c842] shadow-[0_0_12px_rgba(245,200,66,0.1)]",
  medium: "border-l-[#e8ff47] shadow-[0_0_12px_rgba(232,255,71,0.1)]",
  low:    "border-l-[rgba(255,255,255,0.2)]",
};

interface AnalyzeResultProps {
  matchResult: MatchResult;
}

export default function AnalyzeResult({ matchResult }: AnalyzeResultProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (matchResult.overallScore >= 80) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [matchResult.overallScore]);

  const scoreCircumference = 2 * Math.PI * 45; // r=45
  const scoreOffset = scoreCircumference - (matchResult.overallScore / 100) * scoreCircumference;

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  scale: Math.random() * 1.5 + 0.5,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-2 h-2"
                style={{
                  backgroundColor: Math.random() > 0.5 ? "#e8ff47" : "#f5c842",
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Centered Match Score */}
      <div className="flex flex-col items-center justify-center relative py-8">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="80" cy="80" r="45"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6" fill="none"
            />
            <motion.circle
              cx="80" cy="80" r="45"
              stroke="#e8ff47"
              strokeWidth="6" fill="none"
              strokeLinecap="round"
              strokeDasharray={scoreCircumference}
              initial={{ strokeDashoffset: scoreCircumference }}
              animate={{ strokeDashoffset: scoreOffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="drop-shadow-[0_0_12px_rgba(232,255,71,0.6)]"
            />
          </svg>
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-5xl font-extrabold text-white tracking-tighter"
            >
              {matchResult.overallScore}
            </motion.span>
            <span className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Match</span>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps (2 columns) */}
      {(matchResult.strengths?.length > 0 || matchResult.gaps?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {matchResult.strengths?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Strengths</h3>
              {matchResult.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(232,255,71,0.1)]">
                  <span className="text-[#e8ff47] mt-0.5 text-sm">✓</span>
                  <p className="text-[#f0f2ff] text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          )}
          {matchResult.gaps?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Gaps</h3>
              {matchResult.gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(232,255,71,0.1)]">
                  <span className="text-[#f5c842] mt-0.5 text-sm">✗</span>
                  <p className="text-[#f0f2ff] text-sm leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions (Full width, left border) */}
      {matchResult.suggestions?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Suggestions</h3>
          <div className="grid gap-3">
            {matchResult.suggestions.map((s, i) => (
              <div key={i} className={`p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] border-l-[3px] ${PRIORITY_COLOR[s.priority]}`}>
                <p className="text-[#f0f2ff] text-[14px] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Issues (Warning cards with amber border) */}
      {matchResult.atsIssues?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">ATS Issues</h3>
          <div className="grid gap-3">
            {matchResult.atsIssues.map((issue, i) => (
              <div key={i} className="p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] border-l-[3px] border-l-[#f5c842]">
                <p className="text-[#f0f2ff] text-[14px] leading-relaxed">{issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan (2 columns, numbered lists) */}
      {matchResult.actionPlan && (
        <div className="grid md:grid-cols-2 gap-6">
          {matchResult.actionPlan.quickWins?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Quick Wins</h3>
              {matchResult.actionPlan.quickWins.map((w, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(232,255,71,0.1)]">
                  <span className="text-[#e8ff47] font-bold text-sm">{i + 1}.</span>
                  <p className="text-[#f0f2ff] text-sm leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          )}
          {matchResult.actionPlan.longTerm?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">Long-Term</h3>
              {matchResult.actionPlan.longTerm.map((l, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(232,255,71,0.1)]">
                  <span className="text-[#f5c842] font-bold text-sm">{i + 1}.</span>
                  <p className="text-[#f0f2ff] text-sm leading-relaxed">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
