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
        <span className="font-mono text-[10px] text-[#4b5563] uppercase tracking-wider">
          {tips.length} Actionable Tips
        </span>
      </div>
      
      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="group flex items-start gap-4 p-5 rounded-2xl border border-[#1e2530] bg-[#12151a]/30 hover:bg-[#12151a] hover:border-[#e9c46a]/30 transition-all"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#e9c46a]/20 to-[#e9c46a]/5 border border-[#e9c46a]/30 text-[#e9c46a] font-mono text-xs flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            {i + 1}
          </span>
          <p className="font-syne text-[14px] lg:text-[15px] text-[#f5f5f4] leading-relaxed mt-0.5 group-hover:text-white transition-colors">
            {tip}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
