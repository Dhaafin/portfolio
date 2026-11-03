import { db } from "@/lib/db/index.js";
import Link from "next/link";
import SortableExperienceList from "@/components/organism/admin/SortableExperienceList";

export const metadata = { title: "Experience | Admin" };

export default async function AdminExperiencePage() {
  const experiences = await db.query.experiences.findMany({
    orderBy: (experiences, { asc }) => [asc(experiences.order)],
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Experience
          </h1>
          <p className="text-xs text-muted font-normal mt-1">
            Manage career timeline and work history
          </p>
        </div>

        <Link
          href="/admin/experience/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 transition-colors self-start sm:self-auto"
        >
          + New Experience
        </Link>
      </header>

      <div>
        {!experiences || experiences.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted font-normal mb-3">
              No experience records found.
            </p>
            <Link
              href="/admin/experience/new"
              className="text-xs font-normal text-primary hover:underline"
            >
              Add your first experience.
            </Link>
          </div>
        ) : (
          <SortableExperienceList initialItems={experiences} />
        )}
      </div>
    </div>
  );
}
