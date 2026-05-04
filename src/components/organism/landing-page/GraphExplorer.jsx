"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

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

function GraphNode({ node, isActive, onClick, containerSize }) {
  const cx = (node.x / 100) * containerSize.w;
  const cy = (node.y / 100) * containerSize.h;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + Math.random() * 0.3, duration: 0.5 }}
      onClick={() => onClick(node)}
      style={{ cursor: node.href ? "pointer" : "default" }}
    >
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
      <motion.circle
        cx={cx} cy={cy}
        r={node.isRoot ? 14 : 8}
        fill={isActive === node.id ? "hsl(217,91%,60%)" : node.isRoot ? "hsl(217,91%,60%)" : "hsl(222,47%,10%)"}
        stroke={isActive === node.id ? "hsl(217,91%,70%)" : "hsla(217,91%,60%,0.4)"}
        strokeWidth={1.5}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.2 }}
      />
      <motion.text
        x={cx}
        y={cy - (node.isRoot ? 22 : 16)}
        textAnchor="middle"
        fill="hsl(210,40%,98%)"
        fontSize={node.isRoot ? "14" : "11"}
        fontWeight={node.isRoot ? "900" : "600"}
        className="pointer-events-none select-none"
        opacity={isActive === node.id ? 1 : 0.7}
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

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleNodeClick = (node) => {
    setActiveNode(node.id === activeNode ? null : node.id);
  };

  const activeNodeData = nodes.find((n) => n.id === activeNode);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-10 overflow-hidden">
      <div className="absolute inset-0 bg-blob opacity-10 blur-[120px] -z-10" />
      
      <div className="max-w-[1200px] w-full flex flex-col items-center gap-10">
        <div className="flex items-center gap-6 w-full opacity-30">
          <Text className="text-xs tracking-[0.3em] uppercase font-bold">explore.</Text>
          <div className="h-[1px] flex-grow bg-border"></div>
        </div>

        <div className="relative w-full aspect-[16/10] max-h-[70vh] border border-border/20 rounded-2xl glass p-8">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
            preserveAspectRatio="xMidYMid meet"
          >
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
                  stroke="hsla(217,91%,60%,0.15)"
                  strokeWidth={1.5}
                />
              );
            })}

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

          {/* Node Detail Panel (Floating) */}
          <AnimatePresence>
            {activeNodeData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 glass border-accent/20 px-8 py-6 rounded-2xl flex flex-col items-center gap-4 text-center min-w-[300px]"
              >
                <Text className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{activeNodeData.description}</Text>
                {activeNodeData.href && (
                  <Link href={activeNodeData.href}>
                    <button className="px-6 py-2 rounded-full border border-accent/50 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
                      go to {activeNodeData.label}
                    </button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default GraphExplorer;
