"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Text from "@/components/atoms/Text";

const experiences = [
  {
    id: "01",
    company: "astra dynamic.",
    role: "lead frontend engineer",
    period: "2024 — present",
    description: "architecting high-performance visual engines for aerospace simulations. focused on webgl performance and complex state management.",
    satellites: ["react", "three.js", "rust"],
    color: "hsl(217, 91%, 60%)"
  },
  {
    id: "02",
    company: "vertex labs.",
    role: "senior software engineer",
    period: "2022 — 2024",
    description: "engineered a distributed data visualization platform for financial institutions. reduced render latency by 40% using custom shaders.",
    satellites: ["next.js", "d3.js", "go"],
    color: "hsl(250, 80%, 65%)"
  },
  {
    id: "03",
    company: "quantum sync.",
    role: "full-stack developer",
    period: "2020 — 2022",
    description: "built the core interaction layer for a decentralized collaboration tool. implemented real-time sync via custom crdt algorithms.",
    satellites: ["node.js", "postgres", "redis"],
    color: "hsl(280, 70%, 60%)"
  },
  {
    id: "04",
    company: "neon digital.",
    role: "frontend developer",
    period: "2018 — 2020",
    description: "developed immersive marketing experiences for global fashion brands. pioneered early adoption of framer motion for web animation.",
    satellites: ["typescript", "framer", "gsap"],
    color: "hsl(200, 90%, 55%)"
  }
];

export default function ExperienceFlow() {
  const containerRef = useRef(null);
  
  // Track vertical scroll of the whole page to drive horizontal movement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform the vertical progress into horizontal translation for the nodes
  // We have 4 experiences, so we move -300vw (from 0 to -300vw)
  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-300vw"]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background Arc */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M -100 600 Q 500 400 1100 600"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            style={{
              pathLength: smoothProgress,
            }}
          />
        </svg>

        {/* Horizontal Content Layer */}
        <motion.div 
          style={{ x }}
          className="flex items-center h-full w-[400vw] px-[0vw]"
        >
          {experiences.map((exp, index) => (
            <ExperienceNode 
              key={exp.id} 
              exp={exp} 
              index={index} 
              total={experiences.length}
              progress={smoothProgress}
            />
          ))}
        </motion.div>

        {/* Navigation Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-4">
          <div className="w-[1px] h-12 bg-gradient-to-t from-accent to-transparent" />
          <Text className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">scroll down to travel.</Text>
        </div>
      </div>
    </div>
  );
}

function ExperienceNode({ exp, index, total, progress }) {
  const nodeRef = useRef(null);
  
  // Map index to a normalized target position (0 to 1)
  const targetPos = index / (total - 1);
  
  // Calculate distance from focus (the center of the scroll)
  // We want to transform based on how close the current scroll progress is to this node's position
  const opacity = useTransform(progress, 
    [targetPos - 0.15, targetPos, targetPos + 0.15], 
    [0.1, 1, 0.1]
  );
  
  const scale = useTransform(progress, 
    [targetPos - 0.15, targetPos, targetPos + 0.15], 
    [0.8, 1.2, 0.8]
  );

  const yOffset = useTransform(progress,
    [targetPos - 0.2, targetPos, targetPos + 0.2],
    [50, 0, 50]
  );

  const blur = useTransform(progress,
    [targetPos - 0.1, targetPos, targetPos + 0.1],
    ["blur(4px)", "blur(0px)", "blur(4px)"]
  );

  return (
    <div className="w-[100vw] h-full flex-shrink-0 snap-center flex flex-col items-center justify-center relative">
      
      <motion.div 
        style={{ opacity, scale, y: yOffset, filter: blur }}
        className="relative flex flex-col items-center"
      >
        {/* The Primary Node */}
        <div 
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-white/10 flex items-center justify-center relative bg-background shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          style={{ borderColor: `${exp.color}20` }}
        >
          <div 
            className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]"
            style={{ backgroundColor: exp.color }}
          />
          
          {/* Orbiting Satellites */}
          {exp.satellites.map((skill, i) => (
            <motion.div
              key={skill}
              className="absolute whitespace-nowrap text-[8px] uppercase tracking-[0.2em] font-bold text-muted/60"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: 120 + i * 40,
              }}
            >
              <div 
                className="w-fit px-2 py-1 bg-surface/50 backdrop-blur-sm border border-border/10 rounded-full"
                style={{ transform: `rotate(-${360}deg)` }}
              >
                {skill}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Card */}
        <motion.div 
          className="mt-24 max-w-lg text-center px-6"
        >
          <div className="flex flex-col items-center gap-2 mb-6">
            <Text className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: exp.color }}>
              {exp.period}
            </Text>
            <Text as="h2" className="text-3xl sm:text-5xl font-black lowercase tracking-tighter">
              {exp.company}
            </Text>
            <Text className="text-xs uppercase tracking-[0.2em] font-bold text-muted">
              {exp.role}
            </Text>
          </div>
          
          <div className="glass p-8 rounded-2xl relative overflow-hidden group">
            <div 
              className="absolute top-0 left-0 w-1 h-full opacity-50"
              style={{ backgroundColor: exp.color }}
            />
            <Text className="text-muted/80 text-lg leading-relaxed font-medium">
              {exp.description}
            </Text>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
