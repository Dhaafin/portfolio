"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  projects: "#A78BFA",
  experience: "#6366F1",
  certifications: "#60A5FA",
  published: "#34D399",
  draft: "#F59E0B",
};

const chartTooltipStyle = {
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const axisStyle = {
  fontSize: 10,
  fontWeight: 700,
  fill: "rgba(255,255,255,0.3)",
  letterSpacing: "0.05em",
};

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 mb-4">
      {children}
    </p>
  );
}

export function ProjectsBarChart({ data }) {
  return (
    <div>
      <SectionLabel>projects by year</SectionLabel>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={20} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            cursor={{ fill: "rgba(167,139,250,0.06)" }}
            formatter={(v) => [v, "projects"]}
          />
          <Bar dataKey="count" fill={COLORS.projects} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PublishedDonut({ published, draft }) {
  const data = [
    { name: "Published", value: published },
    { name: "Draft", value: draft },
  ];
  const total = published + draft;

  return (
    <div>
      <SectionLabel>published vs draft</SectionLabel>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={54}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={COLORS.published} />
              <Cell fill={COLORS.draft} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.published }} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Published</span>
            <span className="text-sm font-black text-white ml-auto pl-4">{published}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.draft }} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Draft</span>
            <span className="text-sm font-black text-white ml-auto pl-4">{draft}</span>
          </div>
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Total</span>
            <span className="text-sm font-black text-white ml-4">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceBarChart({ data }) {
  return (
    <div>
      <SectionLabel>experience by era</SectionLabel>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={20} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <XAxis dataKey="era" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            cursor={{ fill: "rgba(99,102,241,0.06)" }}
            formatter={(v) => [v, "entries"]}
          />
          <Bar dataKey="count" fill={COLORS.experience} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CertificationsBarChart({ data }) {
  return (
    <div>
      <SectionLabel>certifications by issuer</SectionLabel>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={20} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <XAxis dataKey="issuer" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            cursor={{ fill: "rgba(96,165,250,0.06)" }}
            formatter={(v) => [v, "certs"]}
          />
          <Bar dataKey="count" fill={COLORS.certifications} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
