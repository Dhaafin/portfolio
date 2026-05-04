import Text from "@/components/atoms/Text";
import Link from "next/link";

const projects = [
  { id: 1, title: "project one.", role: "full-stack" },
  { id: 2, title: "project two.", role: "frontend" },
  { id: 3, title: "project three.", role: "backend" },
];

const Projects = () => {
  return (
    <section className="py-32 px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6 mb-24">
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-muted/50">
            selected works.
          </Text>
          <div className="h-[1px] flex-grow bg-border"></div>
        </div>

        <div className="flex flex-col gap-32">
          {projects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              {/* Project Image Placeholder - Huge, minimal */}
              <div className="w-full aspect-[21/9] md:aspect-[21/7] bg-muted/5 group-hover:bg-muted/10 transition-colors duration-700 rounded-sm mb-8 flex items-center justify-center border border-border/50">
                 <Text className="text-muted/30 font-medium tracking-widest uppercase text-sm">
                   [ visual asset ]
                 </Text>
              </div>
              
              {/* Project Info - Damp Copywriting */}
              <div className="flex justify-between items-end">
                <Text as="h3" className="text-4xl md:text-5xl font-bold lowercase tracking-tight group-hover:text-accent transition-colors duration-500">
                  {project.title}
                </Text>
                <Text className="text-muted font-medium uppercase tracking-[0.2em] text-xs">
                  {project.role}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
