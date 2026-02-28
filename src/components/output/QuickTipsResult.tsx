"use client";

import { motion } from "framer-motion";

interface QuickTipsResultProps {
  tips: string[];
}

export default function QuickTipsResult({ tips }: QuickTipsResultProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span>
        <span className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">
          {tips.length} Actionable Tips
        </span>
      </div>
      
      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="group flex items-start gap-4 p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#e8ff47]/40 transition-all"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 text-[#e8ff47] font-mono text-xs flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            {i + 1}
          </span>
          <p className="font-syne text-[14px] lg:text-[15px] text-[#f0f2ff] leading-relaxed mt-0.5 group-hover:text-white transition-colors">
            {tip}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
