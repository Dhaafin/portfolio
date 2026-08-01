"use client";

import { motion } from "framer-motion";

export default function SuggestedQuestions({ suggestedQuestions, onSelect, loading }) {
  if (!suggestedQuestions || suggestedQuestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2 self-start max-w-[90%] pl-1 shrink-0">
      <span className="text-[9px] text-[#A78BFA]/40 uppercase tracking-[0.25em] font-black pl-0.5">
        suggested telemetry queries
      </span>
      <div className="flex flex-col gap-2 items-start">
        {suggestedQuestions.map((q, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelect(q)}
            disabled={loading}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="text-left px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#A78BFA]/5 hover:border-[#A78BFA]/20 text-white/70 hover:text-[#A78BFA] transition-all duration-300 text-[11px] font-medium tracking-wide focus:outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
