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
    <div className="relative rounded-2xl bg-[#0a0c10] border border-[#1e2530] overflow-hidden h-[300px] md:h-[340px]">
      <div className="scanline" />


      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1e2530] bg-[#0f1215]">
        <div className="w-3 h-3 rounded-full bg-[#e76f51]/70 hover:bg-[#e76f51] transition-colors" />
        <div className="w-3 h-3 rounded-full bg-[#e9c46a]/70 hover:bg-[#e9c46a] transition-colors" />
        <div className="w-3 h-3 rounded-full bg-[#2a9d8f]/70 hover:bg-[#2a9d8f] transition-colors" />
        <span className="ml-3 text-[10px] text-[#4b5563] font-mono tracking-widest">
          resume-ai ~ analyze
        </span>

        <span className="ml-auto text-[9px] font-mono font-bold tracking-widest text-[#4b5563] uppercase border border-[#1e2530] px-2 py-0.5 rounded">
          example output
        </span>
      </div>


      <div className="p-5 space-y-2 font-mono">
        <AnimatePresence>
          {displayed.map((line, i) => (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-sm text-[#2a9d8f]"
            >
              <span className="text-[#3a4450] mr-2">$</span>
              {line}
            </motion.div>
          ))}
        </AnimatePresence>


        <div className={`text-sm flex items-center gap-0.5 ${current.color}`}>
          <span className="text-[#3a4450] mr-2">$</span>
          <span>{currentText}</span>
          <span className="cursor-blink ml-0.5 w-[2px] h-4 bg-current" />
        </div>


        {displayed.includes("Score: 84% ↑") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-baseline gap-3 p-4 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/25"
          >
            <span className="font-syne text-5xl font-extrabold text-[#2a9d8f] leading-none">84%</span>
            <div className="space-y-0.5">
              <p className="font-mono text-[11px] font-bold text-[#2a9d8f] leading-none">ATS MATCH</p>
              <p className="font-mono text-[9px] text-[#4b5563] uppercase tracking-widest">Example output</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
