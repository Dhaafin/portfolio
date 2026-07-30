import CertificationForm from "@/components/organism/admin/CertificationForm";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import { db } from "@/lib/db/index.js";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Credential | Admin" };

export default async function EditCertificationPage({ params }) {
  const { id } = await params;

  const certification = await db.query.certifications.findFirst({
    where: (certifications, { eq }) => eq(certifications.id, id),
  });

  if (!certification) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12">
      <header>
        <Link 
          href="/admin/certifications" 
          className="inline-block mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
        >
          ← back to certifications.
        </Link>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Modification Vault
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          edit credential<span style={{ color: certification.color }}>.</span>
        </Text>
      </header>

      <CertificationForm certification={certification} />
    </div>
  );
}
