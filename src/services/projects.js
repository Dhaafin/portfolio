import { db } from "@/lib/db/index.js";

export async function getLandingProjects() {
  return db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.is_published, true),
    orderBy: (projects, { asc }) => [asc(projects.order)],
    limit: 3,
  });
}
