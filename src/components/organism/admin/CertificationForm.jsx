"use client";

import { useState } from "react";
import { createCertification, updateCertification } from "@/app/admin/(dashboard)/certifications/actions";
import Text from "@/components/atoms/Text";

export default function CertificationForm({ certification = null }) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.target);
    
    let result;
    if (certification) {
      result = await updateCertification(certification.id, formData);
    } else {
      result = await createCertification(formData);
    }

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-8 pb-20">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Title.</label>
          <input
            name="title"
            required
            defaultValue={certification?.title}
            placeholder="e.g., AWS Certified Solutions Architect"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Issuer.</label>
          <input
            name="issuer"
            required
            defaultValue={certification?.issuer}
            placeholder="e.g., Amazon Web Services"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Issuer Short (Echo).</label>
          <input
            name="issuer_short"
            required
            defaultValue={certification?.issuer_short}
            placeholder="e.g., AWS"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Issue Date (YYYY-MM).</label>
          <input
            name="issue_date"
            required
            defaultValue={certification?.issue_date}
            placeholder="2025-03"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Credential URL.</label>
          <input
            name="credential_url"
            defaultValue={certification?.credential_url}
            placeholder="https://..."
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Thematic Color (HEX).</label>
          <input
            name="color"
            type="color"
            defaultValue={certification?.color || "#60A5FA"}
            className="bg-white/5 border border-white/10 rounded-xl px-2 py-1 h-[46px] w-full cursor-pointer focus:border-white/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Sort Order.</label>
          <input
            name="order"
            type="number"
            defaultValue={certification?.order || 0}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Skills (Comma separated).</label>
        <textarea
          name="skills"
          rows="2"
          defaultValue={certification?.skills?.join(", ")}
          placeholder="e.g., Cloud Architecture, EC2, S3"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all resize-none"
          data-lenis-prevent
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-max px-12 py-4 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isPending ? "Syncing with records..." : certification ? "Update Credential" : "Seal Credential"}
      </button>
    </form>
  );
}
