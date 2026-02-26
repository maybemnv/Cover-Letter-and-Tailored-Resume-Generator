import { motion } from "framer-motion";

interface QuickTipsResultProps {
  tips: string[];
}

export default function QuickTipsResult({ tips }: QuickTipsResultProps) {
  return (
    <div className="space-y-4">
      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-5 p-6 rounded-2xl border border-[#1e2530] bg-[#12151a]/30 hover:bg-[#12151a] hover:border-[#e9c46a]/30 transition-all"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e9c46a]/10 border border-[#e9c46a]/30 text-[#e9c46a] font-mono text-sm flex items-center justify-center font-bold">
            {i + 1}
          </span>
          <p className="font-syne text-[15px] text-[#f5f5f4] leading-relaxed mt-0.5">{tip}</p>
        </motion.div>
      ))}
    </div>
  );
}
