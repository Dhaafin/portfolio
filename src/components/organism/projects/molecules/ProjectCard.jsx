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

export default function ProjectCard({
  project,
  index = 0,
  onExplore,
  nodeColor = "#A78BFA",
}) {
  const projectIndex = String(index + 1).padStart(2, "0");

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
        {/* Project Metadata Bar (Clean Editorial Index - NO UUID) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-6">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span
              className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded border"
              style={{
                color: nodeColor,
                borderColor: `${nodeColor}40`,
                backgroundColor: `${nodeColor}15`,
              }}
            >
              PROJECT // {projectIndex}
            </span>
            <span className="text-muted/40 font-mono text-xs">•</span>
            <span className="text-muted/70 text-xs sm:text-sm tracking-[0.15em] font-mono font-semibold">
              {project.year}
            </span>
            {project.project_type && (
              <>
                <span className="text-muted/40 font-mono text-xs">•</span>
                <span className="text-muted/60 text-xs sm:text-sm tracking-[0.15em] uppercase font-mono font-medium">
                  {project.project_type}
                </span>
              </>
            )}
          </div>

          {project.role && (
            <div className="self-start sm:self-auto">
              <span
                className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-black px-3 py-1 rounded-full border bg-white/5 border-white/10"
                style={{ color: nodeColor }}
              >
                {project.role}
              </span>
            </div>
          )}
        </div>

        {/* Title & Description with Golden-Ratio Typography */}
        <div className="flex flex-col gap-4">
          <Text
            as="h2"
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground group-hover:text-white transition-colors duration-500 leading-tight"
          >
            {project.title}
          </Text>

          <Text className="text-muted/80 text-sm sm:text-base md:text-lg font-normal max-w-3xl leading-relaxed wrap-break-word">
            {project.description}
          </Text>
        </div>

        {/* Technologies Pills */}
        {project.technologies && Array.isArray(project.technologies) && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-muted/80 hover:border-white/20 hover:text-white transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Project Links & Explore Button */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {(project.details || project.video_url) && (
            <button
              onClick={() => onExplore(project)}
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-950 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_15px_rgba(167,139,250,0.25)] hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] px-6 py-2.5 rounded-full cursor-pointer hover:brightness-110 flex items-center gap-2"
              style={{ backgroundColor: nodeColor }}
            >
              explore details
              <span>→</span>
            </button>
          )}

          {parseGithubUrls(project.github_url).map((url, index, arr) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-muted/80 hover:text-white px-4 py-2 rounded-full border border-border hover:border-white/20 bg-white/5 transition-all flex items-center gap-2"
            >
              {arr.length > 1 ? getGithubLabel(url, index) : "github"}{" "}
              <span className="text-accent">↗</span>
            </a>
          ))}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-muted/80 hover:text-white px-4 py-2 rounded-full border border-border hover:border-white/20 bg-white/5 transition-all flex items-center gap-2"
            >
              live demo <span className="text-accent">↗</span>
            </a>
          )}
        </div>

        {/* Cinematic Image / Visual Asset */}
        <div className="w-full aspect-16/10 md:aspect-21/9 bg-surface border border-border/20 rounded-xl overflow-hidden relative group-hover:border-white/10 transition-colors duration-700 mt-2">
          {project.video_url && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest font-bold text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              video demo
            </div>
          )}
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-700"
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
