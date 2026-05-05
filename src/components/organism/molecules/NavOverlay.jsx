"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import Link from "next/link";

// --- Graph Data ---
const nodes = [
  { id: "me", label: "dhaafin.", x: 50, y: 50, isRoot: true, href: "/", description: "the center." },
  { id: "work", label: "work.", x: 20, y: 22, href: "/work", description: "selected projects." },
  { id: "experience", label: "experience.", x: 78, y: 25, href: "/experience", description: "where i've been." },
  { id: "about", label: "about.", x: 25, y: 75, href: "/about", description: "who i am." },
  { id: "contact", label: "contact.", x: 75, y: 78, href: "/contact", description: "let's talk." },
  { id: "tech", label: "tech.", x: 10, y: 50, href: null, description: "next.js. react. postgres." },
  { id: "design", label: "design.", x: 88, y: 52, href: null, description: "figma. tailwind. motion." },
];

const edges = [
  ["me", "work"],
  ["me", "experience"],
  ["me", "about"],
  ["me", "contact"],
  ["me", "tech"],
  ["me", "design"],
  ["work", "tech"],
  ["work", "design"],
  ["experience", "tech"],
];

const overlayVariants = {
  hidden: { clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)", opacity: 1 },
  visible: {
    clipPath: "circle(150% at calc(100% - 3.5rem) 3.5rem)",
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  },
};

function GraphNode({ node, isActive, onClick, containerSize }) {
  const cx = (node.x / 100) * containerSize.w;
  const cy = (node.y / 100) * containerSize.h;
  const delay = 0.3 + ((node.id.length + (node.id.charCodeAt(0) || 0)) % 10) * 0.03;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(node)}
      style={{ cursor: node.href ? "pointer" : "default" }}
    >
      {/* Pulse ring for root */}
      {node.isRoot && (
        <motion.circle
          cx={cx} cy={cy} r={22}
          fill="none"
          stroke="hsla(217,91%,60%,0.3)"
          strokeWidth={1}
          animate={{ r: [22, 34, 22], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.isRoot ? 14 : 8}
        fill={isActive === node.id ? "hsl(217,91%,60%)" : node.isRoot ? "hsl(217,91%,60%)" : "hsl(222,47%,10%)"}
        stroke={isActive === node.id ? "hsl(217,91%,70%)" : "hsla(217,91%,60%,0.4)"}
        strokeWidth={1.5}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.2 }}
      />

      {/* Label */}
      <motion.text
        x={cx}
        y={cy - (node.isRoot ? 22 : 16)}
        textAnchor="middle"
        fill="hsl(210,40%,98%)"
        fontSize={node.isRoot ? "14" : "11"}
        fontWeight={node.isRoot ? "900" : "600"}
        fontFamily="var(--font-jost), sans-serif"
        letterSpacing="-0.03em"
        opacity={isActive === node.id ? 1 : 0.7}
      >
        {node.label}
      </motion.text>
    </motion.g>
  );
}

export default function NavOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });
  const svgRef = useRef(null);

  const handleSvgRef = (el) => {
    if (el) {
      svgRef.current = el;
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    }
  };

  const handleNodeClick = (node) => {
    setActiveNode(node.id === activeNode ? null : node.id);
  };

  const activeNodeData = nodes.find((n) => n.id === activeNode);

  return (
    <>
      {/* Trigger */}
      <button
        id="nav-trigger"
        onClick={() => { setIsOpen(!isOpen); setActiveNode(null); }}
        aria-label="Toggle navigation"
        className="z-60 mix-blend-difference"
      >
        <motion.span
          className="text-xs font-bold uppercase tracking-[0.25em] text-white"
          animate={{ opacity: isOpen ? 0.5 : 1 }}
        >
          {isOpen ? "close." : "explore."}
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: "hsl(222 47% 4%)" }}
          >
            {/* Ambient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blob blur-[160px] opacity-20 pointer-events-none" />

            {/* Header hint */}
            <motion.p
              className="absolute top-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase font-bold text-muted/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >
              explore the graph.
            </motion.p>

            {/* SVG Graph */}
            <svg
              ref={handleSvgRef}
              className="w-full h-full max-w-5xl max-h-[80vh]"
              viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Edges */}
              {edges.map(([fromId, toId]) => {
                const from = nodes.find((n) => n.id === fromId);
                const to = nodes.find((n) => n.id === toId);
                return (
                  <motion.line
                    key={`${fromId}-${toId}`}
                    x1={(from.x / 100) * containerSize.w}
                    y1={(from.y / 100) * containerSize.h}
                    x2={(to.x / 100) * containerSize.w}
                    y2={(to.y / 100) * containerSize.h}
                    stroke="hsla(217,91%,60%,0.12)"
                    strokeWidth={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeInOut" }}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isActive={activeNode}
                  onClick={handleNodeClick}
                  containerSize={containerSize}
                />
              ))}
            </svg>

            {/* Node Detail Panel */}
            <AnimatePresence>
              {activeNodeData && (
                <motion.div
                  key={activeNodeData.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                  <p className="text-muted/60 text-sm tracking-widest font-medium">
                    {activeNodeData.description}
                  </p>
                  {activeNodeData.href && (
                    <Link
                      href={activeNodeData.href}
                      onClick={() => setIsOpen(false)}
                      className="text-xs uppercase tracking-[0.25em] font-bold text-accent hover:opacity-70 transition-opacity border border-accent/30 px-6 py-2.5 rounded-full"
                    >
                      go there.
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
