"use client";

import Text from "@/components/atoms/Text";

export default function ChatHeader({ token, queriesLeft, onClose }) {
  return (
    <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/2">
      <div className="flex items-center gap-3">
        <img
          src="/slime.png"
          alt="Astral Slime Profile"
          className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
        />
        <Text className="text-xs font-black tracking-widest uppercase text-white font-jost">
          Chatbot
        </Text>
      </div>
      <div className="flex items-center gap-4">
        {!token && (
          <Text className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
            {queriesLeft} free query left
          </Text>
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
