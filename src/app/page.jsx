import HomePage from "@/components/organism/landing-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dhaafin — Full-Stack Developer",
  description: "I build things that live on the internet. Premium digital experiences, full-stack architecture, and expressive UI.",
};

export default async function LandingPage() {
  const supabase = await createClient();

  // Parallel data fetch for maximum performance
  const [
    { data: projects },
    { data: experiences },
    { data: certifications },
  ] = await Promise.all([
    supabase.from("projects").select("id, title, role, year, description, demo_url, github_url").order("order", { ascending: true }).limit(3),
    supabase.from("experiences").select("id, role, company, era, color, period").order("order", { ascending: false }).limit(3),
    supabase.from("certifications").select("id, title, issuer, issuer_short, issue_date, color").order("order", { ascending: true }).limit(3),
  ]);

  return (
    <HomePage
      projects={projects || []}
      experiences={experiences || []}
      certifications={certifications || []}
    />
  );
}