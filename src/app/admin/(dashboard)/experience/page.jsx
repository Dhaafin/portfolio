import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import DeleteExperienceButton from "@/components/organism/admin/DeleteExperienceButton";

export const metadata = { title: "Manage Experience | Admin" };

export default async function AdminExperiencePage() {
  const supabase = await createClient();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("order", { ascending: false });

  const nodeColor = "#6366F1"; // Indigo/Indigo accent

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            History Manager
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
            experience<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>

        <Link 
          href="/admin/experience/new" 
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          add experience.
        </Link>
      </header>

      <div className="grid gap-4">
        {!experiences || experiences.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No historical records found.</Text>
            <Link href="/admin/experience/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize your first era.
            </Link>
          </div>
        ) : (
          experiences.map((exp) => (
            <div 
              key={exp.id}
              className="group p-4 sm:p-6 bg-white/2 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-all duration-500 gap-6"
            >
              <div className="flex items-center gap-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: `${exp.color}10` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Text className="text-lg font-black tracking-tight">{exp.company}</Text>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest">
                      {exp.year}
                    </span>
                  </div>
                  <Text className="text-xs text-muted/60 tracking-wider">
                    {exp.role} — {exp.era}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <Link 
                  href={`/admin/experience/edit/${exp.id}`}
                  className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Edit
                </Link>
                <div className="flex-1 md:flex-none">
                  <DeleteExperienceButton id={exp.id} company={exp.company} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
