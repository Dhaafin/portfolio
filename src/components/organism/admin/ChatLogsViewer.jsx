"use client";

import { useState, useMemo } from "react";
import Text from "@/components/atoms/Text";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatLogsViewer({ initialMessages = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Group messages by session_id in memory
  const sessions = useMemo(() => {
    const groups = {};
    
    // Sort initialMessages chronologically first so groups have correct message order
    const sorted = [...initialMessages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    sorted.forEach((msg) => {
      if (!groups[msg.session_id]) {
        groups[msg.session_id] = {
          session_id: msg.session_id,
          email: msg.email || "Anonymous",
          messages: [],
          created_at: msg.created_at,
        };
      }
      groups[msg.session_id].messages.push(msg);
      
      // Update latest activity timestamp
      if (new Date(msg.created_at) > new Date(groups[msg.session_id].created_at)) {
        groups[msg.session_id].created_at = msg.created_at;
      }
      
      // Associate email if set in any message of this session
      if (msg.email && msg.email !== "Anonymous") {
        groups[msg.session_id].email = msg.email;
      }
    });

    // Convert to array and sort by latest activity descending
    return Object.values(groups).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialMessages]);

  // Filter sessions by search term
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchEmail = s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSession = s.session_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchContent = s.messages.some((m) =>
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchEmail || matchSession || matchContent;
    });
  }, [sessions, searchTerm]);

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.session_id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search by email, session, or text..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white placeholder-white/20 focus:border-[#A78BFA] focus:shadow-[0_0_24px_rgba(167,139,250,0.1)] outline-none transition-all duration-300 h-11"
        />
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.length === 0 ? (
          <div className="col-span-full p-16 border border-dashed border-white/10 rounded-3xl text-center">
            <Text className="text-white/30 text-xs font-mono lowercase">no matching logs found.</Text>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => setSelectedSessionId(session.session_id)}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-white truncate max-w-[70%]">
                    {session.email}
                  </span>
                  <span className="px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#A78BFA] bg-[#A78BFA]/10 rounded border border-[#A78BFA]/20">
                    {session.messages.length} msgs
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/25 truncate">
                  session: {session.session_id}
                </span>
              </div>

              <div className="flex items-end justify-between border-t border-white/5 pt-4 mt-4">
                <span className="text-[9px] text-white/30 font-mono">
                  {new Date(session.created_at).toLocaleString()}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                  view transcript →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transcript Modal Overlay */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSessionId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-2xl h-[80vh] bg-[#04070c]/95 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-white">
                    {selectedSession.email}
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase">
                    session ID: {selectedSession.session_id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSessionId(null)}
                  className="text-white/60 hover:text-white text-xl font-light focus:outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Chat Transcript Area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {selectedSession.messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] gap-1 ${
                        isUser ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl text-[11px] leading-relaxed ${
                          isUser
                            ? "bg-[#A78BFA] text-black font-semibold rounded-tr-none"
                            : "bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="text-[7px] tracking-widest text-white/20 uppercase font-black px-1 mt-0.5">
                        {isUser ? "user" : "assistant"} @ {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
