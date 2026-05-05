import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import ExperienceForm from "../../components/ExperienceForm";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Experience | Admin" };

export default async function EditExperiencePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: experience } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!experience) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12">
      <header>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Modification Terminal
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          edit era<span className="text-accent">.</span>
        </Text>
        <Text className="text-sm text-muted/60 mt-2">
          Refining history for {experience.company}
        </Text>
      </header>

      <ExperienceForm initialData={experience} />
    </div>
  );
}
