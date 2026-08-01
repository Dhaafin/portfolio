"use client";

export default function ChatInput({ loading, needsVerification, input, setInput, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading || needsVerification) return;
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-white/5 flex gap-2 items-center bg-white/2 shrink-0"
    >
      <input
        type="text"
        disabled={loading || needsVerification}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={needsVerification ? "verification required..." : "type a message..."}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-xs text-white placeholder-white/20 focus:border-[#A78BFA] outline-none transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !input.trim() || needsVerification}
        className="w-10 h-10 rounded-xl bg-white text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 disabled:scale-100 shrink-0 cursor-pointer"
      >
        <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}
