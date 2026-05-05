"use client";

import Link from 'next/link';
import Text from '@/components/atoms/Text';
import NavOverlay from './NavOverlay';
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-8 flex items-center justify-between">
        <Link href="/" className="pointer-events-auto group">
          <Text className="text-xl font-black lowercase tracking-tighter text-foreground group-hover:opacity-70 transition-opacity duration-500">
            dhaafin<span className="text-accent">.</span>
          </Text>
        </Link>
        <div className="pointer-events-auto">
          <NavOverlay />
        </div>
      </div>
    </nav>
  );
}