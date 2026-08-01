import HomePage from "@/components/organism/landing-page";
import { db } from "@/lib/db/index.js";

export const metadata = {
  title: "Dhaafin's Portfolio",
  description: "I build things that live on the internet. Premium digital experiences, full-stack architecture, and expressive UI.",
};

export default async function LandingPage() {
  // Parallel data fetch from Turso DB for maximum performance
  const [projects, experiences, certifications] = await Promise.all([
    db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.is_published, true),
      orderBy: (projects, { asc }) => [asc(projects.order)],
      limit: 3,
    }),
    db.query.experiences.findMany({
      orderBy: (experiences, { asc }) => [asc(experiences.order)],
      limit: 3,
    }),
    db.query.certifications.findMany({
      orderBy: (certifications, { asc }) => [asc(certifications.order)],
      limit: 3,
    }),
  ]);

  return (
    <HomePage
      projects={projects || []}
      experiences={experiences || []}
      certifications={certifications || []}
    />
  );
}