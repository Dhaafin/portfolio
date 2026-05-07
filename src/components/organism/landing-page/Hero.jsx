"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Configuration ---

// --- Animations ---

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.23, 1, 0.32, 1] },
  },
};

const Hero = () => {
  const containerRef = useRef(null);

  // 1. MOUSE MOTION VALUES (Normalized 0-1)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // 2. SPRING PHYSICS FOR FLUIDITY
  const springConfig = { stiffness: 45, damping: 25, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3. TRANSFORMATIONS
  const splatX = useTransform(smoothX, [0, 1], ["-2%", "2%"]);
  const splatY = useTransform(smoothY, [0, 1], ["-2%", "2%"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseX.set(nx);
      mouseY.set(ny);

    };

    const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-background select-none"
    >
      {/* ── LAYER 2: Subtle Dot Grid ── */}
      <div
        className="absolute inset-0 z-2 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── LAYER 3: Main Content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-4"
        variants={STAGGER}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={FADE_UP}>
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-none cursor-pointer select-none"
            onClick={() => window.lenis?.scrollTo("#explore")}
          >
            <span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, hsl(210 40% 98%) 40%, hsl(217 91% 75%) 70%, hsl(262 80% 75%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              hello world
            </span>
            <motion.span
              className="inline-block text-accent"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              .
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          variants={FADE_UP}
          className="text-muted/60 text-xl font-medium tracking-tight lowercase max-w-md leading-relaxed"
        >
          im dhaafin and i like to build random things
          <span className="text-accent/30">.</span>
        </motion.p>
      </motion.div>

      {/* ── LAYER 4: Scroll Hint ── */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group z-10"
        onClick={() => window.lenis?.scrollTo("#explore")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-white transition-colors duration-500">
          scroll to explore
        </span>
        <motion.div
          className="w-px h-10 bg-linear-to-b from-accent/50 to-transparent"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
