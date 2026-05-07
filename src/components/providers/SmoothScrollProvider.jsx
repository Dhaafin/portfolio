"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider
 * Implements Lenis for global inertial scrolling to achieve
 * the "Luxury Nonchalance" slippery feel across all viewports.
 */
export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Maintain native touch feel for mobile stability
      touchMultiplier: 2,
    });

    window.lenis = lenis;
    lenisRef.current = lenis;

    // RAF Loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete window.lenis;
    };
  }, []);

  return <>{children}</>;
}
