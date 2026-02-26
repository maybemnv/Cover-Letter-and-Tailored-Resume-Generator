"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-14 px-6"
    >
      <p
        className="text-[11px] tracking-[0.2em] text-[#2a9d8f] mb-4 uppercase"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        Resume Intelligence
      </p>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#eae8e3] leading-tight mb-4"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Land the job with{" "}
        <em
          className="not-italic text-[#2a9d8f]"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          AI precision
        </em>
      </h1>
      <p
        className="text-[#5a6470] text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Analyze your resume against any job description, generate tailored cover letters, and get
        actionable tips — all in seconds.
      </p>
    </motion.div>
  );
}
