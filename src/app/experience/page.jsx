import { createClient } from "@/lib/supabase/server";
import TacticalConstellation from "@/components/organism/experience/TacticalConstellation";

export const metadata = { title: "Experience | Dhaafin" };

export default async function ExperiencePage() {
  const supabase = await createClient();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("order", { ascending: false });

  return (
    <main className="bg-background selection:bg-accent/30">
      <TacticalConstellation initialExperiences={experiences || []} />
    </main>
  );
}
