import { motion } from "framer-motion";
import type { MatchResult, Priority } from "@/types";

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   "bg-[#e76f51] shadow-[0_0_12px_rgba(231,111,81,0.6)]",
  medium: "bg-[#e9c46a] shadow-[0_0_12px_rgba(233,196,106,0.5)]",
  low:    "bg-[#2a9d8f] shadow-[0_0_12px_rgba(42,157,143,0.5)]",
};

interface AnalyzeResultProps {
  matchResult: MatchResult;
  compact?: boolean;
}

export default function AnalyzeResult({ matchResult, compact = false }: AnalyzeResultProps) {
  const scoreSize = compact ? "text-5xl md:text-6xl" : "text-7xl md:text-8xl";
  const spacing = compact ? "space-y-6" : "space-y-10";
  const gapSize = compact ? "gap-4" : "gap-6";

  return (
    <div className={spacing}>
      {/* Score Overview */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
        <div className="flex items-baseline gap-4">
          <span className={`font-syne font-extrabold text-[#2a9d8f] leading-none tracking-tighter drop-shadow-[0_0_32px_rgba(42,157,143,0.3)] ${scoreSize}`}>
            {matchResult.overallScore}
          </span>
          <span className="font-mono text-[#78828f] text-sm uppercase font-bold tracking-widest">
            / 100 <br/> Match
          </span>
        </div>
        <div className="flex-1 space-y-4 pb-2">
          {[
            { label: "Skills",     value: matchResult.skillsScore,     color: "bg-[#2a9d8f]" },
            { label: "Experience", value: matchResult.experienceScore, color: "bg-[#e9c46a]" },
            { label: "Keywords",   value: matchResult.keywordsScore,   color: "bg-[#e76f51]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between font-mono text-[11px] font-bold uppercase tracking-widest">
                <span className="text-[#78828f]">{label}</span>
                <span className="text-[#f5f5f4]">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1e2530] overflow-hidden shadow-inner">
                <motion.div 
                  className={`h-full rounded-full bar-fill ${color} opacity-90`} 
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Gaps */}
      {(matchResult.strengths?.length > 0 || matchResult.gaps?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {matchResult.strengths?.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#2a9d8f] uppercase">Strengths</p>
              {matchResult.strengths.map((s, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-[#2a9d8f]/15 bg-[#2a9d8f]/5"
                >
                  <span className="text-[#2a9d8f] mt-0.5">•</span>
                  <p className="font-mono text-sm text-[#f5f5f4] leading-relaxed">{s}</p>
                </motion.div>
              ))}
            </div>
          )}
          {matchResult.gaps?.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#e76f51] uppercase">Gaps</p>
              {matchResult.gaps.map((g, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e76f51]/15 bg-[#e76f51]/5"
                >
                  <span className="text-[#e76f51] mt-0.5">•</span>
                  <p className="font-mono text-sm text-[#f5f5f4] leading-relaxed">{g}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {matchResult.suggestions?.length > 0 && (
        <div className="space-y-4">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">Suggestions</p>
          <div className="grid gap-3">
            {matchResult.suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-[#1e2530] bg-[#12151a]/50 hover:bg-[#12151a] hover:border-[#2a9d8f]/40 transition-all group"
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLOR[s.priority]}`} />
                <p className="font-syne text-[14px] text-[#f5f5f4] leading-relaxed group-hover:text-white transition-colors">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Issues */}
      {matchResult.atsIssues?.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#e9c46a] uppercase">ATS Issues</p>
          {matchResult.atsIssues.map((issue, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e9c46a]/15 bg-[#e9c46a]/5"
            >
              <span className="text-[#e9c46a] mt-0.5">!</span>
              <p className="font-mono text-sm text-[#f5f5f4] leading-relaxed">{issue}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Plan */}
      {matchResult.actionPlan && (
        <div className="grid md:grid-cols-2 gap-4">
          {matchResult.actionPlan.quickWins?.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#2a9d8f] uppercase">Quick Wins</p>
              {matchResult.actionPlan.quickWins.map((w, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-[#1e2530] bg-[#12151a]/50"
                >
                  <span className="font-mono text-[#2a9d8f] font-bold text-sm">{i + 1}.</span>
                  <p className="font-mono text-sm text-[#f5f5f4] leading-relaxed">{w}</p>
                </motion.div>
              ))}
            </div>
          )}
          {matchResult.actionPlan.longTerm?.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#e9c46a] uppercase">Long-Term</p>
              {matchResult.actionPlan.longTerm.map((l, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-[#1e2530] bg-[#12151a]/50"
                >
                  <span className="font-mono text-[#e9c46a] font-bold text-sm">{i + 1}.</span>
                  <p className="font-mono text-sm text-[#f5f5f4] leading-relaxed">{l}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Missing Keywords */}
      {matchResult.missingKeywords?.length > 0 && (
        <div className="space-y-4">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">Missing Keywords</p>
          <div className="flex flex-wrap gap-2">
            {matchResult.missingKeywords.map((kw, i) => (
              <motion.span 
                key={kw}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[#1e2530]/40 border border-[#1e2530] text-[#8a939e] hover:border-[#2a9d8f]/30 hover:text-[#2a9d8f] transition-all cursor-default"
              >
                {kw}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
