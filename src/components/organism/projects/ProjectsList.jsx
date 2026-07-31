"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/atoms/Text";

export default function ProjectsList({ projects }) {
  const [activeProject, setActiveProject] = useState(null);
  const nodeColor = "#A78BFA";

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
      window.lenis?.stop();
    } else {
      document.body.style.overflow = "";
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, [activeProject]);

  return (
    <div className="relative">
      {/* The Continuous Vertical Line */}
      <div
        className="absolute top-0 bottom-0 left-[15px] sm:left-[27px] md:left-[35px] w-[2px] opacity-20"
        style={{
          background: `linear-gradient(to bottom, ${nodeColor}, transparent)`,
        }}
      />

      {/* Project List */}
      <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 lg:gap-48">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative group pl-12 sm:pl-24 md:pl-32 lg:pl-48"
          >
            {/* The Timeline Node for this Project */}
            <div
              className="absolute top-8 left-[15px] sm:left-[27px] md:left-[35px] w-3 h-3 sm:w-4 sm:h-4 rounded-full -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(167,139,250,0.4)] group-hover:scale-150 transition-transform duration-500"
              style={{ backgroundColor: nodeColor }}
            >
              {/* Inner glowing core */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  backgroundColor: nodeColor,
                  transform: "scale(2)",
                  opacity: 0.3,
                }}
              />
            </div>

            {/* Connecting Horizontal Dash */}
            <div
              className="absolute top-[39px] left-5 sm:left-8 md:left-10 w-8 sm:w-12 md:w-20 h-px opacity-20"
              style={{ backgroundColor: nodeColor }}
            />

            <div className="flex flex-col gap-8">
              {/* Project Metadata */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/20 pb-8">
                <div className="flex flex-col gap-2">
                  <Text className="text-muted/50 text-sm tracking-[0.2em] uppercase font-bold">
                    {project.id} — {project.year} {project.project_type && `// ${project.project_type}`}
                  </Text>
                  <Text
                    as="h2"
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black lowercase tracking-tighter text-foreground group-hover:text-white transition-colors duration-500"
                  >
                    {project.title}
                  </Text>
                </div>
                <div className="text-left md:text-right">
                  <Text
                    className="text-xs tracking-[0.3em] uppercase font-bold"
                    style={{ color: nodeColor }}
                  >
                    {project.role}
                  </Text>
                </div>
              </div>

              {/* Brief Description */}
              <Text className="text-muted/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed wrap-break-word">
                {project.description}
              </Text>

              {/* Technologies Pills */}
              {project.technologies && Array.isArray(project.technologies) && (
                <div className="flex flex-wrap gap-2 -mt-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded bg-accent/5 border border-border text-accent/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Project Links & Explore Button */}
              <div className="flex flex-wrap items-center gap-6 mt-2">
                {project.details && (
                  <button
                    onClick={() => setActiveProject(project)}
                    className="text-[10px] uppercase tracking-[0.25em] font-bold text-accent hover:text-white transition-colors border border-accent/20 hover:border-accent/50 px-4 py-2 rounded-full cursor-pointer"
                  >
                    explore details.
                  </button>
                )}

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted hover:text-white transition-colors flex items-center gap-2"
                  >
                    github <span className="text-accent">↗</span>
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted hover:text-white transition-colors flex items-center gap-2"
                  >
                    live demo <span className="text-accent">↗</span>
                  </a>
                )}
              </div>

              {/* Cinematic Image Placeholder */}
              <div className="w-full aspect-16/10 md:aspect-21/9 bg-surface border border-border/20 rounded-lg overflow-hidden relative group-hover:border-white/10 transition-colors duration-700 mt-4">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-blob opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity duration-700" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                      <Text className="text-sm tracking-[0.5em] font-medium uppercase">
                        placeholder
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Glassmorphic Project Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
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
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-8 text-xs font-bold uppercase tracking-[0.2em] text-muted hover:text-white transition-colors cursor-pointer"
              >
                close.
              </button>

              {/* Modal Header */}
              <header className="flex flex-col gap-2 border-b border-border/20 pb-6 pr-12">
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
                {activeProject.github_url && (
                  <a
                    href={activeProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted hover:text-white transition-colors flex items-center gap-2"
                  >
                    github <span className="text-accent">↗</span>
                  </a>
                )}
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
        )}
      </AnimatePresence>
    </div>
  );
}
