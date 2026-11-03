import { db } from "@/lib/db/index.js";
import {
  projects as projectsTable,
  experiences as experiencesTable,
  certifications as certificationsTable,
  documents as documentsTable,
} from "@/lib/db/schema.js";
import Link from "next/link";

export const metadata = { title: "Overview | Admin" };

export default async function AdminOverviewPage() {
  const [projects, experiences, certifications, documents] = await Promise.all([
    db.select({ is_published: projectsTable.is_published }).from(projectsTable),
    db.select({ id: experiencesTable.id }).from(experiencesTable),
    db.select({ id: certificationsTable.id }).from(certificationsTable),
    db.select({ id: documentsTable.id }).from(documentsTable),
  ]);

  const publishedCount = (projects ?? []).filter((p) => p.is_published).length;
  const draftCount = (projects ?? []).length - publishedCount;

  const stats = [
    {
      label: "Projects",
      count: projects?.length ?? 0,
      sub: `${publishedCount} published, ${draftCount} draft`,
      href: "/admin/projects",
      actionText: "+ New Project",
      actionHref: "/admin/projects/new",
    },
    {
      label: "Experience",
      count: experiences?.length ?? 0,
      sub: "Career timeline entries",
      href: "/admin/experience",
      actionText: "+ New Experience",
      actionHref: "/admin/experience/new",
    },
    {
      label: "Certifications",
      count: certifications?.length ?? 0,
      sub: "Professional credentials",
      href: "/admin/certifications",
      actionText: "+ New Certification",
      actionHref: "/admin/certifications/new",
    },
    {
      label: "Documents",
      count: documents?.length ?? 0,
      sub: "Chatbot knowledgebase",
      href: "/admin/documents",
      actionText: "+ New Document",
      actionHref: "/admin/documents/new",
    },
  ];

  const quickLinks = [
    {
      title: "Projects",
      desc: "Reorder, edit, and publish portfolio works",
      href: "/admin/projects",
    },
    {
      title: "Experience",
      desc: "Manage career timeline, companies, and roles",
      href: "/admin/experience",
    },
    {
      title: "Certifications",
      desc: "Manage verified licenses and credentials",
      href: "/admin/certifications",
    },
    {
      title: "Documents",
      desc: "Manage RAG context for the portfolio AI chatbot",
      href: "/admin/documents",
    },
    {
      title: "Analytics",
      desc: "Review chatbot visitors and query activity",
      href: "/admin/analytics",
    },
    {
      title: "Settings",
      desc: "Configure AI parameters and curriculum vitae",
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header (Clean, Non-bold) */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Overview
          </h1>
          <p className="text-xs text-muted font-normal mt-1">
            Portfolio content management and system summary
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 transition-colors"
          >
            + New Project
          </Link>
          <Link
            href="/admin/experience/new"
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-normal transition-colors"
          >
            + New Experience
          </Link>
        </div>
      </header>

      {/* Stat Cards (Non-bold, Minimal) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col justify-between hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-muted font-normal">
              <span>{s.label}</span>
              <Link
                href={s.actionHref}
                className="text-[11px] text-white/50 hover:text-white transition-colors"
              >
                {s.actionText}
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href={s.href}
                className="text-3xl font-normal text-white hover:text-primary transition-colors inline-block"
              >
                {s.count}
              </Link>
              <p className="text-[11px] text-muted/70 font-normal mt-1">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Navigation Cards */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-muted font-normal">
            Quick Navigation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 rounded-xl transition-all group flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/90 font-medium group-hover:text-white transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-muted/40 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
              <p className="text-[11px] text-muted/60 font-normal leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
