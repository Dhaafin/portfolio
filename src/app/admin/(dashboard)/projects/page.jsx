import { db } from "@/lib/db/index.js";
import Link from "next/link";
import SortableProjectList from "@/components/organism/admin/SortableProjectList";

export const metadata = { title: "Projects | Admin" };

export default async function AdminProjectsPage() {
  const projects = await db.query.projects.findMany({
    orderBy: (projects, { asc }) => [asc(projects.order)],
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Projects
          </h1>
          <p className="text-xs text-muted font-normal mt-1">
            Manage, edit, and reorder portfolio projects
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 transition-colors self-start sm:self-auto"
        >
          + New Project
        </Link>
      </header>

      <div>
        {!projects || projects.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted font-normal mb-3">No projects found.</p>
            <Link
              href="/admin/projects/new"
              className="text-xs font-normal text-primary hover:underline"
            >
              Create your first project.
            </Link>
          </div>
        ) : (
          <SortableProjectList initialItems={projects} />
        )}
      </div>
    </div>
  );
}
