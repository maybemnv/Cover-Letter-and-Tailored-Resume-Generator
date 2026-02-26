"use client";

import { motion } from "framer-motion";
import ModeSwitcher from "./ModeSwitcher";
import TerminalCard from "./TerminalCard";

export default function Hero() {
  return (
    <section className="relative z-10 px-4 pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow for hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2a9d8f] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Left — headline + subtitle + switcher */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 lg:pr-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2a9d8f]/30 bg-[#2a9d8f]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f] animate-pulse" />
              <p className="font-mono text-[10px] tracking-[0.25em] text-[#2a9d8f] uppercase font-bold">
                AI Resume Intelligence
              </p>
            </div>
            
            <h1 className="font-syne text-[2.75rem] md:text-5xl lg:text-[4rem] font-extrabold text-[#f5f5f4] leading-[1.1] tracking-tight">
              Your resume,
              <br />
              <em className="font-serif italic font-normal text-[#e9c46a] pr-2">
                perfectly matched.
              </em>
            </h1>
          </div>

          <p className="font-mono text-[#78828f] text-[15px] leading-[1.8] max-w-lg">
            Paste your resume. Drop a JD. Get a match score, a tailored cover
            letter, and an Overleaf-ready LaTeX file in seconds.
          </p>

          <ModeSwitcher />
        </motion.div>

        {/* Right — terminal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Decorative accents around terminal */}
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#2a9d8f]/30 to-[#e9c46a]/10 rounded-3xl blur opacity-30" />
          <div className="relative glass-panel rounded-2xl p-1 shadow-2xl">
            <TerminalCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
