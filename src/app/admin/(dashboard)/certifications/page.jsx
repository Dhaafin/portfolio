import { db } from "@/lib/db/index.js";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import SortableCertificationList from "@/components/organism/admin/SortableCertificationList";

export const metadata = { title: "Manage Certifications | Admin" };

export default async function AdminCertificationsPage() {
  const certifications = await db.query.certifications.findMany({
    orderBy: (certifications, { asc }) => [asc(certifications.order)],
  });

  const nodeColor = "#FACC15";

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            Content Manager
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
            certifications<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>

        <Link
          href="/admin/certifications/new"
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          add credential.
        </Link>
      </header>

      <div>
        {!certifications || certifications.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No credentials found in the vault.</Text>
            <Link href="/admin/certifications/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize first record.
            </Link>
          </div>
        ) : (
          <SortableCertificationList initialItems={certifications} />
        )}
      </div>
    </div>
  );
}
