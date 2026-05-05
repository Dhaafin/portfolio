import ProjectForm from "@/components/organism/admin/ProjectForm";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Project | Admin" };

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12">
      <header>
        <Link 
          href="/admin/projects" 
          className="inline-block mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
        >
          ← back to projects.
        </Link>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Refinement Vault
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          edit project<span className="text-primary">.</span>
        </Text>
      </header>

      <ProjectForm initialData={project} id={id} />
    </div>
  );
}
