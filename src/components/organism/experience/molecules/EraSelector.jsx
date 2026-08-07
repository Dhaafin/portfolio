"use client";

import { motion } from "framer-motion";
import Text from "@/components/atoms/Text";

const TRANSITION = { duration: 0.8, ease: [0.23, 1, 0.32, 1] };

export default function EraSelector({ experiences, active, scrollTo }) {
  return (
    <aside className="sticky top-24 lg:top-32 flex flex-col justify-start items-start w-full lg:w-56 lg:min-w-[14rem] flex-shrink-0 z-30 bg-background/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none pb-6 lg:pb-0 text-left">
      <div className="hidden lg:block mb-12 w-full text-left">
        <Text className="text-[10px] uppercase tracking-[0.35em] font-bold text-muted/40 mb-1 text-left block">
          where i&lsquo;ve been.
        </Text>
        <Text
          as="h1"
          className="text-5xl font-black lowercase tracking-tighter leading-none text-left block"
        >
          experience<span className="text-accent">.</span>
        </Text>
      </div>

      {/* Mobile heading - more compact */}
      <div className="block lg:hidden mb-6 w-full text-left">
        <Text
          as="h1"
          className="text-3xl font-black lowercase tracking-tighter leading-none text-left block"
        >
          experience<span className="text-accent">.</span>
        </Text>
      </div>

      {/* Era Tabs - Scrollable on mobile */}
      <div className="relative w-full overflow-x-auto no-scrollbar lg:overflow-visible text-left">
        <div className="flex lg:flex-col justify-start gap-6 lg:gap-0 min-w-max lg:min-w-0 w-full lg:w-full border-b border-white/5 lg:border-none pb-2 lg:pb-0 text-left">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => scrollTo(e.id)}
              className="group relative flex items-center gap-3 lg:gap-4 py-2 lg:py-4 transition-all duration-500 cursor-pointer flex-shrink-0 text-left"
            >
              {/* Vertical Indicator (Desktop) */}
              {active === i && (
                <motion.div
                  layoutId="active-indicator-v"
                  className="hidden lg:block absolute left-0 w-[2px] h-10 rounded-full z-10"
                  style={{ backgroundColor: experiences[i].color }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              {/* Horizontal Indicator (Mobile) */}
              {active === i && (
                <motion.div
                  layoutId="active-indicator-h"
                  className="block lg:hidden absolute bottom-[-9px] left-0 right-0 h-[2px] rounded-full z-10"
                  style={{ backgroundColor: experiences[i].color }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              <div className="lg:pl-6 flex items-center gap-4 text-left w-full">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 hidden lg:block"
                  animate={{
                    backgroundColor:
                      active === i
                        ? experiences[i].color
                        : "hsla(215, 20%, 65%, 0.3)",
                    scale: active === i ? 1.4 : 1,
                  }}
                  transition={TRANSITION}
                />
                <div className="relative text-left w-full">
                  <motion.p
                    className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black leading-none pb-1 text-left"
                    animate={{
                      color:
                        active === i
                          ? "#fff"
                          : "hsla(215, 20%, 65%, 0.5)",
                    }}
                    transition={TRANSITION}
                  >
                    {e.year}
                  </motion.p>

                  {/* Desktop Hover Underline */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden pointer-events-none hidden lg:block">
                    <div className="w-full h-full bg-foreground/30 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                  </div>

                  <motion.p
                    className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-medium leading-none mt-1 lg:block text-left"
                    animate={{
                      color:
                        active === i
                          ? experiences[i].color
                          : "hsla(215, 20%, 65%, 0.3)",
                    }}
                    transition={TRANSITION}
                  >
                    {e.era}
                  </motion.p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
