import Text from "@/components/atoms/Text";
import ProjectOrganism from "@/components/organism/projects/ProjectOrganism";
import { getAllProjects } from "@/services/projects";

export const metadata = { title: "Projects | Dhaafin" };

const mockProjects = [
  {
    id: "01",
    title: "project one.",
    role: "full-stack",
    year: "2026",
    project_type: "web application",
    technologies: ["next.js", "supabase", "react", "three.js"],
    description:
      "a state-of-the-art e-commerce platform built with next.js and supabase. features real-time inventory management and a custom 3d product configurator.",
  },
  {
    id: "02",
    title: "project two.",
    role: "frontend",
    year: "2025",
    project_type: "design system",
    technologies: ["react", "webgl", "tailwind css", "framer motion"],
    description:
      "an award-winning marketing site for a luxury automotive brand. intense focus on webgl animations and scroll-linked micro-interactions.",
  },
  {
    id: "03",
    title: "project three.",
    role: "backend",
    year: "2025",
    project_type: "system service",
    technologies: ["go", "websockets", "redis", "docker"],
    description:
      "a high-performance microservice architecture designed to handle millions of concurrent websocket connections for a live auction application.",
  },
];

export default async function ProjectsPage() {
  const nodeColor = "#A78BFA";

  const dbProjects = await getAllProjects();

  // Use DB projects if available, otherwise fallback to mock data
  const projects = dbProjects?.length > 0 ? dbProjects : mockProjects;

  return (
    <div className="min-h-screen relative w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-16 sm:py-24 md:py-32 overflow-x-hidden">
      {/* Overhauled Cinematic Hero */}
      <header className="relative mb-20 sm:mb-28 md:mb-36 pl-4 sm:pl-8 md:pl-16">
        {/* Ambient Atmospheric Glow */}
        <div
          className="absolute -top-24 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: nodeColor }}
        />

        {/* Eyebrow with Astral Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em]"
            style={{ color: nodeColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: nodeColor }}
            />
            Selected Works // 2023 — 2026
          </div>
          <div className="h-px w-12 bg-linear-to-r from-white/20 to-transparent" />
        </div>

        {/* Title */}
        <Text
          as="h1"
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black lowercase tracking-tighter leading-[0.85] text-white"
        >
          projects
          <span
            style={{ color: nodeColor }}
            className="drop-shadow-[0_0_25px_rgba(167,139,250,0.5)]"
          >
            .
          </span>
        </Text>

        {/* Lead Subtitle (Bridges typography gap & fixes text ratio) */}
        <p className="text-base sm:text-lg md:text-xl text-muted/80 font-normal leading-relaxed max-w-2xl mt-6 sm:mt-8">
          An index of machine learning pipelines, signal processing research, and scalable digital architectures — built at the intersection of mathematical rigor and fluid aesthetics.
        </p>

        {/* Release Metrics Strip */}
        <div className="flex flex-wrap items-center gap-6 mt-8 sm:mt-10 pt-6 border-t border-border/20 max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="text-xs sm:text-sm font-mono font-bold"
              style={{ color: nodeColor }}
            >
              {String(projects.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted font-semibold">
              Archived Releases
            </span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden sm:block" />
          <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted/60 font-mono">
            Focus: ML & Signal Processing • Systems
          </div>
        </div>
      </header>

      {/* The Timeline Container */}
      <ProjectOrganism projects={projects} />
    </div>
  );
}
