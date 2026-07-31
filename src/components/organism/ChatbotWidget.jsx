"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Text from "@/components/atoms/Text";

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

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [token, setToken] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [messages, setMessages] = useState([
    { role: "assistant", content: "hello. ask me anything about my projects, skills, or experience." }
  ]);
  const [input, setInput] = useState("");
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [queriesLeft, setQueriesLeft] = useState(3);

  const messagesEndRef = useRef(null);
  const turnstileContainerRef = useRef(null);

  // Read session token and query counts from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("chat_session_token");
    const savedEmail = localStorage.getItem("chat_user_email");
    if (savedToken) {
      setToken(savedToken);
      setEmail(savedEmail || "");
    }

    const savedCount = localStorage.getItem("chat_free_count");
    if (savedCount) {
      setQueriesLeft(Math.max(0, 3 - parseInt(savedCount, 10)));
    }
  }, []);

  // Dynamically load Turnstile script
  useEffect(() => {
    if (isOpen && !window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  // Render Turnstile widget when verification form is shown
  useEffect(() => {
    if (isOpen && needsVerification && !otpSent && turnstileContainerRef.current) {
      const checkTurnstileInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstileInterval);
          try {
            window.turnstile.render(turnstileContainerRef.current, {
              sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", // fallback to CF test sitekey
              callback: (tToken) => setTurnstileToken(tToken),
              "expired-callback": () => setTurnstileToken(null),
              "error-callback": () => setTurnstileToken(null)
            });
          } catch (e) {
            console.error("Turnstile render error:", e);
          }
        }
      }, 100);
      return () => clearInterval(checkTurnstileInterval);
    }
  }, [isOpen, needsVerification, otpSent]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("chat_session_token", data.token);
        localStorage.setItem("chat_user_email", email);
        setToken(data.token);
        setNeedsVerification(false);
        setOtpSent(false);
        setMessages(prev => [...prev, { role: "assistant", content: "verification successful. you have unlocked 10 more queries." }]);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      
      if (res.status === 401 || data.needsVerification) {
        setNeedsVerification(true);
        setMessages(prev => [...prev, { role: "assistant", content: "you have reached your free query limit. please verify your email to unlock 10 more queries." }]);
      } else if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        if (!token) {
          const currentCount = parseInt(localStorage.getItem("chat_free_count") || "0", 10) + 1;
          localStorage.setItem("chat_free_count", currentCount.toString());
          setQueriesLeft(Math.max(0, 3 - currentCount));
        }
      } else {
        setError(data.error || "Something went wrong.");
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error || "Unable to reply at the moment."}` }]);
      }
    } catch (err) {
      setError("Connection failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#A78BFA] text-[#050505] flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:shadow-[0_0_30px_rgba(167,139,250,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? (
          <span className="text-xl font-light">×</span>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[380px] h-[520px] bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[100]"
          >
            {/* Header */}
            <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] animate-pulse" />
                <Text className="text-sm font-black tracking-widest uppercase text-white font-jost">
                  assistant<span className="text-[#A78BFA]">.</span>
                </Text>
              </div>
              {!token && (
                <Text className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  {queriesLeft} free query left
                </Text>
              )}
            </header>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
              data-lenis-prevent
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[80%] gap-1.5 ${
                    msg.role === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#A78BFA] text-black font-medium rounded-tr-none"
                        : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none"
                    }`}
                  >
                    {parseMarkdown(msg.content)}
                  </div>
                </div>
              ))}
              {loading && !needsVerification && (
                <div className="self-start flex gap-1.5 items-center bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce delay-300" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* OTP Verification Gate Overlay */}
            {needsVerification && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center p-8 z-10">
                <Text className="text-lg font-black text-white mb-2 tracking-tight">
                  verification required.
                </Text>
                <Text className="text-xs text-white/60 mb-6 leading-relaxed">
                  you have used your 3 free queries. please enter a valid email to get an access code and unlock 10 more queries.
                </Text>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-wider mb-4">
                    {error}
                  </div>
                )}

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="enter your email..."
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#A78BFA] outline-none transition-all"
                    />
                    
                    {/* Cloudflare Turnstile Container */}
                    <div ref={turnstileContainerRef} className="my-1 flex justify-center scale-90 origin-center" />

                    <button
                      type="submit"
                      disabled={loading || (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                      className="w-full py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? "sending code..." : "get verify code."}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedsVerification(false)}
                      className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-white transition-colors py-1 cursor-pointer"
                    >
                      cancel
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                    <Text className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      sent to {email}
                    </Text>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="enter 6-digit code..."
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#A78BFA] outline-none transition-all text-center tracking-widest font-mono text-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[#A78BFA] text-black text-xs font-black uppercase tracking-widest hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? "verifying..." : "verify & unlock."}
                    </button>
                    <div className="flex justify-between items-center px-1">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-white transition-colors cursor-pointer"
                      >
                        ← back
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A78BFA]/60 hover:text-[#A78BFA] transition-colors cursor-pointer"
                      >
                        resend code.
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Input Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-white/5 flex gap-2 items-center bg-white/2 shrink-0"
            >
              <input
                type="text"
                disabled={loading || needsVerification}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={needsVerification ? "verification required..." : "type a message..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#A78BFA] outline-none transition-all disabled:opacity-50"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
