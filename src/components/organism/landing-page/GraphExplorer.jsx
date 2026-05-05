"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

// --- Nodes Data (Astral Layout) ---
const nodes = [
  { id: "about",          label: "about.",          x: 20, y: 30, isRoot: true, href: "/about",          description: "who i am.",               color: "#F472B6", size: 28, randomDelay: 0.1 + Math.random() * 0.4, randomDuration: 4 + Math.random() },
  { id: "projects",       label: "projects.",       x: 45, y: 45, isRoot: false, href: "/projects",       description: "selected works.",         color: "#A78BFA", size: 24, randomDelay: 0.1 + Math.random() * 0.4, randomDuration: 4 + Math.random() },
  { id: "experience",     label: "experience.",     x: 35, y: 70, isRoot: false, href: "/experience",     description: "professional path.",      color: "#34D399", size: 22, randomDelay: 0.1 + Math.random() * 0.4, randomDuration: 4 + Math.random() },
  { id: "certifications", label: "certifications.", x: 75, y: 35, isRoot: false, href: "/certifications", description: "verified skills.",        color: "#FACC15", size: 22, randomDelay: 0.1 + Math.random() * 0.4, randomDuration: 4 + Math.random() },
  { id: "contact",        label: "contact.",        x: 85, y: 75, isRoot: false, href: "/contact",        description: "let's talk.",             color: "#FB923C", size: 26, randomDelay: 0.1 + Math.random() * 0.4, randomDuration: 4 + Math.random() },
];

const edges = [
  { from: "about", to: "projects", duration: 3 + Math.random() * 2 },
  { from: "projects", to: "experience", duration: 3 + Math.random() * 2 },
  { from: "experience", to: "certifications", duration: 3 + Math.random() * 2 },
  { from: "projects", to: "certifications", duration: 3 + Math.random() * 2 },
  { from: "certifications", to: "contact", duration: 3 + Math.random() * 2 },
];

const INITIAL_PARTICLES = Array.from({ length: 40 }).map((_, i) => {
  const pOpacity = Math.random() * 0.4 + 0.1;
  return {
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: pOpacity,
    randomDuration: 3 + Math.random() * 4,
  };
});

