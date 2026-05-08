import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import SortableProjectList from "@/components/organism/admin/SortableProjectList";

export const metadata = { title: "Manage Projects | Admin" };

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

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

      <div>
        {!projects || projects.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No projects found in the void.</Text>
            <Link href="/admin/projects/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize first record.
            </Link>
          </div>
        ) : (
          <SortableProjectList initialItems={projects} />
        )}
      </div>
    </div>
  );
}
