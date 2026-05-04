"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

// --- Nodes Data (Sequential but winding) ---
const nodes = [
  { id: "about",          label: "about.",          x: 20, y: 20, isRoot: true, href: "/about",          description: "who i am.",               color: "#F472B6", size: 16 },
  { id: "projects",       label: "projects.",       x: 50, y: 15, isRoot: false, href: "/work",           description: "selected works.",         color: "#A78BFA", size: 12 },
  { id: "experience",     label: "experience.",     x: 80, y: 35, isRoot: false, href: "/experience",     description: "professional path.",      color: "#34D399", size: 12 },
  { id: "organizations",  label: "organizations.",  x: 65, y: 65, isRoot: false, href: "/organizations",  description: "leadership & groups.",    color: "#22D3EE", size: 11 },
  { id: "certifications", label: "certifications.", x: 30, y: 80, isRoot: false, href: "/certifications", description: "verified skills.",        color: "#FACC15", size: 11 },
  { id: "contact",        label: "contact.",        x: 80, y: 85, isRoot: false, href: "/contact",        description: "let's talk.",             color: "#FB923C", size: 14 },
];

// --- Edges Data ---
// Sequential path + some cross-connections for "multiple ways"
const edges = [
  // Primary Sequence
  ["about", "projects"],
  ["projects", "experience"],
  ["experience", "organizations"],
  ["organizations", "certifications"],
  ["certifications", "contact"],
  // Alternative Paths
  ["about", "organizations"],
  ["projects", "certifications"],
  ["experience", "contact"],
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
        transition={{ duration: 0.3 }}
      />

      {/* Label */}
      <motion.text
        x={cx}
        y={cy - node.size - 12}
        textAnchor="middle"
        fill="white"
        fontSize={node.isRoot ? "15" : "12"}
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
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });
  
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  // Magnetic Cursor state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });
  const cursorSize = useSpring(12, { stiffness: 200, damping: 20 });
  const cursorOpacity = useSpring(0, { stiffness: 200, damping: 20 });

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

  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnetic pull logic
    let isHoveringNode = false;
    let targetX = x;
    let targetY = y;
    const magneticRadius = 80;

    for (const node of nodes) {
      const nx = (node.x / 100) * containerSize.w;
      const ny = (node.y / 100) * containerSize.h;
      const dist = Math.hypot(nx - x, ny - y);

      if (dist < magneticRadius) {
        isHoveringNode = true;
        // Interpolate heavily towards the node center
        const pullFactor = 1 - Math.pow(dist / magneticRadius, 2); // Stronger pull closer to center
        targetX = x + (nx - x) * pullFactor;
        targetY = y + (ny - y) * pullFactor;
        break; // Snap to the closest one in range
      }
    }

    mouseX.set(targetX);
    mouseY.set(targetY);
    cursorOpacity.set(1);

    if (isHoveringNode) {
      cursorSize.set(40);
    } else {
      cursorSize.set(16);
    }
  };

  const handleMouseLeave = () => {
    cursorOpacity.set(0);
  };

  const handleNodeClick = (node) => {
    setActiveNode(node.id === activeNode ? null : node.id);
  };

  const activeNodeData = nodes.find((n) => n.id === activeNode);

  return (
    <section className="relative w-full py-16 px-4 md:px-10 overflow-hidden">
      
      {/* Graph Canvas */}
      <div
        ref={wrapperRef}
        className="relative w-full max-w-[1200px] mx-auto cursor-none"
        style={{ height: "clamp(500px, 70vh, 800px)" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* The Magnetic Cursor */}
        <motion.div
          className="absolute top-0 left-0 rounded-full border border-white/50 bg-white/10 pointer-events-none z-50 backdrop-blur-[2px]"
          style={{
            x: cursorX,
            y: cursorY,
            width: cursorSize,
            height: cursorSize,
            translateX: "-50%",
            translateY: "-50%",
            opacity: cursorOpacity,
          }}
        />

        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {edges.map(([fromId, toId]) => {
              const from = nodes.find((n) => n.id === fromId);
              const to   = nodes.find((n) => n.id === toId);
              return (
                <linearGradient key={`grad-${fromId}-${toId}`} id={`grad-${fromId}-${toId}`} gradientUnits="userSpaceOnUse"
                  x1={(from.x / 100) * containerSize.w} y1={(from.y / 100) * containerSize.h}
                  x2={(to.x / 100) * containerSize.w}   y2={(to.y / 100) * containerSize.h}
                >
                  <stop offset="0%"   stopColor={from.color} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={to.color}   stopOpacity="0.5" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Edges */}
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
                opacity={activeNode ? (isConnectedToActive ? 0.9 : 0.1) : 0.4}
                strokeDasharray={isConnectedToActive ? "none" : "4 4"}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeNode ? (isConnectedToActive ? 0.9 : 0.1) : 0.4 }}
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
                className="pointer-events-auto flex flex-col items-center gap-3 px-8 py-5 rounded-2xl shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${activeNodeData.color}15, ${activeNodeData.color}05)`,
                  border: `1px solid ${activeNodeData.color}35`,
                  backdropFilter: "blur(16px)",
                }}
              >
                <Text className="text-sm font-medium tracking-widest uppercase" style={{ color: activeNodeData.color }}>
                  {activeNodeData.description}
                </Text>
                {activeNodeData.href && (
                  <Link href={activeNodeData.href} className="pointer-events-auto cursor-pointer">
                    <button
                      className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
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
