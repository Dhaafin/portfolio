"use client";

export default function SuggestedQuestions({ suggestedQuestions, onSelect, loading }) {
  if (!suggestedQuestions || suggestedQuestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2 self-start max-w-[85%] pl-1 shrink-0">
      <span className="text-[10px] text-white/35 uppercase tracking-widest font-bold pl-0.5">
        suggested questions:
      </span>
      <div className="flex flex-col gap-1.5 items-start">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            disabled={loading}
            className="text-left px-3.5 py-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 text-white/75 hover:text-white transition-all text-[11px] focus:outline-none cursor-pointer active:scale-[0.97] disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
