"use client";

import { motion } from "framer-motion";

export default function FloatingLens({ x, y, activeColor }) {
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
