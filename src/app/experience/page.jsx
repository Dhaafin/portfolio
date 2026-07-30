import { db } from "@/lib/db/index.js";
import TacticalConstellation from "@/components/organism/experience/TacticalConstellation";

export const metadata = { title: "Experience | Dhaafin" };

export default async function ExperiencePage() {
  const experiences = await db.query.experiences.findMany({
    orderBy: (experiences, { desc }) => [desc(experiences.order)],
  });

  return (
    <main className="bg-background selection:bg-accent/30">
      <TacticalConstellation initialExperiences={experiences || []} />
    </main>
  );
}
