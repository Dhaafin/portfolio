"use client";

import { useState } from "react";
import { deleteProject } from "@/app/admin/(dashboard)/projects/actions";

export default function DeleteProjectButton({ id, title }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteProject(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Confirm?"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
    >
      Delete
    </button>
  );
}
