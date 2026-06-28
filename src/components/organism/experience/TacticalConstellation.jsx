"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";
import Link from "next/link";

const FALLBACK_EXPERIENCES = [
  {
    id: "01",
    year: "2024",
    era: "present.",
    company: "astra dynamic.",
    role: "lead frontend engineer",
    period: "2024 — present",
    description:
      "architecting high-performance visual engines for aerospace simulations. focused on webgl performance and complex state orchestration across distributed render pipelines.",
    skills: ["react", "three.js", "rust", "webgl", "typescript"],
    color: "hsl(217, 91%, 60%)",
  },
];

const TRANSITION = { duration: 0.8, ease: [0.23, 1, 0.32, 1] };

export default function TacticalConstellation({ initialExperiences }) {
  const experiences =
    initialExperiences?.length > 0 ? initialExperiences : FALLBACK_EXPERIENCES;
  const [active, setActive] = useState(0);
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = experiences.findIndex(
              (e) => e.id === entry.target.id,
            );
            if (index !== -1) setActive(index);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-20% 0px -40% 0px",
      },
    );

    experiences.forEach((e) => {
      const el = document.getElementById(e.id);
      if (el) observer.current.observe(el);
    });

    return () => observer.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 pt-24 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 flex flex-col">
        {/* Main layout */}
        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-32 xl:gap-64 relative">
          {/* ── LEFT PANEL: Sticky Era Selector ── */}
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

          {/* ── RIGHT PANEL: Scrolling Experience List ── */}
          <div className="w-full lg:w-[32rem] flex flex-col gap-16 sm:gap-24 md:gap-40 lg:gap-56">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}

            {/* Bottom spacer to allow the last item to be active */}
            <div className="h-[40vh] lg:h-[40vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ exp }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = exp.points?.length > 3;
  const visiblePoints = isExpanded ? exp.points : exp.points?.slice(0, 3);

  return (
    <motion.div
      id={exp.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={TRANSITION}
      className="flex flex-col gap-6 sm:gap-8 scroll-mt-48 lg:scroll-mt-32"
    >
      {/* Index + period */}
      <div className="flex items-center gap-4">
        <Text
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-black"
          style={{ color: exp.color }}
        >
          {exp.id}
        </Text>
        <div
          className="h-[1px] flex-1"
          style={{ background: `${exp.color}30` }}
        />
        <Text className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-muted/50">
          {exp.period}
        </Text>
      </div>

      {/* Company + role */}
      <div>
        <Text
          as="h2"
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-2 sm:mb-3"
        >
          {exp.company}
        </Text>
        <Text className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-muted">
          {exp.role}
        </Text>
      </div>

      {/* Description / Points */}
      <div className="glass p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col gap-4">
        <div
          className="absolute top-0 left-0 w-[2px] h-full rounded-full opacity-60"
          style={{ backgroundColor: exp.color }}
        />

        <ul className="flex flex-col gap-4 pl-2">
          {visiblePoints?.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-1 h-1 rounded-full bg-accent mt-2.5 flex-shrink-0" />
              <Text className="text-muted/80 text-base sm:text-lg leading-relaxed font-medium">
                {point}
              </Text>
            </motion.li>
          ))}
        </ul>

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-all mt-2 pl-6"
          >
            {isExpanded ? "less." : `more (+${exp.points.length - 3}).`}
          </button>
        )}
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {exp.skills?.map((skill) => (
          <span
            key={skill}
            className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border"
            style={{
              borderColor: `${exp.color}30`,
              color: exp.color,
              backgroundColor: `${exp.color}08`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
