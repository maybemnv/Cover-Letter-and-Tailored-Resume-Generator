"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  { text: "Parsing resume...",     color: "text-[#e8ff47]" },
  { text: "Extracting keywords...",color: "text-[#e8ff47]" },
  { text: "Matching against JD...",color: "text-[#e8ff47]" },
  { text: "Running ATS check...",  color: "text-[#e8ff47]" },
  { text: "Score: 84% ↑",          color: "text-[#f5c842]" },
];

export default function TerminalCard() {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause">("typing");

  useEffect(() => {
    if (phase === "typing") {
      const target = SEQUENCE[currentLine].text;
      if (charIndex < target.length) {
        const t = setTimeout(() => setCharIndex((c) => c + 1), 30);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 600);
        return () => clearTimeout(t);
      }
    } else {
      const nextLine = (currentLine + 1) % SEQUENCE.length;
      const isReset = nextLine === 0;
      const t = setTimeout(() => {
        if (isReset) {
          setDisplayed([]);
          setCurrentLine(0);
        } else {
          setDisplayed((d) => [...d, SEQUENCE[currentLine].text]);
          setCurrentLine(nextLine);
        }
        setCharIndex(0);
        setPhase("typing");
      }, isReset ? 2000 : 400); // 400ms delay line-by-line
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, currentLine]);

  const current = SEQUENCE[currentLine];
  const currentText = current.text.slice(0, charIndex);

  return (
    <div className="glass-card rounded-[24px] overflow-hidden shadow-[0_0_40px_rgba(232,255,71,0.1)] relative text-left">
      {/* Glossy top highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Terminal Header */}
      <div className="flex items-center gap-1.5 px-5 py-4 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
        <div className="w-3 h-3 rounded-full bg-[#e76f51] shadow-[0_0_8px_#e76f51]" />
        <div className="w-3 h-3 rounded-full bg-[#f5c842] shadow-[0_0_8px_#f5c842]" />
        <div className="w-3 h-3 rounded-full bg-[#e8ff47] shadow-[0_0_8px_#e8ff47]" />
        <span className="ml-4 text-[11px] text-[#6b7280] font-mono tracking-widest">
          resume-ai ~ analyze
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-6 md:p-8 space-y-3 font-mono min-h-[240px]">
        <AnimatePresence>
          {displayed.map((line, i) => (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-[13px] md:text-sm text-[#e8ff47]"
            >
              <span className="text-[#374151] mr-3">$</span>
              {line}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current typing line */}
        <div className={`text-[13px] md:text-sm flex items-center gap-0.5 ${current.color}`}>
          <span className="text-[#374151] mr-3">$</span>
          <span>{currentText}</span>
          <span className="cursor-blink ml-1 w-[2px] h-4 bg-current" />
        </div>

        {/* Score result */}
        {displayed.includes("Score: 84% ↑") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-baseline gap-4 p-4 rounded-xl bg-[rgba(232,255,71,0.1)] border border-[rgba(232,255,71,0.2)]"
          >
            <span className="font-sans text-5xl font-extrabold text-[#e8ff47] tracking-tight">84%</span>
            <div className="space-y-1">
              <p className="font-mono text-[11px] font-bold text-[#e8ff47] tracking-widest uppercase">ATS MATCH</p>
              <p className="font-mono text-[10px] text-[#e8ff47]/60 uppercase tracking-widest">Example output</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
