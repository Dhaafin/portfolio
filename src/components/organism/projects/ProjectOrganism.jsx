"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ProjectCard from "./molecules/ProjectCard";
import ProjectDetailModal from "./molecules/ProjectDetailModal";

export default function ProjectOrganism({ projects = [] }) {
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
          <ProjectCard
            key={project.id}
            project={project}
            onExplore={setActiveProject}
            nodeColor={nodeColor}
          />
        ))}
      </div>

      {/* Glassmorphic Project Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetailModal
            activeProject={activeProject}
            onClose={() => setActiveProject(null)}
            nodeColor={nodeColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
