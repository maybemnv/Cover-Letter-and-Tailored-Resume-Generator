"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "Parsing resume...",
  "Extracting keywords...",
  "Matching against JD...",
  "Running ATS check...",
  "Score: 84% ↑",
];

export default function TerminalCard() {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause">("typing");

  useEffect(() => {
    if (phase === "typing") {
      const target = LINES[currentLine];
      if (charIndex < target.length) {
        const t = setTimeout(() => setCharIndex((c) => c + 1), 38);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 700);
        return () => clearTimeout(t);
      }
    } else {
      const nextLine = (currentLine + 1) % LINES.length;
      const isReset = nextLine === 0;
      const t = setTimeout(() => {
        if (isReset) {
          setDisplayed([]);
          setCurrentLine(0);
        } else {
          setDisplayed((d) => [...d, LINES[currentLine]]);
          setCurrentLine(nextLine);
        }
        setCharIndex(0);
        setPhase("typing");
      }, isReset ? 2000 : 400);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, currentLine]);

  const currentText = LINES[currentLine].slice(0, charIndex);
  const isScore = LINES[currentLine].startsWith("Score:");

  return (
    <div className="relative rounded-2xl bg-[#0f1215] border border-[#1e2530] overflow-hidden h-[280px] md:h-[320px]">
      {/* Scanline */}
      <div className="scanline" />

      {/* Header bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1e2530]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#e76f51]/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#e9c46a]/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#2a9d8f]/60" />
        <span className="ml-3 text-[10px] text-[#5a6470]" style={{ fontFamily: "var(--font-dm-mono)" }}>
          resume-ai ~ analyze
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 space-y-2" style={{ fontFamily: "var(--font-dm-mono)" }}>
        <AnimatePresence>
          {displayed.map((line, i) => (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              className="text-sm text-[#2a9d8f]"
            >
              <span className="text-[#5a6470] mr-2">$</span>
              {line}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Currently typing line */}
        <div className={`text-sm flex items-center gap-0.5 ${isScore ? "text-[#e9c46a]" : "text-[#2a9d8f]"}`}>
          <span className="text-[#5a6470] mr-2">$</span>
          <span>{currentText}</span>
          <span className="cursor-blink ml-0.5 w-1.5 h-4 bg-current" />
        </div>

        {/* Score display */}
        {displayed.includes("Score: 84% ↑") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/20"
          >
            <span
              className="text-4xl font-extrabold text-[#2a9d8f]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              84%
            </span>
            <span className="text-xs text-[#5a6470] ml-2" style={{ fontFamily: "var(--font-dm-mono)" }}>
              match score
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
