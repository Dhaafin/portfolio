"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./Hero";
import GraphExplorer from "./GraphExplorer";

const HomePage = () => {
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);

    // Trigger modal on wheel/scroll gesture
    useEffect(() => {
        const handleWheel = (e) => {
            if (!isExplorerOpen && e.deltaY > 0) {
                setIsExplorerOpen(true);
            }
        };

        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isExplorerOpen]);

    return (
        <div className="relative h-screen overflow-hidden bg-background">
            <section id="hero">
                <Hero onOpenExplorer={() => setIsExplorerOpen(true)} />
            </section>
            
            {/* The Black Hole Modal */}
            <AnimatePresence>
                {isExplorerOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                        initial={{ clipPath: "circle(0% at 50% 50%)" }}
                        animate={{ clipPath: "circle(150% at 50% 50%)" }}
                        exit={{ clipPath: "circle(0% at 50% 50%)" }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => setIsExplorerOpen(false)}
                            className="absolute top-12 right-12 md:right-24 text-xs font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors z-50"
                        >
                            close.
                        </motion.button>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <GraphExplorer />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;