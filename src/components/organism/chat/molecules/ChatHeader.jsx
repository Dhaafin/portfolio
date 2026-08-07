"use client";

import Text from "@/components/atoms/Text";

export default function ChatHeader({ token, queriesLeft, onClose }) {
  return (
    <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#A78BFA]/30 to-[#C084FC]/30 blur-[2px] opacity-70" />
          <img
            src="/slime.png"
            alt="Astral Slime Profile"
            className="relative w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#050505] shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
        </div>
        <div className="flex flex-col">
          <Text className="text-[11px] font-black tracking-[0.2em] uppercase text-white font-jost leading-tight">
            chat-blob<span className="text-[#A78BFA]">.</span>
          </Text>
          <span className="text-[8px] tracking-widest text-[#A78BFA]/75 font-mono uppercase font-bold mt-0.5">
            active link
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {!token && (
          <div className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5">
            <Text className="text-[8px] uppercase tracking-widest text-white/40 font-black font-mono">
              {queriesLeft} free query left
            </Text>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="sm:hidden text-white/60 hover:text-white text-xl font-light focus:outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          ×
        </button>
      </div>
    </header>
  );
}
