"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ChatHeader from "./molecules/ChatHeader";
import ChatBubble from "./molecules/ChatBubble";
import SuggestedQuestions from "./molecules/SuggestedQuestions";
import OtpGate from "./molecules/OtpGate";
import ChatInput from "./molecules/ChatInput";
import Spinner from "@/components/atoms/Spinner";
import useChatbot from "./useChatbot";

export default function ChatbotWidget() {
  const pathname = usePathname();
  
  const {
    isOpen, setIsOpen,
    isSystemPaused,
    email, setEmail,
    otpCode, setOtpCode,
    token,
    otpSent, setOtpSent,
    loading,
    error,
    messages,
    input, setInput,
    turnstileToken,
    needsVerification, setNeedsVerification,
    queriesLeft,
    loadingText,
    suggestedQuestions,
    telemetryIndex,
    messagesEndRef,
    turnstileContainerRef,
    widgetRef,
    toggleButtonRef,
    handleSendOtp,
    handleVerifyOtp,
    handleSendMessage,
    handleSelectSuggestedQuestion
  } = useChatbot();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const handleToggle = () => {
    if (isSystemPaused) return;
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Toggle Button Wrapper */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end group">
        {/* Tooltip on Maintenance */}
        {isSystemPaused && (
          <div className="absolute bottom-16 right-0 bg-[#0c0f17]/95 border border-red-500/20 text-red-400 text-[10px] tracking-wider uppercase font-black px-3.5 py-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] whitespace-nowrap mb-2 pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2" />
            chatbot on maintenance
          </div>
        )}

        <button
          ref={toggleButtonRef}
          onClick={handleToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
            isSystemPaused 
              ? 'bg-[#121620]/80 text-white/30 border border-white/5 cursor-not-allowed opacity-60' 
              : 'bg-[#A78BFA] text-[#050505] shadow-[0_0_24px_rgba(167,139,250,0.4)] hover:shadow-[0_0_40px_rgba(167,139,250,0.6)] hover:scale-105 active:scale-95'
          } ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        >
          {isSystemPaused ? (
            <svg className="w-5 h-5 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : isOpen ? (
            <span className="text-xl font-light">×</span>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && !isSystemPaused && (
          <motion.div
            ref={widgetRef}
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

              {!loading && !needsVerification && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                <SuggestedQuestions
                  suggestedQuestions={suggestedQuestions}
                  onSelect={handleSelectSuggestedQuestion}
                  loading={loading}
                />
              )}

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
