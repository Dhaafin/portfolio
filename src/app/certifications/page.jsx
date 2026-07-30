import CertificationLedger from "@/components/organism/certifications/CertificationLedger";
import { db } from "@/lib/db/index.js";

export const metadata = {
  title: "Certifications | Dhaafin",
  description: "Verified credentials and professional certifications earned by Dhaafin.",
};

export default async function CertificationsPage() {
  const certifications = await db.query.certifications.findMany({
    orderBy: (certifications, { asc }) => [asc(certifications.order)],
  });

  return (
    <main>
      <CertificationLedger certifications={certifications || []} />
    </main>
  );
}
