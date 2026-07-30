import { db } from "@/lib/db/index.js";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import SortableExperienceList from "@/components/organism/admin/SortableExperienceList";

export const metadata = { title: "Manage Experience | Admin" };

export default async function AdminExperiencePage() {
  const experiences = await db.query.experiences.findMany({
    orderBy: (experiences, { asc }) => [asc(experiences.order)],
  });

  const nodeColor = "#6366F1";

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            History Manager
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
            experience<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>

        <Link
          href="/admin/experience/new"
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          add experience.
        </Link>
      </header>

      <div>
        {!experiences || experiences.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No historical records found.</Text>
            <Link href="/admin/experience/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize your first era.
            </Link>
          </div>
        ) : (
          <SortableExperienceList initialItems={experiences} />
        )}
      </div>
    </div>
  );
}
