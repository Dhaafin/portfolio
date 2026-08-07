"use client";

import { motion } from "framer-motion";
import Text from "@/components/atoms/Text";

const parseGithubUrls = (urlStr) => {
  if (!urlStr) return [];
  return urlStr.split(",")
    .map(url => url.trim())
    .filter(url => url.length > 0);
};

const getGithubLabel = (url, index) => {
  try {
    const parts = url.replace(/\/$/, "").split("/");
    if (parts.length >= 2) {
      return parts[parts.length - 1];
    }
  } catch (e) {}
  return `github #${index + 1}`;
};

export default function ProjectDetailModal({ activeProject, onClose, nodeColor = "#A78BFA" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
        className="relative w-full max-w-3xl glass max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-10 md:p-12 flex flex-col gap-8 shadow-2xl z-10"
        data-lenis-prevent
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-8 h-8 flex items-center justify-center text-xl text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/15 rounded-full border border-white/10 cursor-pointer z-20 font-light"
        >
          ×
        </button>

        {/* Modal Header */}
        <header className="flex flex-col gap-2 border-b border-border/20 pb-6 pr-12 shrink-0">
          <Text className="text-muted/50 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
            {activeProject.id} — {activeProject.year} {activeProject.project_type && `// ${activeProject.project_type}`}
          </Text>
          <Text
            as="h3"
            className="text-3xl sm:text-4xl md:text-5xl font-black lowercase tracking-tighter text-white"
          >
            {activeProject.title}
          </Text>
          <Text
            className="text-xs sm:text-sm tracking-[0.2em] uppercase font-bold mt-2"
            style={{ color: nodeColor }}
          >
            {activeProject.role}
          </Text>
        </header>

        {/* Cinematic Banner Image */}
        {activeProject.image_url && (
          <div className="w-full aspect-16/9 sm:aspect-21/9 bg-surface border border-border/20 rounded-2xl overflow-hidden relative shrink-0">
            <img
              src={activeProject.image_url}
              alt={activeProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Detailed Content */}
        <div className="flex flex-col gap-6">
          <Text className="text-muted/90 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {activeProject.details}
          </Text>
        </div>

        {/* Technologies Used */}
        {activeProject.technologies && Array.isArray(activeProject.technologies) && (
          <div className="flex flex-col gap-3">
            <Text className="text-muted/40 text-[10px] uppercase tracking-widest font-bold">
              stack.
            </Text>
            <div className="flex flex-wrap gap-2">
              {activeProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded bg-accent/5 border border-border text-accent/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions / Links */}
        <footer className="flex items-center gap-6 mt-4 pt-6 border-t border-border/20">
          {parseGithubUrls(activeProject.github_url).map((url, index, arr) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted hover:text-white transition-colors flex items-center gap-2"
            >
              {arr.length > 1 ? getGithubLabel(url, index) : "github"} <span className="text-accent">↗</span>
            </a>
          ))}
          {activeProject.demo_url && (
            <a
              href={activeProject.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted hover:text-white transition-colors flex items-center gap-2"
            >
              live demo <span className="text-accent">↗</span>
            </a>
          )}
        </footer>
      </motion.div>
    </div>
  );
}
