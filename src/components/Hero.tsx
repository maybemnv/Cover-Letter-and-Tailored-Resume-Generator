"use client";

import { motion } from "framer-motion";
import TerminalCard from "./TerminalCard";

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Dramatic Radial Glow Blob */}
      <div 
        className="absolute w-[800px] h-[600px] md:w-[1000px] md:h-[800px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(0,200,180,0.15), transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl px-4"
      >
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] shadow-[0_0_12px_rgba(0,200,180,0.08)] backdrop-blur-md">
          <p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.15em] text-[#a1a1aa] uppercase">
            AI Resume Intelligence <span className="text-[#00c8b4] ml-1">✦</span>
          </p>
        </div>

        {/* Headline */}
        <div className="space-y-3 md:space-y-4 max-w-3xl">
          <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight">
            Your resume,{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block text-[#00c8b4]">
              perfectly matched.
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#00c8b4]/60" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2.00038 9.87693C55.0841 -0.56948 144.155 -2.43301 198.053 9.87693" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="font-sans text-[#a1a1aa] text-[15px] sm:text-[17px] leading-[1.6] max-w-[480px]">
          Paste your resume. Drop a JD. Get a match score, tailored cover letter, and Overleaf-ready LaTeX in seconds.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#00c8b4] text-[#05070f] font-semibold text-[15px] sm:text-[16px] tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(0,200,180,0.4)]"
          >
            Analyze Now <span className="group-hover:rotate-12 transition-transform duration-300">✦</span>
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>

        {/* Social Proof */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-[#6b7280]">
          <span className="font-mono text-[11px] uppercase tracking-widest font-medium">
            2,000+ resumes analyzed
          </span>
          <div className="hidden sm:block w-px h-6 bg-[rgba(255,255,255,0.1)]" />
          <div className="flex items-center gap-4 sm:gap-6 opacity-60 grayscale">
            {/* Logos Placeholder SVGs */}
            <svg className="h-4" viewBox="0 0 100 30" fill="currentColor">
              <path d="M10 5L30 15L10 25V5Z" />
              <text x="35" y="20" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Acme</text>
            </svg>
            <svg className="h-4" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="15" cy="15" r="10" />
              <text x="32" y="20" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Globex</text>
            </svg>
            <svg className="h-4" viewBox="0 0 100 30" fill="currentColor">
              <rect x="5" y="5" width="20" height="20" />
              <text x="32" y="20" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Initech</text>
            </svg>
            <svg className="h-4" viewBox="0 0 100 30" fill="currentColor">
              <polygon points="15,5 25,25 5,25" />
              <text x="32" y="20" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Soylent</text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Terminal Preview - Floating Glass Card below Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl mt-16 md:mt-24"
      >
        <TerminalCard />
      </motion.div>
    </section>
  );
}
