import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import Link from "next/link";

export const metadata = { title: "Manage Projects | Admin" };

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const nodeColor = "#A78BFA";

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            Content Manager
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
            projects<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>

        <Link 
          href="/admin/projects/new" 
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          add project.
        </Link>
      </header>

      <div className="grid gap-4">
        {projects?.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No projects found in the void.</Text>
            <Link href="/admin/projects/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize first record.
            </Link>
          </div>
        ) : (
          projects?.map((project) => (
            <div 
              key={project.id}
              className="group p-6 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border/20 overflow-hidden flex items-center justify-center">
                  {project.image_url ? (
                    <img src={project.image_url} alt="" className="w-full h-full object-cover opacity-50" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Text className="text-lg font-black tracking-tight">{project.title}</Text>
                    {project.is_published ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest">
                        Draft
                      </span>
                    )}
                  </div>
                  <Text className="text-xs text-muted/60 tracking-wider">
                    {project.role} — {project.year}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link 
                  href={`/admin/projects/edit/${project.id}`}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Edit
                </Link>
                <button className="px-4 py-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
