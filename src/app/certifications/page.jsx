import CertificationLedger from "@/components/organism/certifications/CertificationLedger";

export const metadata = {
  title: "Certifications | Dhaafin",
  description: "Verified credentials and professional certifications earned by Dhaafin.",
};

export default function CertificationsPage() {
  return (
    <main>
      <CertificationLedger />
    </main>
  );
}
