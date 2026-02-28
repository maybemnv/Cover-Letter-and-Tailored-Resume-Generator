"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  { text: "Parsing resume...",     color: "text-[#2a9d8f]" },
  { text: "Extracting keywords...",color: "text-[#2a9d8f]" },
  { text: "Matching against JD...",color: "text-[#2a9d8f]" },
  { text: "Running ATS check...",  color: "text-[#2a9d8f]" },
  { text: "Score: 84% ↑",          color: "text-[#e9c46a]" },
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
        const t = setTimeout(() => setCharIndex((c) => c + 1), 38);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 700);
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
      }, isReset ? 2500 : 400);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, currentLine]);

  const current = SEQUENCE[currentLine];
  const currentText = current.text.slice(0, charIndex);

  return (
    <div className="relative rounded-3xl bg-[#0a0c10] border border-[#1e2530] overflow-hidden shadow-[0_0_40px_rgba(42,157,143,0.08)]">
      <div className="scanline" />

      {/* Terminal Header */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1e2530] bg-[#0f1215]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#e76f51]/70 hover:bg-[#e76f51] transition-colors" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#e9c46a]/70 hover:bg-[#e9c46a] transition-colors" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#2a9d8f]/70 hover:bg-[#2a9d8f] transition-colors" />
        <span className="ml-3 text-[9px] text-[#4b5563] font-mono tracking-widest">
          resume-ai ~ analyze
        </span>
        <span className="ml-auto text-[8px] font-mono font-bold tracking-widest text-[#4b5563] uppercase border border-[#1e2530] px-2 py-0.5 rounded">
          demo
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 md:p-5 space-y-2 font-mono min-h-[220px] md:min-h-[260px]">
        <AnimatePresence>
          {displayed.map((line, i) => (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-[12px] md:text-sm text-[#2a9d8f]"
            >
              <span className="text-[#3a4450] mr-2">$</span>
              {line}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current typing line */}
        <div className={`text-[12px] md:text-sm flex items-center gap-0.5 ${current.color}`}>
          <span className="text-[#3a4450] mr-2">$</span>
          <span>{currentText}</span>
          <span className="cursor-blink ml-0.5 w-[2px] h-4 bg-current" />
        </div>

        {/* Score result */}
        {displayed.includes("Score: 84% ↑") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-baseline gap-3 p-3 md:p-4 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/25"
          >
            <span className="font-syne text-4xl md:text-5xl font-extrabold text-[#2a9d8f] leading-none">84%</span>
            <div className="space-y-0.5">
              <p className="font-mono text-[10px] md:text-[11px] font-bold text-[#2a9d8f] leading-none">ATS MATCH</p>
              <p className="font-mono text-[8px] md:text-[9px] text-[#4b5563] uppercase tracking-widest">Example output</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
