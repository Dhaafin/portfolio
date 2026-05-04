"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

// Each node has its own color identity
const nodes = [
  { id: "me",         label: "dhaafin.",    x: 50, y: 50, isRoot: true, href: "/",           description: "the center.",           color: "#3B82F6", size: 18 },
  { id: "work",       label: "work.",        x: 22, y: 20, isRoot: false, href: "/work",       description: "selected projects.",    color: "#A78BFA", size: 11 },
  { id: "experience", label: "experience.",  x: 78, y: 24, isRoot: false, href: "/experience", description: "where i've been.",      color: "#34D399", size: 11 },
  { id: "about",      label: "about.",       x: 24, y: 78, isRoot: false, href: "/about",      description: "who i am.",             color: "#F472B6", size: 11 },
  { id: "contact",    label: "contact.",     x: 76, y: 80, isRoot: false, href: "/contact",    description: "let's talk.",           color: "#FB923C", size: 11 },
  { id: "tech",       label: "tech.",        x: 8,  y: 50, isRoot: false, href: null,          description: "next.js. react. node.", color: "#22D3EE", size: 9  },
  { id: "design",     label: "design.",      x: 92, y: 50, isRoot: false, href: null,          description: "figma. tailwind.",      color: "#FACC15", size: 9  },
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

function GraphNode({ node, isActive, onClick, cw, ch }) {
  const cx = (node.x / 100) * cw;
  const cy = (node.y / 100) * ch;
  const active = isActive === node.id;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + Math.random() * 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(node)}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow ring */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.size + 10}
        fill={node.color}
        opacity={active ? 0.15 : 0.06}
        animate={active ? { r: [node.size + 10, node.size + 22, node.size + 10], opacity: [0.15, 0.05, 0.15] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Root pulse ring */}
      {node.isRoot && (
        <motion.circle
          cx={cx} cy={cy} r={node.size + 16}
          fill="none"
          stroke={node.color}
          strokeWidth={1}
          animate={{ r: [node.size + 16, node.size + 32, node.size + 16], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Core circle */}
      <motion.circle
        cx={cx} cy={cy}
        r={node.size}
        fill={node.color}
        fillOpacity={active ? 1 : 0.85}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={active ? 2 : 1}
        animate={{ scale: active ? 1.2 : 1 }}
        whileHover={{ scale: 1.35, fillOpacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Label */}
      <motion.text
        x={cx}
        y={cy - node.size - 10}
        textAnchor="middle"
        fill="white"
        fontSize={node.isRoot ? "15" : "11"}
        fontWeight={node.isRoot ? "900" : "700"}
        fontFamily="var(--font-jost), sans-serif"
        letterSpacing="-0.03em"
        opacity={active ? 1 : 0.75}
        className="pointer-events-none select-none"
      >
        {node.label}
      </motion.text>
    </motion.g>
  );
}

const GraphExplorer = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 500 });
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

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

  return (
    <section className="relative w-full py-16 px-10">
      {/* Section Label */}
      <div className="flex items-center gap-6 mb-12 max-w-[900px] mx-auto opacity-30 px-14 md:px-24 lg:px-38">
        <Text className="text-xs tracking-[0.3em] uppercase font-bold">explore.</Text>
        <div className="h-[1px] flex-grow bg-border"></div>
      </div>

      {/* Graph Canvas — no background, fully transparent */}
      <div
        ref={wrapperRef}
        className="relative w-full"
        style={{ height: "clamp(400px, 55vh, 620px)" }}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* A gradient for each edge based on connected nodes */}
            {edges.map(([fromId, toId]) => {
              const from = nodes.find((n) => n.id === fromId);
              const to   = nodes.find((n) => n.id === toId);
              return (
                <linearGradient key={`grad-${fromId}-${toId}`} id={`grad-${fromId}-${toId}`} gradientUnits="userSpaceOnUse"
                  x1={(from.x / 100) * containerSize.w} y1={(from.y / 100) * containerSize.h}
                  x2={(to.x / 100) * containerSize.w}   y2={(to.y / 100) * containerSize.h}
                >
                  <stop offset="0%"   stopColor={from.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={to.color}   stopOpacity="0.6" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Colorful Gradient Edges */}
          {edges.map(([fromId, toId]) => {
            const from = nodes.find((n) => n.id === fromId);
            const to   = nodes.find((n) => n.id === toId);
            const isConnectedToActive = activeNode && (fromId === activeNode || toId === activeNode);
            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={(from.x / 100) * containerSize.w}
                y1={(from.y / 100) * containerSize.h}
                x2={(to.x / 100) * containerSize.w}
                y2={(to.y / 100) * containerSize.h}
                stroke={`url(#grad-${fromId}-${toId})`}
                strokeWidth={isConnectedToActive ? 2 : 1}
                opacity={activeNode ? (isConnectedToActive ? 0.9 : 0.15) : 0.4}
                strokeDasharray={isConnectedToActive ? "none" : "4 4"}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeNode ? (isConnectedToActive ? 0.9 : 0.15) : 0.4 }}
                transition={{ duration: 0.5 }}
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
              cw={containerSize.w}
              ch={containerSize.h}
            />
          ))}
        </svg>

        {/* Floating Detail Panel */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              key={activeNodeData.id}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center pointer-events-none"
            >
              <div
                className="pointer-events-auto flex flex-col items-center gap-3 px-8 py-5 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${activeNodeData.color}18, ${activeNodeData.color}08)`,
                  border: `1px solid ${activeNodeData.color}35`,
                  backdropFilter: "blur(16px)",
                }}
              >
                <Text className="text-sm font-medium tracking-widest uppercase" style={{ color: activeNodeData.color }}>
                  {activeNodeData.description}
                </Text>
                {activeNodeData.href && (
                  <Link href={activeNodeData.href} className="pointer-events-auto">
                    <button
                      className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
                      style={{
                        background: `${activeNodeData.color}25`,
                        border: `1px solid ${activeNodeData.color}60`,
                        color: activeNodeData.color,
                      }}
                    >
                      go there.
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GraphExplorer;
