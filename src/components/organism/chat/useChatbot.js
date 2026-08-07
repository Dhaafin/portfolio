"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CHAT_CONFIG } from "@/config/chat.config.js";

export default function useChatbot() {
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
  const [queriesLeft, setQueriesLeft] = useState(CHAT_CONFIG.limits.freeQueriesPerIp);
  const [loadingText, setLoadingText] = useState("thinking...");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const widgetRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Close widget when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

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
      setQueriesLeft(Math.max(0, CHAT_CONFIG.limits.freeQueriesPerIp - parseInt(savedCount, 10)));
    }

    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("chat_session_id", sessionId);
    }

    const shuffled = [...CHAT_CONFIG.questionPool].sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 3));
  }, []);

  // Telemetry logs ticker for OTP console loading
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

  // Dynamically load Turnstile script without duplication
  useEffect(() => {
    if (isOpen && !window.turnstile) {
      const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
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

  const handleSendOtp = useCallback(async (e) => {
    if (e) e.preventDefault();
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
  }, [email, turnstileToken]);

  const handleVerifyOtp = useCallback(async (e) => {
    if (e) e.preventDefault();
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
          : `verification successful. you have unlocked ${CHAT_CONFIG.limits.authQueriesPerEmail} more queries.`;
        setMessages(prev => [...prev, { role: "assistant", content: successContent }]);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }, [email, otpCode]);

  const performSend = useCallback(async (userMessage) => {
    if (!userMessage.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    const randomPhrase = CHAT_CONFIG.loadingPhrases[Math.floor(Math.random() * CHAT_CONFIG.loadingPhrases.length)];
    setLoadingText(randomPhrase);

    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem("chat_session_id") || "";
      const headers = { 
        "Content-Type": "application/json",
        "X-Session-ID": sessionId
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: userMessage, sessionId })
      });
      
      const data = await res.json();
      
      if (res.status === 401 || data.needsVerification) {
        setNeedsVerification(true);
        setMessages(prev => [...prev, { role: "assistant", content: `you have reached your free query limit. please verify your email to unlock ${CHAT_CONFIG.limits.authQueriesPerEmail} more queries.` }]);
      } else if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        
        const shuffled = [...CHAT_CONFIG.questionPool].filter(item => item !== userMessage).sort(() => 0.5 - Math.random());
        setSuggestedQuestions(shuffled.slice(0, 3));

        if (!token) {
          const currentCount = parseInt(localStorage.getItem("chat_free_count") || "0", 10) + 1;
          localStorage.setItem("chat_free_count", currentCount.toString());
          setQueriesLeft(Math.max(0, CHAT_CONFIG.limits.freeQueriesPerIp - currentCount));
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
  }, [token, loading]);

  const handleSendMessage = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    await performSend(msg);
  }, [input, performSend]);

  const handleSelectSuggestedQuestion = useCallback(async (q) => {
    await performSend(q);
  }, [performSend]);

  return {
    isOpen, setIsOpen,
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
  };
}
