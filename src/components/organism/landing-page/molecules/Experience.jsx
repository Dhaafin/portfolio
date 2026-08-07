"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Text from "@/components/atoms/Text";

const experiences = [
  { id: 1, role: "lead engineer.", company: "tech corp", year: "2024-present" },
  { id: 2, role: "senior developer.", company: "startup inc", year: "2021-2024" },
  { id: 3, role: "full-stack dev.", company: "agency co", year: "2019-2021" },
];

const Experience = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps scroll progress (0 to 1) to horizontal translation (0% to -66.66% since we have 3 items)
  // To move 3 full screens, we need to move exactly (number of items - 1) * 100vw, but since we are mapping percentages of the container, 
  // a simpler approach is mapping to exact viewport percentages. Let's map to the total width.
  // Actually, standard framer-motion horizontal scroll maps '0% to -X%' where X depends on content width.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]); // Assuming 3 items of 100vw each

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Section Identifier */}
        <div className="absolute top-1/4 left-24 md:left-48 lg:left-64 z-10">
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-muted/50">
            experience.
          </Text>
        </div>

        {/* The Scrolling Filmstrip */}
        <motion.div style={{ x }} className="flex">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="h-screen w-screen flex flex-col justify-center px-24 md:px-48 lg:px-64 shrink-0"
            >
              <div className="max-w-[900px] w-full mx-auto">
                <Text className="text-muted font-medium uppercase tracking-[0.2em] text-sm mb-4">
                  {exp.year}
                </Text>
                <Text as="h3" className="text-5xl md:text-7xl lg:text-8xl font-black lowercase tracking-tighter text-foreground leading-[0.9]">
                  {exp.company}<span className="text-accent">.</span>
                </Text>
                <Text className="text-muted/60 font-medium tracking-wide text-xl mt-6">
                  {exp.role}
                </Text>
              </div>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
};

export default Experience;
