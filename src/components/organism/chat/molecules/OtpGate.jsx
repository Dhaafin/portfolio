"use client";

import Text from "@/components/atoms/Text";
import Spinner from "@/components/atoms/Spinner";

export default function OtpGate({
  loading,
  error,
  otpSent,
  email,
  setEmail,
  otpCode,
  setOtpCode,
  handleSendOtp,
  handleVerifyOtp,
  setNeedsVerification,
  setOtpSent,
  telemetryIndex,
  turnstileContainerRef,
  turnstileToken,
  hasTurnstileKey
}) {
  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center p-8 z-10">
      {loading ? (
        // Gamified Loading Screen
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#A78BFA]/20 animate-ping" />
            <Spinner size="xl" color="primary" className="absolute animate-spin" />
            <div className="w-2 h-2 rounded-full bg-[#A78BFA]" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Text className="text-[9px] uppercase tracking-[0.22em] font-black text-[#A78BFA]">
              secure connection active
            </Text>
            <Text className="text-lg font-black text-white tracking-tight lowercase font-jost">
              transmitting otp.
            </Text>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 border border-white/10 rounded-full h-1 overflow-hidden">
            <div
              className="bg-[#A78BFA] h-full transition-all duration-300 ease-out"
              style={{ width: `${(telemetryIndex + 1) * 20}%` }}
            />
          </div>

          {/* Telemetry Logs Terminal */}
          <div className="w-full bg-black/50 border border-white/5 p-4 rounded-xl font-mono text-[9px] text-white/40 flex flex-col gap-1 text-left min-h-[90px] justify-end">
            {Array.from({ length: telemetryIndex + 1 }).map((_, logIdx) => {
              const logs = [
                "establishing handshake...",
                "resolving captcha challenge...",
                "connecting to smtp.gmail.com...",
                "signing payload tokens...",
                "code dispatched. check your inbox."
              ];
              const isActive = logIdx === telemetryIndex;
              return (
                <div key={logIdx} className={`${isActive ? "text-[#A78BFA] font-bold" : "text-white/30"}`}>
                  &gt; {logs[logIdx]}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
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
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-xs text-white placeholder-white/20 focus:border-[#A78BFA] outline-none transition-all"
              />
              
              {/* Cloudflare Turnstile Container */}
              <div ref={turnstileContainerRef} className="my-1 flex justify-center scale-90 origin-center" />

              <button
                type="submit"
                disabled={loading || (hasTurnstileKey && !turnstileToken)}
                className="w-full py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                get verify code.
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
                verify & unlock.
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
        </>
      )}
    </div>
  );
}
