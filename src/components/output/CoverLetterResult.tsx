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
          <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f] animate-pulse" />
          <span className="font-mono text-[10px] text-[#4b5563] uppercase tracking-wider">
            AI-Generated Cover Letter
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#12151a] border border-[#1e2530] text-[#78828f] hover:text-[#2a9d8f] hover:border-[#2a9d8f]/50 transition-all"
        >
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-[#f5f5f4] text-[15px] lg:text-[16px] leading-[2] whitespace-pre-wrap p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#12151a]/50 to-[#0a0c10]/50 border border-[#1e2530] shadow-inner selection:bg-[#2a9d8f]/30 relative"
      >
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#12151a]/50 to-transparent rounded-t-2xl pointer-events-none" />
        {coverLetter}
      </motion.div>
    </div>
  );
}
