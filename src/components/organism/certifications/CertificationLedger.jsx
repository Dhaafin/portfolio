"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

// --- Mock Data (Static for design phase) ---
const MOCK_CERTIFICATIONS = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issuer_short: "AWS",
    issue_date: "2025-03",
    credential_url: "#",
    color: "#FF9900",
    skills: ["Cloud Architecture", "EC2", "S3", "IAM", "VPC"],
  },
  {
    id: 2,
    title: "Professional Data Engineer",
    issuer: "Google Cloud",
    issuer_short: "GOOGLE",
    issue_date: "2025-01",
    credential_url: "#",
    color: "#4285F4",
    skills: ["BigQuery", "Dataflow", "Pub/Sub", "ML Pipelines"],
  },
  {
    id: 3,
    title: "Meta Frontend Developer Certificate",
    issuer: "Meta",
    issuer_short: "META",
    issue_date: "2024-11",
    credential_url: "#",
    color: "#0082FB",
    skills: ["React", "JSX", "UX Research", "Figma", "CSS"],
  },
  {
    id: 4,
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    issuer_short: "TENSORFLOW",
    issue_date: "2024-08",
    credential_url: "#",
    color: "#FF6F00",
    skills: ["Neural Networks", "Computer Vision", "NLP", "Keras"],
  },
  {
    id: 5,
    title: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    issuer_short: "CNCF",
    issue_date: "2024-06",
    credential_url: "#",
    color: "#326CE5",
    skills: ["Kubernetes", "Docker", "Container Orchestration", "YAML"],
  },
];

function formatDate(dateStr) {
  const [year, month] = dateStr.split("-");
  const d = new Date(+year, +month - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function FloatingLens({ x, y, activeColor }) {
  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="rounded-full border flex items-center justify-center overflow-hidden"
        animate={{
          width: activeColor ? 200 : 0,
          height: activeColor ? 200 : 0,
          opacity: activeColor ? 1 : 0,
          borderColor: activeColor || "transparent",
        }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        style={{
          background: activeColor
            ? `radial-gradient(circle at center, ${activeColor}18 0%, ${activeColor}04 70%)`
            : "transparent",
          boxShadow: activeColor ? `0 0 60px ${activeColor}22, inset 0 0 30px ${activeColor}11` : "none",
        }}
      >
        {/* Inner crosshair */}
        <div className="absolute w-full h-px" style={{ background: activeColor ? `${activeColor}40` : "transparent" }} />
        <div className="absolute h-full w-px" style={{ background: activeColor ? `${activeColor}40` : "transparent" }} />
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{ scale: activeColor ? [1, 1.3, 1] : 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: activeColor || "transparent" }}
        />
      </motion.div>
    </motion.div>
  );
}

function CertRow({ cert, index, onHover, onLeave, isHovered, anyHovered }) {
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

      <Link href={cert.credential_url} target="_blank" rel="noopener noreferrer">
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
              {isHovered && (
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
      {index === MOCK_CERTIFICATIONS.length - 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, hsla(217,91%,60%,0.1) 50%, transparent 100%)" }}
        />
      )}
    </motion.div>
  );
}

export default function CertificationLedger({ certifications = MOCK_CERTIFICATIONS }) {
  const [hoveredCert, setHoveredCert] = useState(null);

  // Smooth spring-based cursor tracking
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const lensX = useSpring(rawX, { damping: 22, stiffness: 180 });
  const lensY = useSpring(rawY, { damping: 22, stiffness: 180 });

  const handleMouseMove = useCallback(
    (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    },
    [rawX, rawY]
  );

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30" onMouseMove={handleMouseMove}>
      {/* Floating Lens Cursor */}
      <FloatingLens x={lensX} y={lensY} activeColor={hoveredCert?.color || null} />

      {/* Background Echo Text */}
      <AnimatePresence>
        {hoveredCert && (
          <motion.div
            key={`echo-${hoveredCert.id}`}
            className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
            initial={{ opacity: 0, filter: "blur(40px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(40px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Text
              className="font-black uppercase tracking-tighter leading-none text-transparent text-center"
              style={{
                WebkitTextStroke: `1.5px ${hoveredCert.color}22`,
                fontSize: `clamp(5rem, ${Math.min(20, Math.max(8, 130 / hoveredCert.issuer_short.length))}vw, 18rem)`,
                opacity: 0.5,
              }}
            >
              {hoveredCert.issuer_short}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48">

        {/* Page Header */}
        <div className="pt-36 pb-20 md:pb-32 relative">
          {/* Asymmetric Side Line */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-40 bottom-16 w-px bg-linear-to-b from-accent/20 via-white/5 to-transparent hidden md:block" 
          />

          <div className="md:pl-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-6 bg-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
                Verified Credentials
              </span>
            </motion.div>

            <div className="relative">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl md:text-8xl xl:text-[10rem] font-black lowercase tracking-tighter leading-[0.8] text-white/90"
              >
                certifications
                <span className="text-accent drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">.</span>
              </motion.h1>
              
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-[80px] pointer-events-none bg-accent" />
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex items-center gap-6 mt-12"
            >
              <div className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                {String(certifications.length).padStart(2, "0")} Entries Found
              </div>
              <div className="flex-grow max-w-sm h-px bg-white/5 relative overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Ledger */}
        <div className="pb-32">
          {certifications.map((cert, i) => (
            <CertRow
              key={cert.id}
              cert={cert}
              index={i}
              isHovered={hoveredCert?.id === cert.id}
              anyHovered={!!hoveredCert}
              onHover={setHoveredCert}
              onLeave={() => setHoveredCert(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
