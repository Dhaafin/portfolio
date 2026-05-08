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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div
        className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
          scrolled
            ? "pointer-events-auto mt-4 mx-4 sm:mx-8 px-6 sm:px-10 py-3 rounded-full backdrop-blur-md bg-background/80 border border-foreground/10 shadow-2xl w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-[1400px]"
            : "pointer-events-none w-full max-w-[1400px] px-4 sm:px-12 md:px-24 lg:px-48 py-8"
        }`}
      >
        <Link
          href="/"
          className="pointer-events-auto group flex items-center gap-3"
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
        <div className="pointer-events-auto">
          <NavExplorer />
        </div>
      </div>
    </nav>
  );
}
