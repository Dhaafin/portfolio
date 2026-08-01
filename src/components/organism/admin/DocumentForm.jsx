"use client";

import { useState } from "react";
import { createDocument, updateDocument } from "@/app/admin/(dashboard)/documents/actions";
import Text from "@/components/atoms/Text";
import Spinner from "@/components/atoms/Spinner";

export default function DocumentForm({ document = null }) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.target);
    
    let result;
    if (document) {
      result = await updateDocument(document.id, formData);
    } else {
      result = await createDocument(formData);
    }

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-8 pb-20">
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
            defaultValue={document?.title}
            placeholder="e.g., Curriculum Vitae / Biography"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Category.</label>
          <select
            name="category"
            defaultValue={document?.category || "general"}
            className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all text-white cursor-pointer"
          >
            <option value="general">General Context</option>
            <option value="resume">Resume / CV Details</option>
            <option value="projects">Projects narrative</option>
            <option value="about">About / Bio</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Document Content (Markdown / Plain Text).</label>
        <textarea
          name="content"
          required
          rows="15"
          defaultValue={document?.content}
          placeholder="Enter the detailed document text here for the chatbot to use as RAG context..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/20 outline-none transition-all resize-y text-white"
          data-lenis-prevent
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-max px-12 py-4 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isPending ? (
          <>
            <Spinner size="xs" color="black" />
            <span>Saving changes...</span>
          </>
        ) : document ? (
          "Update Document"
        ) : (
          "Create Document"
        )}
      </button>
    </form>
  );
}
