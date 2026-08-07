import { db } from "@/lib/db/index.js";

export async function getLandingExperiences() {
  return db.query.experiences.findMany({
    orderBy: (experiences, { asc }) => [asc(experiences.order)],
    limit: 3,
  });
}
