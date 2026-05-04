"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Stagger container
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
};

// Floating tags data
const tags = [
  { label: "full-stack.",     color: "#A78BFA", x: "-22%", y: "20%",  delay: 0.6 },
  { label: "problem solver.", color: "#F472B6", x: "-18%", y: "72%",  delay: 1.1 },
];

// Repulsion blob config — anchor offsets from center in px
const repelBlobs = [
  { color: "hsla(322,80%,65%,0.15)", size: 500, ox: -200, oy: -200, strength: 260 }, // pink top-left
  { color: "hsla(160,70%,50%,0.15)", size: 500, ox: 200,  oy: 200,  strength: 280 }, // teal bottom-right
  { color: "hsla(262,80%,65%,0.10)", size: 400, ox: 200,  oy: -180, strength: 220 }, // purple top-right
  { color: "hsla(40,90%,60%,0.08)",  size: 350, ox: -180, oy: 160,  strength: 200 }, // amber bottom-left
];

const Hero = ({ onOpenExplorer }) => {
  const containerRef = useRef(null);

  // Normalised [0,1] mouse position for the cursor blob
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // Spring-lagged cursor blob
  const springCfg = { stiffness: 60, damping: 22, mass: 1.2 };
  const blobSpringX = useSpring(rawX, springCfg);
  const blobSpringY = useSpring(rawY, springCfg);

  // Container size for pixel-space transform
  const [size, setSize] = useState({ w: 1440, h: 900 });

  // Convert spring 0-1 to pixel offset from center
  const blobX = useTransform(blobSpringX, [0, 1], [-size.w / 2, size.w / 2]);
  const blobY = useTransform(blobSpringY, [0, 1], [-size.h / 2, size.h / 2]);

  // Dynamic positions for repelled blobs
  const [repelPos, setRepelPos] = useState(() =>
    repelBlobs.map((b) => ({ x: b.ox, y: b.oy }))
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Capture container dimensions for transform range
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Cursor blob follows mouse in [0,1] space
      rawX.set((e.clientX - rect.left) / rect.width);
      rawY.set((e.clientY - rect.top) / rect.height);

      // Repulsion: push each blob away from cursor
      const mx = e.clientX - cx;
      const my = e.clientY - cy;

      setRepelPos(
        repelBlobs.map((b) => {
          const dx = b.ox - mx;
          const dy = b.oy - my;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const factor = Math.max(0, 1 - dist / b.strength);
          return {
            x: b.ox - (dx / dist) * factor * b.strength * 0.65,
            y: b.oy - (dy / dist) * factor * b.strength * 0.65,
          };
        })
      );
    };

    const handleLeave = () => {
      rawX.set(0.5);
      rawY.set(0.5);
      setRepelPos(repelBlobs.map((b) => ({ x: b.ox, y: b.oy })));
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      ro.disconnect();
    };
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* ── Cursor-following color splat ── */}
      <motion.div
        className="absolute pointer-events-none -z-10 rounded-full blur-[110px]"
        style={{
          width: 580,
          height: 580,
          background:
            "radial-gradient(circle at center, hsla(217,91%,60%,0.20) 0%, hsla(322,80%,65%,0.12) 50%, transparent 70%)",
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
          x: blobX,
          y: blobY,
        }}
      />

      {/* ── Repelling aurora blobs (each spring-animated to repelPos) ── */}
      {repelBlobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full pointer-events-none -z-10"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            x: repelPos[i]?.x ?? blob.ox,
            y: repelPos[i]?.y ?? blob.oy,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1.5 }}
        />
      ))}

      {/* ── Subtle dot grid ── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(217 91% 80%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Floating Tags ── */}
      {tags.map((tag) => (
        <motion.div
          key={tag.label}
          className="absolute hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] select-none pointer-events-none"
          style={{
            left: tag.x,
            top: tag.y,
            color: tag.color,
            borderColor: `${tag.color}30`,
            background: `${tag.color}08`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.6, 0.6],
            scale: [0.8, 1, 1],
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: tag.delay, duration: 0.6 },
            scale:   { delay: tag.delay, duration: 0.6 },
            y:       { delay: tag.delay + 0.6, duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tag.color }} />
          {tag.label}
        </motion.div>
      ))}

      {/* ── Main Content ── */}
      <motion.div
        className="flex flex-col items-center gap-6 z-10"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-none cursor-pointer select-none"
            onClick={onOpenExplorer}
            style={{
              background: "linear-gradient(135deg, hsl(210 40% 98%) 40%, hsl(217 91% 75%) 70%, hsl(262 80% 75%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            hello world
            <motion.span
              className="inline-block cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onOpenExplorer(); }}
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(322 80% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 8px hsl(217 91% 60% / 0.3))",
                  "drop-shadow(0 0 24px hsl(217 91% 60% / 0.9)) drop-shadow(0 0 50px hsl(322 80% 65% / 0.4))",
                  "drop-shadow(0 0 8px hsl(217 91% 60% / 0.3))",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
            >
              .
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-muted/60 text-xl font-medium tracking-tight lowercase max-w-md"
        >
          im dhaafin and i like to build random things
          <span style={{ color: "hsl(217 91% 60% / 0.4)" }}>.</span>
        </motion.p>
      </motion.div>

      {/* ── Affordance Hint ── */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
        onClick={onOpenExplorer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <motion.span
          className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted/30 group-hover:text-accent transition-colors select-none"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          scroll to explore.
        </motion.span>
        <motion.div
          className="flex flex-col items-center gap-[2px]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-[1px] h-10"
            style={{ background: "linear-gradient(to bottom, hsl(217 91% 60% / 0.5), transparent)" }}
          />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
            <path d="M1 1L5 5L9 1" stroke="hsl(217 91% 60%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
