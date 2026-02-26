import { useState } from "react";
import { motion } from "framer-motion";

const PROCESSING_STEPS: Record<string, string[]> = {
  analyze:        ["Parsing resume...", "Extracting keywords...", "Running ATS check...", "Scoring match..."],
  "cover-letter": ["Parsing resume...", "Reading job description...", "Drafting cover letter..."],
  "quick-tips":   ["Parsing resume...", "Identifying gaps...", "Generating tips..."],
  latex:          ["Loading template...", "Reading job description...", "Tailoring LaTeX resume..."],
};

export default function TerminalLoader({ mode }: { mode: string }) {
  const steps = PROCESSING_STEPS[mode] ?? ["Processing..."];
  const [step, setStep] = useState(0);

  useState(() => {
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1200);
    return () => clearInterval(iv);
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030405]/80 backdrop-blur-sm rounded-2xl z-20">
      <div className="w-full max-w-xs space-y-2 px-6">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? (i < step ? 0.35 : 1) : 0, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`font-mono text-sm flex items-center gap-2 ${i < step ? "text-[#3a4450]" : "text-[#2a9d8f]"}`}
          >
            <span className="text-[#3a4450]">$</span>
            {i < step ? (
              <span>{s}</span>
            ) : i === step ? (
              <>
                <span>{s}</span>
                <span className="cursor-blink w-[2px] h-4 bg-current inline-block" />
              </>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