function GraphNode({ node, isActive, onClick, cw, ch }) {
  const cx = (node.x / 100) * cw;
  const cy = (node.y / 100) * ch;
  const active = isActive === node.id;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: node.randomDelay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(node)}
      style={{ cursor: "pointer" }}
    >
      {/* Outer ambient glow */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.size + 35}
        fill={`url(#glow-${node.id})`}
        opacity={active ? 0.7 : 0.25}
        animate={{ r: [node.size + 35, node.size + 50, node.size + 35], opacity: active ? [0.7, 0.4, 0.7] : [0.25, 0.15, 0.25] }}
        transition={{ duration: node.randomDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />

      {/* Glassmorphic Core */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.size}
        fill={`${node.color}25`}
        stroke={active ? node.color : `${node.color}80`}
        strokeWidth={active ? 5 : 3}
        style={{ backdropFilter: "blur(12px)" }}
        whileHover={{ scale: 1.1, fill: `${node.color}40`, strokeWidth: active ? 6 : 4 }}
        animate={{ scale: active ? 1.2 : 1 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      />
      
      {/* Inner Energy Point */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.size * 0.25}
        fill={node.color}
        opacity={active ? 1 : 0.9}
        className="shadow-lg"
      />

      {/* Label */}
      <motion.text
        x={cx}
        y={cy - node.size - 24}
        textAnchor="middle"
        fill="white"
        fontSize={node.isRoot ? "18" : "16"}
        fontWeight={node.isRoot ? "900" : "700"}
        fontFamily="var(--font-jost), sans-serif"
        letterSpacing="-0.03em"
        opacity={active ? 1 : 0.7}
        className="pointer-events-none select-none drop-shadow-xl"
      >
        {node.label}
      </motion.text>
    </motion.g>
  );
}

function GraphEdge({ edge, cw, ch, activeNode }) {
  const { from: fromId, to: toId, duration } = edge;
  const from = nodes.find((n) => n.id === fromId);
  const to = nodes.find((n) => n.id === toId);
  
  const x1 = (from.x / 100) * cw;
  const y1 = (from.y / 100) * ch;
  const x2 = (to.x / 100) * cw;
  const y2 = (to.y / 100) * ch;
  
  const isConnectedToActive = activeNode && (fromId === activeNode || toId === activeNode);

  return (
    <g>
      {/* Base Edge */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={`url(#grad-${fromId}-${toId})`}
        strokeWidth={isConnectedToActive ? 4 : 2}
        opacity={activeNode ? (isConnectedToActive ? 0.9 : 0.1) : 0.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeNode ? (isConnectedToActive ? 0.9 : 0.1) : 0.4 }}
        transition={{ duration: 0.6 }}
      />

      {/* Continuous Energy Flow */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="url(#energy-grad)"
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ strokeDasharray: "20 1500", strokeDashoffset: 1500 }}
        animate={{ strokeDashoffset: -1500 }}
        transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        opacity={activeNode && !isConnectedToActive ? 0.05 : 0.7}
        style={{ pointerEvents: "none" }}
      />
    </g>
  );
}

const GraphExplorer = ({ isOverlay = false }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });
  
  const wrapperRef = useRef(null);

  const particles = INITIAL_PARTICLES;

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const handleNodeClick = (node) => {
    setActiveNode(node.id === activeNode ? null : node.id);
  };

  const activeNodeData = nodes.find((n) => n.id === activeNode);

  const content = (
    <div
      ref={wrapperRef}
      className={`relative w-full max-w-[1400px] mx-auto ${!isOverlay ? "rounded-3xl" : ""}`}
      style={{ height: isOverlay ? "100%" : "clamp(600px, 75vh, 900px)" }}
    >
        {/* LAYER 0: Background Echo Text (Outline) */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              key={`echo-${activeNodeData.id}`}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(40px)" }}
              animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            >
              <Text 
                className="font-black uppercase tracking-tighter leading-none text-transparent text-center px-10"
                style={{ 
                  WebkitTextStroke: `2px ${activeNodeData.color}`,
                  fontSize: `clamp(4rem, ${Math.min(18, Math.max(8, 140 / activeNodeData.label.length))}vw, 15rem)`
                }}
              >
                {activeNodeData.label.replace('.', '')}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          className="w-full h-full relative z-10"
          viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          <defs>
            {nodes.map((n) => (
              <radialGradient key={`glow-${n.id}`} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
              </radialGradient>
            ))}

            {edges.map((edge) => {
              const { from: fromId, to: toId } = edge;
              const from = nodes.find((n) => n.id === fromId);
              const to   = nodes.find((n) => n.id === toId);
              return (
                <linearGradient key={`grad-${fromId}-${toId}`} id={`grad-${fromId}-${toId}`} gradientUnits="userSpaceOnUse"
                  x1={(from.x / 100) * containerSize.w} y1={(from.y / 100) * containerSize.h}
                  x2={(to.x / 100) * containerSize.w}   y2={(to.y / 100) * containerSize.h}
                >
                  <stop offset="0%"   stopColor={from.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={to.color}   stopOpacity="1" />
                </linearGradient>
              );
            })}
            
            <linearGradient id="energy-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* LAYER 1: Deep Background (Void Particles) */}
          <g>
            {particles.map((p) => (
              <motion.circle
                key={p.id}
                cx={(p.x / 100) * containerSize.w}
                cy={(p.y / 100) * containerSize.h}
                r={p.size}
                fill="white"
                opacity={p.opacity}
                animate={{ opacity: [p.opacity, p.opacity * 0.2, p.opacity] }}
                transition={{ duration: p.randomDuration, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </g>

          {/* LAYER 2: Edges */}
          <g>
            {edges.map((edge) => (
              <GraphEdge 
                key={`${edge.from}-${edge.to}`} 
                edge={edge}
                cw={containerSize.w} 
                ch={containerSize.h} 
                activeNode={activeNode} 
              />
            ))}
          </g>

          {/* LAYER 3: Nodes */}
          <g>
            {nodes.map((node) => (
              <GraphNode
                key={node.id}
                node={node}
                isActive={activeNode}
                onClick={handleNodeClick}
                cw={containerSize.w}
                ch={containerSize.h}
              />
            ))}
          </g>
        </svg>

        {/* Floating Proceed Pill */}
        <AnimatePresence>
          {activeNodeData && activeNodeData.href && (
            <motion.div
              key={`pill-${activeNodeData.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            >
              <Link href={activeNodeData.href}>
                <button
                  className="px-10 py-4 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] group overflow-hidden relative"
                >
                  <span className="relative z-10">proceed.</span>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );

  if (isOverlay) {
    return <div className="w-full h-full flex items-center justify-center">{content}</div>;
  }

  return (
    <section className="relative w-full py-16 px-4 md:px-10 overflow-hidden bg-background">
      {content}
    </section>
  );
};

export default GraphExplorer;

