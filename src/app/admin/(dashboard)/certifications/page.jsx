import { db } from "@/lib/db/index.js";
import Link from "next/link";
import SortableCertificationList from "@/components/organism/admin/SortableCertificationList";

export const metadata = { title: "Certifications | Admin" };

export default async function AdminCertificationsPage() {
  const certifications = await db.query.certifications.findMany({
    orderBy: (certifications, { asc }) => [asc(certifications.order)],
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Certifications
          </h1>
          <p className="text-xs text-muted font-normal mt-1">
            Manage professional licenses and credentials
          </p>
        </div>

        <Link
          href="/admin/certifications/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 transition-colors self-start sm:self-auto"
        >
          + New Certification
        </Link>
      </header>

      <div>
        {!certifications || certifications.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted font-normal mb-3">
              No certifications found.
            </p>
            <Link
              href="/admin/certifications/new"
              className="text-xs font-normal text-primary hover:underline"
            >
              Add your first certification.
            </Link>
          </div>
        ) : (
          <SortableCertificationList initialItems={certifications} />
        )}
      </div>
    </div>
  );
}
