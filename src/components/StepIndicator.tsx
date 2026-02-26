export default function StepIndicator({ mode }: { mode: string }) {
  const needsResume = mode !== "latex";
  const needsJD = mode === "analyze" || mode === "cover-letter";

  const steps = [
    needsResume && { n: 1, label: "Paste Resume" },
    (needsJD || mode === "latex") && { n: needsResume ? 2 : 1, label: mode === "latex" ? "Paste Job Description" : "Paste JD" },
    { n: (needsResume ? 1 : 0) + (needsJD || mode === "latex" ? 1 : 0) + 1, label: mode === "analyze" ? "Analyze" : mode === "cover-letter" ? "Generate" : mode === "quick-tips" ? "Get Tips" : "Tailor" },
  ].filter(Boolean) as { n: number; label: string }[];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => (
        <div key={step.n} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#12151a] border border-[#2a9d8f]/50 text-[#2a9d8f] font-mono text-[11px] font-bold flex items-center justify-center">
              {step.n}
            </div>
            <span className="font-mono text-[11px] font-bold text-[#78828f] uppercase tracking-widest whitespace-nowrap">
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-10 md:w-16 h-px bg-[#1e2530] mx-3 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
