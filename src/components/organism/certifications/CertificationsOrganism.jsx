"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Text from "@/components/atoms/Text";
import FloatingLens from "./molecules/FloatingLens";
import CertRow from "./molecules/CertRow";

export default function CertificationsOrganism({ certifications = [] }) {
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
                fontSize: `clamp(5rem, ${Math.min(20, Math.max(8, 130 / (hoveredCert.issuer_short?.length || 4)))}vw, 18rem)`,
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
              totalCount={certifications.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
