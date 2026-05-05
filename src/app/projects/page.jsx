import Text from "@/components/atoms/Text";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Projects | Dhaafin" };

const mockProjects = [
  { 
    id: "01", 
    title: "project one.", 
    role: "full-stack", 
    year: "2026",
    description: "a state-of-the-art e-commerce platform built with next.js and supabase. features real-time inventory management and a custom 3d product configurator."
  },
  { 
    id: "02", 
    title: "project two.", 
    role: "frontend", 
    year: "2025",
    description: "an award-winning marketing site for a luxury automotive brand. intense focus on webgl animations and scroll-linked micro-interactions."
  },
  { 
    id: "03", 
    title: "project three.", 
    role: "backend", 
    year: "2025",
    description: "a high-performance microservice architecture designed to handle millions of concurrent websocket connections for a live auction application."
  },
];

export default async function ProjectsPage() {
  const nodeColor = "#A78BFA"; 

  const supabase = await createClient();
  const { data: dbProjects } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

  // Use DB projects if available, otherwise fallback to mock data
  const projects = dbProjects?.length > 0 ? dbProjects : mockProjects;

  return (
    <div className="min-h-screen relative w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-16 sm:py-24 md:py-32 overflow-x-hidden">
      
      {/* Back navigation */}
      <Link href="/" className="inline-block mb-24 text-xs font-bold uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors">
        ← back.
      </Link>

      {/* Page Header (Root of the Timeline) */}
      <header className="relative mb-16 sm:mb-24 md:mb-32 ml-10 sm:ml-16 md:ml-32">
        <Text className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold mb-4" style={{ color: nodeColor }}>
          selected projects.
        </Text>
        <Text as="h1" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black lowercase tracking-tighter leading-none">
          projects<span style={{ color: nodeColor }}>.</span>
        </Text>
      </header>

      {/* The Timeline Container */}
      <div className="relative">
        
        {/* The Continuous Vertical Line */}
        <div 
          className="absolute top-0 bottom-0 left-[15px] sm:left-[27px] md:left-[35px] w-[2px] opacity-20"
          style={{ background: `linear-gradient(to bottom, ${nodeColor}, transparent)` }}
        />

        {/* Project List */}
        <div className="flex flex-col gap-48">
          {projects.map((project, index) => (
            <div key={project.id} className="relative group pl-12 sm:pl-24 md:pl-32 lg:pl-48">
              
              {/* The Timeline Node for this Project */}
              <div 
                className="absolute top-8 left-[15px] sm:left-[27px] md:left-[35px] w-3 h-3 sm:w-4 sm:h-4 rounded-full -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(167,139,250,0.4)] group-hover:scale-150 transition-transform duration-500"
                style={{ backgroundColor: nodeColor }}
              >
                {/* Inner glowing core */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ backgroundColor: nodeColor, transform: 'scale(2)', opacity: 0.3 }}
                />
              </div>

              {/* Connecting Horizontal Dash (Optional but looks cool) */}
              <div 
                className="absolute top-[39px] left-5 sm:left-8 md:left-10 w-8 sm:w-12 md:w-20 h-[1px] opacity-20"
                style={{ backgroundColor: nodeColor }}
              />

              <div className="flex flex-col gap-8">
                {/* Project Metadata */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/20 pb-8">
                  <div className="flex flex-col gap-2">
                    <Text className="text-muted/50 text-sm tracking-[0.2em] uppercase font-bold break-all">
                      {project.id} — {project.year}
                    </Text>
                    <Text as="h2" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black lowercase tracking-tighter text-foreground group-hover:text-white transition-colors duration-500">
                      {project.title}
                    </Text>
                  </div>
                  <div className="text-left md:text-right">
                    <Text className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: nodeColor }}>
                      {project.role}
                    </Text>
                  </div>
                </div>

                {/* Brief Description */}
                <Text className="text-muted/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed break-words">
                  {project.description}
                </Text>

                {/* Cinematic Image Placeholder */}
                <div className="w-full aspect-[16/10] md:aspect-[21/9] bg-surface border border-border/20 rounded-lg overflow-hidden relative group-hover:border-white/10 transition-colors duration-700 mt-4">
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
                        <Text className="text-sm tracking-[0.5em] font-medium uppercase">placeholder</Text>
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
