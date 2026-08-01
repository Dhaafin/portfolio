"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEMO_MESSAGES = [
  { role: "assistant", content: "blup. hello! ask me anything about my projects, skills, or experience." },
  { role: "user", content: "what are your top projects?" },
  { role: "assistant", content: "great question. here are my highlighted builds:\n\n**astral portfolio** — the site you're on right now. next.js + turso + drizzle + framer motion.\n\n**kage** — a full-stack saas platform with real-time collaboration.\n\nwant details on any of these?" },
  { role: "user", content: "tell me about your technical stack." },
  { role: "assistant", content: "i specialize in the **modern full-stack web** ecosystem:\n\n- `next.js 15` — app router, rsc, server actions\n- `turso` + `drizzle orm` — edge sqlite\n- `framer motion` — all animations\n- `tailwind v4` — utility-first css\n- `supabase` — auth, storage" },
];

const FEATURES = [
  {
    icon: "✦",
    title: "Context-Aware AI",
    desc: "Powered by live database context — answers reflect real projects, certifications, and experience.",
    color: "#A78BFA",
  },
  {
    icon: "◈",
    title: "Verified Access",
    desc: "Email OTP verification system with Cloudflare Turnstile to unlock extended queries.",
    color: "#34D399",
  },
];

function DemoBubble({ msg, delay = 0 }) {
  const isUser = msg.role === "user";
  const lines = msg.content.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      className={`flex flex-col max-w-[85%] gap-1 ${isUser ? "self-end items-end" : "self-start items-start"}`}
    >
      <div
        className={`px-4 py-3 rounded-2xl text-[11px] leading-relaxed shadow-lg ${
          isUser
            ? "bg-gradient-to-tr from-[#A78BFA]/95 to-[#C084FC]/95 text-black font-semibold rounded-tr-none shadow-[0_4px_20px_rgba(167,139,250,0.25)]"
            : "bg-white/[0.04] backdrop-blur-md border border-white/5 text-white/90 rounded-tl-none"
        }`}
      >
        {lines.map((line, i) => {
          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
          return (
            <p key={i} className={i > 0 ? "mt-1.5" : ""}>
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={j} className="font-extrabold">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                  return <code key={j} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5 font-mono text-[10px] text-[#A78BFA]">{part.slice(1, -1)}</code>;
                }
                if (part.startsWith("- ")) {
                  return <span key={j} className="block ml-3 before:content-['›'] before:mr-1.5 before:text-[#A78BFA]">{part.slice(2)}</span>;
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
      <span className="text-[8px] tracking-widest text-white/20 uppercase font-black px-1">
        {isUser ? "you" : "blob"}
      </span>
    </motion.div>
  );
}

export default function ChatbotShowcase() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= DEMO_MESSAGES.length) return;
    const timeout = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [visibleCount]);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-background">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#A78BFA]/6 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C084FC]/4 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 flex flex-col gap-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="text-[10px] tracking-[0.3em] text-[#A78BFA] font-black uppercase">
            ✦ new feature
          </span>
          <h2 className="font-jost font-black text-4xl md:text-6xl text-white tracking-tight leading-[0.95] max-w-2xl">
            ask me<br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(167,139,250,0.6)" }}
            >
              anything.
            </span>
          </h2>
          <p className="text-white/45 text-sm md:text-base font-light leading-relaxed max-w-md mt-2">
            an ai assistant trained on my live portfolio data. ask about projects, experience, stack, or anything else.
          </p>
        </motion.div>

        {/* Main content: chat preview + feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">

          {/* Left: Feature cards */}
          <div className="flex flex-col gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.1 }}
                whileHover={{ x: 8 }}
                className="flex gap-5 items-start p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.035] transition-all duration-300 group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 mt-0.5"
                  style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}30` }}
                >
                  {f.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-black text-white tracking-tight group-hover:text-white/90 transition-colors">
                    {f.title}
                  </span>
                  <span className="text-xs text-white/45 leading-relaxed font-light">
                    {f.desc}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              className="mt-4 flex items-center gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black">
                  try it now
                </span>
                <span className="text-[11px] text-white/50 font-light">
                  floating button → bottom right corner.
                </span>
              </div>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/30 text-xl"
              >
                →
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Floating chat preview panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Outer glow frame */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-[#A78BFA]/20 via-transparent to-[#C084FC]/10 pointer-events-none" />

            {/* Chat panel */}
            <div className="relative rounded-3xl bg-[#04070c]/90 backdrop-blur-2xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden h-[480px] flex flex-col">

              {/* Inner cosmic glow */}
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#A78BFA]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Panel header */}
              <div className="relative px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02] shrink-0 z-10">
                <div className="relative flex items-center">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#A78BFA]/30 to-[#C084FC]/30 blur-[2px]" />
                  <img src="/slime.png" alt="Chat Blob" className="relative w-7 h-7 rounded-full object-cover border border-white/10" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#04070c] shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white font-jost leading-tight">
                    chat-blob<span className="text-[#A78BFA]">.</span>
                  </span>
                  <span className="text-[8px] tracking-widest text-[#A78BFA]/70 font-mono uppercase font-bold mt-0.5">
                    active link
                  </span>
                </div>
                {/* Window chrome dots */}
                <div className="ml-auto flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-[#A78BFA]/40" />
                </div>
              </div>

              {/* Messages area */}
              <div className="relative flex-1 overflow-hidden p-5 flex flex-col gap-4 z-10">
                <AnimatePresence>
                  {DEMO_MESSAGES.slice(0, visibleCount).map((msg, i) => (
                    <DemoBubble key={i} msg={msg} delay={0} />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {visibleCount < DEMO_MESSAGES.length && DEMO_MESSAGES[visibleCount]?.role === "assistant" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="self-start flex gap-2 items-center bg-white/[0.03] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none"
                  >
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full"
                      />
                    ))}
                  </motion.div>
                )}

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#04070c]/90 to-transparent pointer-events-none" />
              </div>

              {/* Fake input bar */}
              <div className="relative p-4 shrink-0 bg-gradient-to-t from-[#04070c]/80 to-transparent z-10">
                <div className="flex gap-2 items-center bg-white/[0.03] border border-white/10 rounded-2xl pl-4 pr-2 py-1.5">
                  <span className="flex-1 text-xs text-white/20 italic select-none">type a message...</span>
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-3 h-3 rotate-90 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
