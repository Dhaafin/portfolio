"use client";

import { motion } from "framer-motion";

export default function CVDownloadButton({ url }) {
  return (
    <motion.a
      href={url}
      download="dhaafin-cv.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-4 group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon box */}
      <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-all duration-500">
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/40 group-hover:text-accent transition-colors duration-500"
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M8 3v7M8 10L5.5 7.5M8 10L10.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 13h10" strokeLinecap="round" />
        </motion.svg>
      </div>

      {/* Label */}
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors duration-300">
          Download CV
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 group-hover:text-accent/50 transition-colors duration-500">
          PDF · Resume
        </span>
      </div>

      {/* Arrow */}
      <motion.span
        className="text-white/20 group-hover:text-accent/60 transition-colors duration-300 text-sm"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        ↓
      </motion.span>
    </motion.a>
  );
}
