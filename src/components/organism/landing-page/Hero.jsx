"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Stagger container
const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } },
};

// Silk ease — slow, deliberate entrance
const REVEAL = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
};

// Corner precision bracket
function Bracket({ corner }) {
  const map = {
    tl: "top-6 left-6",
    tr: "top-6 right-6 rotate-90",
    bl: "bottom-6 left-6 -rotate-90",
    br: "bottom-6 right-6 rotate-180",
  };
  return (
    <motion.div
      className={`absolute ${map[corner]} w-7 h-7 pointer-events-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.18 }}
      transition={{ duration: 2, delay: 1.6, ease: "easeOut" }}
    >
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M0 14 L0 0 L14 0" stroke="white" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

const Hero = () => {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const spring = { stiffness: 30, damping: 22, mass: 1.4 };
  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);

  // Parallax layers move at different rates for depth
  const outerX = useTransform(smoothX, [0, 1], ["-2%", "2%"]);
  const outerY = useTransform(smoothY, [0, 1], ["-2%", "2%"]);
  const innerX = useTransform(smoothX, [0, 1], ["1.5%", "-1.5%"]);
  const innerY = useTransform(smoothY, [0, 1], ["1.5%", "-1.5%"]);
  const blobX  = useTransform(smoothX, [0, 1], ["-4%", "4%"]);
  const blobY  = useTransform(smoothY, [0, 1], ["-4%", "4%"]);

  useEffect(() => {
    const el = containerRef.current;
    const onMove = (e) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width);
      mouseY.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

    window.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-background select-none"
    >
      {/* ── ACCESSORY: Accent blob — ambient glow at center ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: blobX, y: blobY }}
      >
        <div
          className="w-[520px] h-[520px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, hsl(217 91% 60%) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ── ACCESSORY: Outer slow-rotating ring ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: outerX, y: outerY }}
      >
        <motion.div
          className="w-[680px] h-[680px] rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.04)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* ── ACCESSORY: Inner ring, counter-rotating with accent dot ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ x: innerX, y: innerY }}
      >
        <motion.div
          className="relative w-[440px] h-[440px] rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        >
          {/* Accent tick at top of inner ring */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(217 91% 60%)", boxShadow: "0 0 6px hsl(217 91% 60%)" }}
          />
          {/* Subtle tick at bottom */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-white/20"
          />
        </motion.div>
      </motion.div>

      {/* ── ACCESSORY: Thin horizontal rule, fades in ── */}
      <motion.div
        className="absolute left-[10%] right-[10%] h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── ACCESSORY: Corner brackets (precision marks) ── */}
      <Bracket corner="tl" />
      <Bracket corner="tr" />
      <Bracket corner="bl" />
      <Bracket corner="br" />

      {/* ── ACCESSORY: Floating accent dots ── */}
      <motion.div
        className="absolute top-[38%] left-[8%] w-1 h-1 rounded-full pointer-events-none"
        style={{ background: "hsl(217 91% 60%)", boxShadow: "0 0 8px hsl(217 91% 60%)" }}
        animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[55%] right-[9%] w-0.5 h-0.5 rounded-full bg-white/25 pointer-events-none"
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-[25%] right-[20%] w-0.5 h-0.5 rounded-full bg-white/15 pointer-events-none"
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* ── ACCESSORY: Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, hsl(222 47% 2% / 0.6) 100%)",
        }}
      />

      {/* ── CONTENT ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-4"
        variants={STAGGER}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow line */}
        <motion.div variants={REVEAL} className="flex items-center gap-3">
          <div className="w-6 h-px" style={{ background: "hsl(217 91% 60% / 0.5)" }} />
          <span
            className="text-[9px] uppercase tracking-[0.45em] font-bold"
            style={{ color: "hsl(215 20% 65% / 0.5)" }}
          >
            portfolio
          </span>
          <div className="w-6 h-px" style={{ background: "hsl(217 91% 60% / 0.5)" }} />
        </motion.div>

        {/* Heading */}
        <motion.div variants={REVEAL}>
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-none cursor-pointer"
            onClick={() => window.lenis?.scrollTo?.("#explore")}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, hsl(210 40% 98%) 35%, hsl(217 91% 78%) 68%, hsl(262 80% 78%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              hello world
            </span>
            <motion.span
              className="inline-block"
              style={{ color: "hsl(217 91% 60%)" }}
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              .
            </motion.span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={REVEAL}
          className="text-lg font-medium tracking-tight lowercase max-w-xs leading-relaxed"
          style={{ color: "hsl(215 20% 65% / 0.55)" }}
        >
          im dhaafin and i like to build random things
          <span style={{ color: "hsl(217 91% 60% / 0.3)" }}>.</span>
        </motion.p>

        {/* Thin vertical divider below tagline */}
        <motion.div
          variants={REVEAL}
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
          }}
        />

        {/* CV download — small, unobtrusive */}
        <motion.a
          variants={REVEAL}
          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/resume.pdf`}
          download="dhaafin-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2"
        >
          <motion.svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white/20 group-hover:text-accent transition-colors duration-400"
            animate={{ y: [0, 1.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M5.5 1v6M5.5 7L3.5 5M5.5 7L7.5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 9.5h9" strokeLinecap="round" />
          </motion.svg>
          <span
            className="text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-400"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            cv
          </span>
        </motion.a>
      </motion.div>

      {/* ── SCROLL HINT ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group z-10"
        onClick={() => window.lenis?.scrollTo?.("#explore")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <span
          className="text-[9px] font-black uppercase tracking-[0.5em] transition-colors duration-500"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          scroll
        </span>
        <motion.div
          className="w-px h-8"
          style={{
            background: "linear-gradient(to bottom, hsl(217 91% 60% / 0.5), transparent)",
          }}
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
