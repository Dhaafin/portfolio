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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-0 md:pt-6">
      <motion.div 
        layout
        initial={false}
        animate={{
          width: isMobile ? "100%" : (scrolled ? "calc(100% - 2rem)" : "100%"),
          maxWidth: isMobile ? "100%" : (scrolled ? "1100px" : "1400px"),
          height: isMobile ? (scrolled ? "60px" : "72px") : (scrolled ? "64px" : "96px"),
          backgroundColor: scrolled ? "rgba(4, 7, 12, 0.75)" : "rgba(4, 7, 12, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderRadius: isMobile ? "0px" : (scrolled ? "9999px" : "0px"),
          borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
          boxShadow: isMobile ? (scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none") : (scrolled ? "0 20px 40px rgba(0,0,0,0.3)" : "none"),
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 30,
          mass: 1
        }}
        className={`pointer-events-auto flex items-center justify-between border transition-[padding] duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled ? "px-6 sm:px-10" : "px-6 sm:px-12 md:px-24 lg:px-40"
        }`}
      >
        {/* Content (Stable) */}
        <Link
          href="/"
          className="relative z-10 group flex items-center gap-3"
        >
          <AnimatePresence mode="wait">
            {pathname !== "/" && (
              <motion.div
                key="back-arrow"
                initial={{ width: 0, opacity: 0, x: -10 }}
                animate={{ width: "auto", opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden flex items-center"
              >
                <span className="text-accent text-lg font-black shrink-0 whitespace-nowrap mr-1">
                  ←
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <Text className="text-xl font-black lowercase tracking-tighter text-foreground group-hover:opacity-70 transition-opacity duration-500 leading-none flex items-center">
            dhaafin<span className="text-accent">.</span>
          </Text>
        </Link>

        <div className="relative z-10 flex items-center gap-6">
          <motion.a
            href="/cv"
            download="dhaafin-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group"
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-foreground mix-blend-difference shrink-0"
              animate={{ y: [0, 1.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M5 1v5.5M5 6.5L3 4.5M5 6.5L7 4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 9h8" strokeLinecap="round" />
            </motion.svg>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground mix-blend-difference leading-none flex items-center mt-[1px]">
              cv.
            </span>
          </motion.a>

          <NavExplorer />
        </div>
      </motion.div>
    </nav>
  );
}
