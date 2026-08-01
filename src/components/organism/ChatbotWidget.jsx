"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ChatHeader from "../molecules/chat/ChatHeader";
import ChatBubble from "../molecules/chat/ChatBubble";
import SuggestedQuestions from "../molecules/chat/SuggestedQuestions";
import OtpGate from "../molecules/chat/OtpGate";
import ChatInput from "../molecules/chat/ChatInput";
import Spinner from "@/components/atoms/Spinner";

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
    { role: "assistant", content: "blup. hello! ask me anything about my projects, skills, or experience." }
  ]);
  const [input, setInput] = useState("");
  const [turnstileToken, setTokenState] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [queriesLeft, setQueriesLeft] = useState(3);
  const [loadingText, setLoadingText] = useState("thinking...");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

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

    const questionPool = [
      "what are your top projects?",
      "how can I contact you?",
      "what is your technical stack?",
      "tell me about your background.",
      "are you open to freelance projects?",
      "what certifications do you hold?",
      "why did you choose turso & drizzle?",
      "how would you describe your coding style?"
    ];
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 3));
  }, []);

  const [telemetryIndex, setTelemetryIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (loading && needsVerification) {
      setTelemetryIndex(0);
      interval = setInterval(() => {
        setTelemetryIndex((prev) => (prev < 4 ? prev + 1 : prev));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [loading, needsVerification]);

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
              sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
              callback: (tToken) => setTokenState(tToken),
              "expired-callback": () => setTokenState(null),
              "error-callback": () => setTokenState(null)
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
        const successContent = email === "dhaafinm@gmail.com"
          ? "verification successful. you have unlocked unlimited queries."
          : "verification successful. you have unlocked 10 more queries.";
        setMessages(prev => [...prev, { role: "assistant", content: successContent }]);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const performSend = async (userMessage) => {
    if (!userMessage.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    const loadingPhrases = [
      "thinking...",
      "analyzing records...",
      "querying knowledgebase...",
      "retrieving database...",
      "generating response...",
      "synthesizing answer...",
      "processing query...",
      "searching documents...",
      "aligning context...",
      "accessing database..."
    ];
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
    setLoadingText(randomPhrase);

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
        
        // Shuffle new suggested questions
        const questionPool = [
          "what are your top projects?",
          "how can I contact you?",
          "what is your technical stack?",
          "tell me about your background.",
          "are you open to freelance projects?",
          "what certifications do you hold?",
          "why did you choose turso & drizzle?",
          "how would you describe your coding style?"
        ];
        const shuffled = [...questionPool].filter(item => item !== userMessage).sort(() => 0.5 - Math.random());
        setSuggestedQuestions(shuffled.slice(0, 3));

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

  const handleSendMessage = async (e) => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    await performSend(msg);
  };

  const handleSelectSuggestedQuestion = async (q) => {
    await performSend(q);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#A78BFA] text-[#050505] flex items-center justify-center shadow-[0_0_24px_rgba(167,139,250,0.4)] hover:shadow-[0_0_40px_rgba(167,139,250,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer ${isOpen ? 'hidden sm:flex' : 'flex'}`}
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
            className="fixed inset-0 w-full h-full rounded-none sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[520px] sm:rounded-3xl bg-[#04070c]/90 sm:bg-[#04070c]/75 backdrop-blur-2xl border-0 sm:border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-[100]"
          >
            {/* Ambient Background Glow Orb */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A78BFA]/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-[#C084FC]/5 blur-[90px] rounded-full pointer-events-none" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Header */}
            <ChatHeader
              token={token}
              queriesLeft={queriesLeft}
              onClose={() => setIsOpen(false)}
            />

            {/* Messages Area */}
            <div
              className="relative flex-1 overflow-y-auto p-6 flex flex-col gap-5 z-10"
              data-lenis-prevent
            >
              {messages.map((msg, i) => {
                const isLatest = i === messages.length - 1;
                const shouldAnimate = msg.role === "assistant" && isLatest;

                return (
                  <ChatBubble
                    key={i}
                    msg={msg}
                    shouldAnimate={shouldAnimate}
                  />
                );
              })}

              <SuggestedQuestions
                suggestedQuestions={suggestedQuestions}
                onSelect={handleSelectSuggestedQuestion}
                loading={loading}
              />

              {loading && !needsVerification && (
                <div className="self-start flex gap-3 items-center bg-white/[0.02] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none shrink-0 shadow-sm">
                  <Spinner size="xs" color="primary" />
                  <span className="text-[10px] text-white/45 lowercase tracking-wider font-mono">
                    {loadingText}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* OTP Verification Gate Overlay */}
            {needsVerification && (
              <OtpGate
                loading={loading}
                error={error}
                otpSent={otpSent}
                email={email}
                setEmail={setEmail}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                handleSendOtp={handleSendOtp}
                handleVerifyOtp={handleVerifyOtp}
                setNeedsVerification={setNeedsVerification}
                setOtpSent={setOtpSent}
                telemetryIndex={telemetryIndex}
                turnstileContainerRef={turnstileContainerRef}
                turnstileToken={turnstileToken}
                hasTurnstileKey={!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              />
            )}

            {/* Input Footer */}
            <ChatInput
              loading={loading}
              needsVerification={needsVerification}
              input={input}
              setInput={setInput}
              onSubmit={handleSendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
