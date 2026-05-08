/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import GraphExplorer from "../landing-page/GraphExplorer";

const overlayVariants = {
  hidden: { clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)", opacity: 1 },
  visible: {
    clipPath: "circle(150% at calc(100% - 3.5rem) 3.5rem)",
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  },
};

export default function NavExplorer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="nav-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-1000 flex flex-col items-center justify-center overflow-hidden bg-background"
        >
          <div className="w-full h-full">
            <GraphExplorer isOverlay={true} onNavigate={() => setIsOpen(false)} />
          </div>

          <motion.p
            className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase font-black text-muted/20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            astral navigation.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        id="nav-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        className="z-60 relative pointer-events-auto"
      >
        <motion.span
          className="text-xs font-bold uppercase tracking-[0.25em] text-foreground mix-blend-difference"
          animate={{ opacity: isOpen ? 0.5 : 1 }}
        >
          {isOpen ? "close." : "explore."}
        </motion.span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
