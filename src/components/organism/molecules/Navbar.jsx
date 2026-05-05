"use client";

import Link from 'next/link';
import Text from '@/components/atoms/Text';
import NavExplorer from './NavExplorer';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-8 flex items-center justify-between">
        <Link href="/" className="pointer-events-auto group flex items-center gap-3">
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