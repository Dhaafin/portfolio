import { db } from "@/lib/db/index.js";

export async function getLandingCertifications() {
  return db.query.certifications.findMany({
    orderBy: (certifications, { asc }) => [asc(certifications.order)],
    limit: 3,
  });
}

export async function getAllCertifications() {
  return db.query.certifications.findMany({
    orderBy: (certifications, { asc }) => [asc(certifications.order)],
  });
}
