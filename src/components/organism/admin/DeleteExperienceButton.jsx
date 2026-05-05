"use client";

import { useState } from "react";
import { deleteExperience } from "@/app/admin/(dashboard)/experience/actions";
import Text from "@/components/atoms/Text";

export default function DeleteExperienceButton({ id, company }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteExperience(id);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
      >
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="w-full max-w-md p-8 bg-surface border border-white/10 rounded-3xl">
            <Text className="text-lg font-black mb-2">Delete {company}?</Text>
            <Text className="text-muted/60 text-sm mb-8">
              This action cannot be undone. The astral connection will be severed.
            </Text>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
