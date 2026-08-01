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
        return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-accent">{part.slice(1, -1)}</code>;
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
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className={`flex flex-col max-w-[80%] gap-1.5 ${
        isUser ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? "bg-[#A78BFA] text-black font-medium rounded-tr-none"
            : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none"
        }`}
      >
        {!isUser ? (
          <TypewriterMessage content={msg.content} shouldAnimate={shouldAnimate} />
        ) : (
          parseMarkdown(msg.content)
        )}
      </div>
    </motion.div>
  );
}
