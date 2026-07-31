"use client";

import { useState } from "react";
import Text from "@/components/atoms/Text";
import { createExperience, updateExperience } from "../actions";
import { motion } from "framer-motion";

const PRESET_COLORS = [
  { name: "Vibrant Blue", value: "hsl(217, 91%, 60%)" },
  { name: "Deep Indigo", value: "hsl(250, 80%, 65%)" },
  { name: "Cosmic Purple", value: "hsl(280, 70%, 60%)" },
  { name: "Neon Cyan", value: "hsl(190, 90%, 55%)" },
  { name: "Emerald Glow", value: "hsl(160, 80%, 45%)" },
  { name: "Ruby Pulse", value: "hsl(350, 80%, 55%)" },
  { name: "Sunset Orange", value: "hsl(20, 90%, 60%)" },
  { name: "Royal Gold", value: "hsl(45, 90%, 50%)" },
  { name: "Silver Mist", value: "hsl(210, 20%, 80%)" },
  { name: "Rose Quartz", value: "hsl(330, 70%, 75%)" },
  { name: "Electric Lime", value: "hsl(80, 90%, 50%)" },
  { name: "Deep Ocean", value: "hsl(220, 50%, 30%)" },
  { name: "Midnight Berry", value: "hsl(300, 40%, 40%)" },
  { name: "Forest Shade", value: "hsl(140, 30%, 30%)" },
  { name: "Desert Sand", value: "hsl(35, 40%, 70%)" },
  { name: "Lavender Breeze", value: "hsl(260, 50%, 80%)" },
  { name: "Mint Fresh", value: "hsl(150, 40%, 85%)" },
  { name: "Amber Warmth", value: "hsl(40, 80%, 60%)" },
  { name: "Sky Clarity", value: "hsl(200, 80%, 75%)" },
  { name: "Obsidian Edge", value: "hsl(222, 10%, 20%)" },
];

export default function ExperienceForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(initialData?.color || PRESET_COLORS[0].value);

  const isEdit = !!initialData;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const result = isEdit 
      ? await updateExperience(initialData.id, formData)
      : await createExperience(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Year</label>
          <input 
            name="year"
            defaultValue={initialData?.year}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. 2024"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Era</label>
          <input 
            name="era"
            defaultValue={initialData?.era}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. present."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Company</label>
          <input 
            name="company"
            defaultValue={initialData?.company}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. Astra Dynamic."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Role</label>
          <input 
            name="role"
            defaultValue={initialData?.role}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. Lead Frontend Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Period</label>
          <input 
            name="period"
            defaultValue={initialData?.period}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. 2024 — present"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Order (Priority)</label>
          <input 
            name="order"
            type="number"
            defaultValue={initialData?.order || 0}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Era Branding Color</label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 p-4 bg-white/2 border border-white/5 rounded-2xl">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className="relative w-full aspect-square rounded-lg group transition-all"
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <motion.div 
                  layoutId="active-color"
                  className="absolute -inset-1 border-2 border-white rounded-xl z-10"
                />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </button>
          ))}
        </div>
        <input type="hidden" name="color" value={selectedColor} />
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 self-start">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor }} />
          <Text className="text-[10px] font-mono opacity-50 uppercase">{selectedColor}</Text>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Achievements (One point per line)</label>
        <textarea 
          name="points"
          defaultValue={initialData?.points?.join("\n")}
          required
          rows={6}
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all resize-none"
          placeholder="Developed high-performance visual engines...&#10;Collaborated with cross-functional teams...&#10;Optimized WebGL rendering pipelines..."
          data-lenis-prevent
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Skills (comma separated)</label>
        <input 
          name="skills"
          defaultValue={initialData?.skills?.join(", ")}
          required
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
          placeholder="React, Next.js, TypeScript..."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Syncing..." : isEdit ? "Update Era" : "Initialize Era"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-8 py-4 rounded-full bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
