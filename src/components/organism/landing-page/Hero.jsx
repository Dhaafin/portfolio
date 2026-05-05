"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Configuration ---

const REPEL_BLOBS = [
  { color: "hsla(217,91%,60%,0.2)", size: 600, ox: -250, oy: -200, strength: 300 }, // Blue
  { color: "hsla(322,80%,65%,0.15)", size: 500, ox: 300,  oy: 250,  strength: 350 }, // Pink
];

// --- Animations ---

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } },
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
  const splatX = useTransform(smoothX, [0, 1], ["-10%", "10%"]);
  const splatY = useTransform(smoothY, [0, 1], ["-10%", "10%"]);

  // MotionValues for repulsion blobs
  const blobMotionValues = REPEL_BLOBS.map(b => ({
    x: useMotionValue(b.ox),
    y: useMotionValue(b.oy)
  }));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseX.set(nx);
      mouseY.set(ny);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = e.clientX - rect.left - cx;
      const my = e.clientY - rect.top - cy;

      REPEL_BLOBS.forEach((blob, i) => {
        const dx = blob.ox - mx;
        const dy = blob.oy - my;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const factor = Math.max(0, 1 - dist / blob.strength);
        
        blobMotionValues[i].x.set(blob.ox - (dx / dist) * factor * blob.strength * 0.6);
        blobMotionValues[i].y.set(blob.oy - (dy / dist) * factor * blob.strength * 0.6);
      });
    };

    const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
      REPEL_BLOBS.forEach((blob, i) => {
        blobMotionValues[i].x.set(blob.ox);
        blobMotionValues[i].y.set(blob.oy);
      });
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
      {/* ── LAYER 0: The Color Splat (Vibrant Blobby Splat) ── */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center"
        style={{ x: splatX, y: splatY }}
      >
        <div className="relative w-[700px] h-[700px] opacity-80">
           {/* Blob 1: Blue */}
           <motion.div 
            className="absolute top-[10%] left-[10%] w-[50%] h-[50%] rounded-full" 
            style={{ background: "#3B82F6", filter: "blur(70px)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           />
           {/* Blob 2: Pink */}
           <motion.div 
            className="absolute top-[30%] left-[40%] w-[45%] h-[45%] rounded-full" 
            style={{ background: "#EC4899", filter: "blur(80px)" }}
            animate={{ scale: [1, 1.25, 1], x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
           />
           {/* Blob 3: Purple */}
           <motion.div 
            className="absolute top-[45%] left-[15%] w-[40%] h-[40%] rounded-full" 
            style={{ background: "#8B5CF6", filter: "blur(70px)" }}
            animate={{ scale: [1, 1.2, 1], y: [0, -50, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
           />
        </div>
      </motion.div>

      {/* ── LAYER 1: Repulsion Blobs (GPU Accelerated) ── */}
      {REPEL_BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full pointer-events-none z-0 opacity-20 blur-[100px]"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            translateX: "-50%",
            translateY: "-50%",
            x: blobMotionValues[i].x,
            y: blobMotionValues[i].y,
          }}
        />
      ))}

      {/* ── LAYER 2: Subtle Dot Grid ── */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
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
            onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span 
               className="inline-block"
               style={{
                 background: "linear-gradient(135deg, hsl(210 40% 98%) 40%, hsl(217 91% 75%) 70%, hsl(262 80% 75%) 100%)",
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
        onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-white transition-colors duration-500">
          scroll to explore
        </span>
        <motion.div
          className="w-[1px] h-10 bg-gradient-to-b from-accent/50 to-transparent"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
