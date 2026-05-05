import CertificationLedger from "@/components/organism/certifications/CertificationLedger";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Certifications | Dhaafin",
  description: "Verified credentials and professional certifications earned by Dhaafin.",
};

export default async function CertificationsPage() {
  const supabase = await createClient();

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("order", { ascending: true });

  return (
    <main>
      <CertificationLedger certifications={certifications || []} />
    </main>
  );
}
