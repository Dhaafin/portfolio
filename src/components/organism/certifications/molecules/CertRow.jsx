"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const d = new Date(+year, +month - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function CertRow({ cert, index, onHover, onLeave, isHovered, anyHovered, totalCount }) {
  const rowRef = useRef(null);

  return (
    <motion.div
      ref={rowRef}
      className="relative group"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Top separator — glows on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        animate={{
          background: isHovered
            ? `linear-gradient(90deg, transparent 0%, ${cert.color} 50%, transparent 100%)`
            : "linear-gradient(90deg, transparent 0%, hsla(217,91%,60%,0.1) 50%, transparent 100%)",
          opacity: isHovered ? 1 : anyHovered ? 0.3 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      <Link href={cert.credential_url || "#"} target="_blank" rel="noopener noreferrer">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between py-7 md:py-9 px-0 gap-4 cursor-pointer"
          onMouseEnter={() => onHover(cert)}
          onMouseLeave={onLeave}
          animate={{ opacity: anyHovered && !isHovered ? 0.35 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left: Index + Title */}
          <div className="flex items-start sm:items-center gap-6 md:gap-10 flex-1 min-w-0">
            <motion.span
              className="text-[11px] font-bold tracking-[0.25em] tabular-nums shrink-0 mt-1 sm:mt-0"
              animate={{ color: isHovered ? cert.color : "hsla(215,20%,65%,0.4)" }}
              transition={{ duration: 0.3 }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>

            <div className="min-w-0">
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-black lowercase tracking-tighter leading-tight truncate"
                animate={{ color: isHovered ? cert.color : "hsl(210,40%,98%)" }}
                transition={{ duration: 0.35 }}
              >
                {cert.title.toLowerCase()}
                <motion.span animate={{ opacity: isHovered ? 1 : 0.4 }} transition={{ duration: 0.3 }}>
                  .
                </motion.span>
              </motion.h2>
              <p className="text-xs tracking-[0.25em] uppercase font-semibold text-muted/50 mt-1.5">
                {cert.issuer}
              </p>
            </div>
          </div>

          {/* Right: Skills + Date + Arrow */}
          <div className="flex items-center gap-6 md:gap-10 shrink-0 pl-16 sm:pl-0">
            {/* Skills pills — visible on hover */}
            <AnimatePresence>
              {isHovered && cert.skills && (
                <motion.div
                  className="hidden md:flex items-center gap-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
                      style={{
                        borderColor: `${cert.color}50`,
                        color: cert.color,
                        background: `${cert.color}10`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <span className="text-sm font-semibold text-muted/50 tabular-nums tracking-wide w-[80px] text-right">
              {formatDate(cert.issue_date)}
            </span>

            {/* Arrow */}
            <motion.div
              className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
              animate={{
                borderColor: isHovered ? cert.color : "hsla(217,91%,60%,0.15)",
                background: isHovered ? `${cert.color}15` : "transparent",
                rotate: isHovered ? 45 : 0,
              }}
              transition={{ duration: 0.35 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 10L10 2M10 2H4M10 2V8"
                  stroke={isHovered ? cert.color : "hsl(215,20%,65%)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>

      {/* Bottom separator on last item */}
      {index === totalCount - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, hsla(217,91%,60%,0.1) 50%, transparent 100%)" }}
        />
      )}
    </motion.div>
  );
}
