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

export default function ProjectCard({ project, onExplore, nodeColor = "#A78BFA" }) {
  return (
    <div className="relative group pl-12 sm:pl-24 md:pl-32 lg:pl-48">
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
              onClick={() => onExplore(project)}
              className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-950 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_15px_rgba(167,139,250,0.25)] hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] px-5 py-2.5 rounded-full cursor-pointer hover:brightness-110"
              style={{ backgroundColor: nodeColor }}
            >
              explore details.
            </button>
          )}

          {parseGithubUrls(project.github_url).map((url, index, arr) => (
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
  );
}
