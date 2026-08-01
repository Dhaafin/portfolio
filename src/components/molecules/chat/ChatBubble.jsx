"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const parseMarkdown = (text) => {
  if (!text) return "";
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    const isListItem = line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\.\s/.test(line.trim());
    let cleanLine = line;
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      cleanLine = line.trim().substring(2);
    } else if (/^\d+\.\s/.test(line.trim())) {
      cleanLine = line.trim().replace(/^\d+\.\s/, "");
    }

    const parts = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g);
    const parsedElements = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pIdx} className="font-extrabold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5 font-mono text-[10px] text-[#A78BFA]">{part.slice(1, -1)}</code>;
      }
      return part;
    });

    if (isListItem) {
      return (
        <li key={idx} className="ml-4 list-disc mb-1 list-inside text-left">
          {parsedElements}
        </li>
      );
    }

    return (
      <p key={idx} className={`${idx > 0 ? "mt-2" : ""} text-left`}>
        {parsedElements}
      </p>
    );
  });
};

function TypewriterMessage({ content, shouldAnimate }) {
  const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : content);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(content);
      return;
    }

    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setDisplayedText(content.substring(0, i));
      if (i >= content.length) {
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [content, shouldAnimate]);

  return <>{parseMarkdown(displayedText)}</>;
}

export default function ChatBubble({ msg, shouldAnimate }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.9 }}
      className={`flex flex-col max-w-[85%] gap-1 ${
        isUser ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-lg ${
          isUser
            ? "bg-gradient-to-tr from-[#A78BFA]/95 to-[#C084FC]/95 text-black font-semibold rounded-tr-none shadow-[0_4px_24px_rgba(167,139,250,0.2)]"
            : "bg-white/[0.03] backdrop-blur-md border border-white/5 text-white/90 rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        }`}
      >
        {!isUser ? (
          <TypewriterMessage content={msg.content} shouldAnimate={shouldAnimate} />
        ) : (
          parseMarkdown(msg.content)
        )}
      </div>
      <span className="text-[8px] tracking-widest text-white/20 uppercase font-black px-1 mt-0.5">
        {isUser ? "you" : "slime"}
      </span>
    </motion.div>
  );
}
