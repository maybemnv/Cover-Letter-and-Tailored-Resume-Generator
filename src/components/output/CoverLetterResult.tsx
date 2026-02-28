"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CoverLetterResultProps {
  coverLetter: string;
}

export default function CoverLetterResult({ coverLetter }: CoverLetterResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-pulse" />
          <span className="text-[0.7rem] uppercase tracking-[0.08em] text-[#9aa821] font-bold">
            AI-Generated Cover Letter
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:text-[#e8ff47] hover:border-[#e8ff47]/50 transition-all"
        >
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-[#f0f2ff] text-[15px] lg:text-[16px] leading-[2] whitespace-pre-wrap p-6 md:p-8 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] shadow-inner selection:bg-[rgba(232,255,71,0.2)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent rounded-t-xl pointer-events-none" />
        {coverLetter}
      </motion.div>
    </div>
  );
}
