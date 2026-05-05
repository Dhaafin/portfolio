"use client";

import { useState } from "react";
import { deleteCertification } from "@/app/admin/(dashboard)/certifications/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteCertificationButton({ id, title }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCertification(id);
    setIsDeleting(false);
    setIsConfirming(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsConfirming(true)}
        className="w-full text-center px-4 py-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
      >
        Delete
      </button>

      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <div className="bg-surface border border-border/40 p-8 rounded-3xl max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Purge credential?</h3>
              <p className="text-muted/60 text-sm mb-8 leading-relaxed">
                Are you sure you want to remove <span className="text-foreground font-bold">{title}</span> from the astral records? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirming(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Purging..." : "Confirm Purge"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
