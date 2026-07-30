import Text from "@/components/atoms/Text";
import ProjectsList from "@/components/organism/projects/ProjectsList";
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
      <ProjectsList projects={projects} />
    </div>
  );
}
