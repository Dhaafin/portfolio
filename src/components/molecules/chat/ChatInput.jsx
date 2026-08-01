"use client";

export default function ChatInput({ loading, needsVerification, input, setInput, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading || needsVerification) return;
    onSubmit(e);
  };

  return (
    <div className="p-4 shrink-0 bg-gradient-to-t from-black/80 to-transparent">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl pl-5 pr-2 py-1.5 focus-within:border-[#A78BFA] focus-within:shadow-[0_0_24px_rgba(167,139,250,0.15)] transition-all duration-300"
      >
        <input
          type="text"
          disabled={loading || needsVerification}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={needsVerification ? "verification required..." : "type a message..."}
          className="flex-1 bg-transparent border-none text-base sm:text-xs text-white placeholder-white/20 outline-none disabled:opacity-50 h-9"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || needsVerification}
          className="w-9 h-9 rounded-xl bg-white hover:bg-[#A78BFA] text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 disabled:scale-100 disabled:bg-white shrink-0 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
