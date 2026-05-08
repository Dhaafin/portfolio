import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import {
  ProjectsBarChart,
  PublishedDonut,
  ExperienceBarChart,
  CertificationsBarChart,
} from "@/components/organism/admin/AdminCharts";

export const metadata = { title: "Overview | Admin" };

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] ?? "Unknown";
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(grouped, labelKey) {
  return Object.entries(grouped)
    .map(([label, count]) => ({ [labelKey]: label, count }))
    .sort((a, b) => String(a[labelKey]).localeCompare(String(b[labelKey])));
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { data: projects },
    { data: experiences },
    { data: certifications },
  ] = await Promise.all([
    supabase.from("projects").select("year, is_published"),
    supabase.from("experiences").select("era"),
    supabase.from("certifications").select("issuer_short"),
  ]);

  const projectsByYear = toChartData(groupBy(projects ?? [], "year"), "year");
  const publishedCount = (projects ?? []).filter((p) => p.is_published).length;
  const draftCount = (projects ?? []).length - publishedCount;

  const experienceByEra = toChartData(groupBy(experiences ?? [], "era"), "era");
  const certsByIssuer = toChartData(groupBy(certifications ?? [], "issuer_short"), "issuer");

  const stats = [
    {
      label: "Projects",
      count: projects?.length ?? 0,
      sub: `${publishedCount} published`,
      accent: "#A78BFA",
      href: "/admin/projects",
    },
    {
      label: "Experience",
      count: experiences?.length ?? 0,
      sub: `${experienceByEra.length} era${experienceByEra.length !== 1 ? "s" : ""}`,
      accent: "#6366F1",
      href: "/admin/experience",
    },
    {
      label: "Certifications",
      count: certifications?.length ?? 0,
      sub: `${certsByIssuer.length} issuer${certsByIssuer.length !== 1 ? "s" : ""}`,
      accent: "#60A5FA",
      href: "/admin/certifications",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Control Center
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          overview<span className="text-white/20">.</span>
        </Text>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-500 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <Text className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                {s.label}
              </Text>
              <div
                className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: s.accent }}
              />
            </div>
            <div>
              <Text
                className="text-5xl font-black tracking-tighter"
                style={{ color: s.accent }}
              >
                {s.count}
              </Text>
              <Text className="text-xs text-white/30 mt-1 tracking-wider">{s.sub}</Text>
            </div>
          </Link>
        ))}
      </div>

      {/* Projects Charts */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 rounded-full bg-[#A78BFA]" />
          <Text className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">
            Projects
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
            <ProjectsBarChart data={projectsByYear} />
          </div>
          <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
            <PublishedDonut published={publishedCount} draft={draftCount} />
          </div>
        </div>
      </section>

      {/* Experience Chart */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 rounded-full bg-[#6366F1]" />
          <Text className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">
            Experience
          </Text>
        </div>
        <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
          <ExperienceBarChart data={experienceByEra} />
        </div>
      </section>

      {/* Certifications Chart */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 rounded-full bg-[#60A5FA]" />
          <Text className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">
            Certifications
          </Text>
        </div>
        <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
          <CertificationsBarChart data={certsByIssuer} />
        </div>
      </section>
    </div>
  );
}
