"use client";

import { useState } from "react";
import Text from "@/components/atoms/Text";
import { createExperience, updateExperience } from "../actions";

export default function ExperienceForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Indicator Color (HSL/Hex)</label>
          <input 
            name="color"
            defaultValue={initialData?.color}
            required
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all"
            placeholder="e.g. hsl(217, 91%, 60%)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Description</label>
        <textarea 
          name="description"
          defaultValue={initialData?.description}
          required
          rows={4}
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-accent outline-none transition-all resize-none"
          placeholder="Describe your achievements..."
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
