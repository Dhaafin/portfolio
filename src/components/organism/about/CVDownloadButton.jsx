"use client";

import { motion } from "framer-motion";

export default function CVDownloadButton({ url }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl"
    >
      <a
        href={url}
        download="dhaafin-cv.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between w-full p-6 sm:p-8 border border-white/8 rounded-3xl hover:border-accent/30 hover:bg-accent/3 transition-all duration-500"
      >
        {/* Left — icon + meta */}
        <div className="flex items-center gap-5">
          {/* PDF icon */}
          <div className="relative w-14 h-14 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-accent/10 border border-accent/20 group-hover:bg-accent/15 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M6 2h7l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z"
                  stroke="hsl(217 91% 60%)" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M13 2v5h5" stroke="hsl(217 91% 60%)" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M8 12h6M8 15h4" stroke="hsl(217 91% 60% / 0.5)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors duration-300">
              Curriculum Vitae
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mt-1 group-hover:text-accent/50 transition-colors duration-500">
              PDF · Resume · dhaafin
            </p>
          </div>
        </div>

        {/* Right — download arrow */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 group-hover:text-white/50 transition-colors duration-300">
            Download
          </span>

          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/10 transition-all duration-500 overflow-hidden">
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/30 group-hover:text-accent transition-colors duration-500"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M7 1v8M7 9L4.5 6.5M7 9L9.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 12h12" strokeLinecap="round" />
            </motion.svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
