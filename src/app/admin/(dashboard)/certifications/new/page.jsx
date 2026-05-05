import CertificationForm from "@/components/organism/admin/CertificationForm";
import Text from "@/components/atoms/Text";
import Link from "next/link";

export const metadata = { title: "New Credential | Admin" };

export default function NewCertificationPage() {
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
          Creation Vault
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          new credential<span className="text-primary">.</span>
        </Text>
      </header>

      <CertificationForm />
    </div>
  );
}
