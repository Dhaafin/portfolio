import { db } from "@/lib/db/index.js";

export async function getLandingProjects() {
  return db.query.projects.findMany({
    where: (projects, { and, eq }) => and(
      eq(projects.is_featured, true)
    ),
    orderBy: (projects, { asc }) => [asc(projects.order)],
    limit: 3,
  });
}

export async function getAllProjects() {
  return db.query.projects.findMany({
    orderBy: (projects, { asc }) => [asc(projects.order)],
  });
}
