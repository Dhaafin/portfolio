import Text from "@/components/atoms/Text";
import Link from "next/link";
import { db } from "@/lib/db/index.js";

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

  const dbProjects = await db.query.projects.findMany({
    orderBy: (projects, { asc }) => [asc(projects.order)],
  });

  // Use DB projects if available, otherwise fallback to mock data
  const projects = dbProjects?.length > 0 ? dbProjects : mockProjects;

  return (
    <div className="min-h-screen relative w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-16 sm:py-24 md:py-32 overflow-x-hidden">
      {/* Page Header (Root of the Timeline) */}
      <header className="relative mb-16 sm:mb-24 md:mb-32 ml-10 sm:ml-16 md:ml-32">
        <Text
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold mb-4"
          style={{ color: nodeColor }}
        >
          selected projects.
        </Text>
        <Text
          as="h1"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black lowercase tracking-tighter leading-none"
        >
          projects<span style={{ color: nodeColor }}>.</span>
        </Text>
      </header>

      {/* The Timeline Container */}
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
          {projects.map((project, index) => (
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

              {/* Connecting Horizontal Dash (Optional but looks cool) */}
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

                {/* Project Links */}
                {(project.github_url || project.demo_url) && (
                  <div className="flex items-center gap-6 mt-2">
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
                )}

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
      </div>
    </div>
  );
}
