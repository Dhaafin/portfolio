"use client";

import { useState } from "react";
import { login } from "./actions";
import Text from "@/components/atoms/Text";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/2 border border-white/5 backdrop-blur-3xl rounded-[2rem] p-12 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

        <header className="text-center">
          <Text className="text-xs tracking-[0.4em] uppercase font-bold text-white/30 mb-2">
            Authentication
          </Text>
          <Text as="h1" className="text-4xl font-black lowercase tracking-tighter">
            control center<span className="text-primary">.</span>
          </Text>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@antigravity.io"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
              Secret Key
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all duration-300"
          >
            {isPending ? "Establishing Link..." : "Enter Void"}
          </button>
        </form>

        <footer className="text-center">
          <Text className="text-[10px] tracking-widest text-white/20 uppercase font-bold">
            Authorized Personnel Only
          </Text>
        </footer>
      </div>
    </div>
  );
}
