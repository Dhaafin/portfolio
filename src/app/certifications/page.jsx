import CertificationsOrganism from "@/components/organism/certifications/CertificationsOrganism";
import { getAllCertifications } from "@/services/certifications";

export const metadata = {
  title: "Certifications | Dhaafin",
  description: "Verified credentials and professional certifications earned by Dhaafin.",
};

export default async function CertificationsPage() {
  const certifications = await getAllCertifications();

  return (
    <main>
      <CertificationsOrganism certifications={certifications || []} />
    </main>
  );
}
