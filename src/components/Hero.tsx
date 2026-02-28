"use client";

import { motion } from "framer-motion";
import ModeSwitcher from "./ModeSwitcher";
import TerminalCard from "./TerminalCard";

export default function Hero() {
  return (
    <section className="relative z-10 pt-8 pb-8 md:pt-10 md:pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[250px] bg-[#2a9d8f] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-5"
        >
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border border-[#2a9d8f]/30 bg-[#2a9d8f]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f] animate-pulse" />
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#2a9d8f] uppercase font-bold">
              AI Resume Intelligence
            </p>
          </div>

          <div className="space-y-1">
            <h1 className="font-syne text-[2rem] lg:text-[2.8rem] font-extrabold text-[#f5f5f4] leading-[1.1] tracking-tight">
              Your resume,
            </h1>
            <h1 className="font-serif italic font-normal text-[2rem] lg:text-[2.8rem] text-[#e9c46a] leading-[1.1]">
              perfectly matched.
            </h1>
          </div>

          <p className="font-mono text-[#78828f] text-[12px] lg:text-[13px] leading-[1.8] max-w-md">
            Paste your resume. Drop a JD. Get a match score, tailored cover letter, and Overleaf-ready LaTeX in seconds.
          </p>

          <ModeSwitcher />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#2a9d8f]/20 to-[#e9c46a]/10 rounded-3xl blur-opacity-40 pointer-events-none" />
          <div className="relative">
            <TerminalCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
