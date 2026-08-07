import ExperienceOrganism from "@/components/organism/experience/ExperienceOrganism";
import { getAllExperiences } from "@/services/experiences";

export const metadata = { title: "Experience | Dhaafin" };

export default async function ExperiencePage() {
  const experiences = await getAllExperiences();

  return (
    <main className="bg-background selection:bg-accent/30">
      <ExperienceOrganism experiences={experiences || []} />
    </main>
  );
}
