"use client";

import { motion } from "framer-motion";
import ModeSwitcher from "./ModeSwitcher";
import TerminalCard from "./TerminalCard";

export default function Hero() {
  return (
    <section className="relative z-10 px-4 pt-10 pb-12 md:pt-14 md:pb-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[55fr_45fr] gap-10 items-center">
        {/* Left — headline + subtitle + switcher */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <p
              className="text-[11px] tracking-[0.22em] text-[#2a9d8f] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              AI Resume Intelligence
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#eae8e3] leading-[1.12]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Your resume,
              <br />
              <em
                className="not-italic text-[#e9c46a]"
                style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
              >
                perfectly matched.
              </em>
            </h1>
          </div>

          <p
            className="text-[#5a6470] text-sm leading-[1.8] max-w-md"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Paste your resume. Drop a JD. Get a match score, a tailored cover
            letter, and an Overleaf-ready LaTeX file in seconds.
          </p>

          <ModeSwitcher />
        </motion.div>

        {/* Right — terminal card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <TerminalCard />
        </motion.div>
      </div>
    </section>
  );
}
