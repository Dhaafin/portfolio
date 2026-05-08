"use client";

import Link from "next/link";
import Text from "@/components/atoms/Text";
import NavExplorer from "./NavExplorer";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div 
        className={`relative w-full max-w-[1400px] flex items-center justify-between px-4 sm:px-12 md:px-24 lg:px-48 transition-all duration-700 ease-[0.23,1,0.32,1] ${
          scrolled ? "py-2 mt-2 h-16" : "py-6 sm:py-8 mt-0"
        }`}
      >
        
        {/* Animated Visual Shell (Background) */}
        <motion.div
          layout
          initial={false}
          animate={{
            width: scrolled ? "calc(100% - 2rem)" : "100%",
            maxWidth: scrolled ? "1100px" : "1400px",
            height: scrolled ? "64px" : "100%",
            backgroundColor: scrolled ? "rgba(4, 7, 12, 0.75)" : "rgba(4, 7, 12, 0)",
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            borderRadius: scrolled ? "9999px" : "0px",
            border: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0)",
            boxShadow: scrolled ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 30,
            mass: 1
          }}
          className="absolute inset-0 z-0 mx-auto"
        />

        {/* Content (Stable) */}
        <Link
          href="/"
          className="relative z-10 pointer-events-auto group flex items-center gap-3"
        >
          <AnimatePresence mode="wait">
            {pathname !== "/" && (
              <motion.span
                key="back-arrow"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-accent text-lg font-black"
              >
                ←
              </motion.span>
            )}
          </AnimatePresence>
          <Text className="text-xl font-black lowercase tracking-tighter text-foreground group-hover:opacity-70 transition-opacity duration-500">
            dhaafin<span className="text-accent">.</span>
          </Text>
        </Link>

        <div className="relative z-10 pointer-events-auto">
          <NavExplorer />
        </div>
      </div>
    </nav>
  );
}
