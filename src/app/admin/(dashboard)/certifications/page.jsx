import { createClient } from "@/lib/supabase/server";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import DeleteCertificationButton from "@/components/organism/admin/DeleteCertificationButton";

export const metadata = { title: "Manage Certifications | Admin" };

export default async function AdminCertificationsPage() {
  const supabase = await createClient();

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("order", { ascending: true });

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

      <div className="grid gap-4">
        {certifications?.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No credentials found in the vault.</Text>
            <Link href="/admin/certifications/new" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              Initialize first record.
            </Link>
          </div>
        ) : (
          certifications?.map((cert) => (
            <div 
              key={cert.id}
              className="group p-4 sm:p-6 bg-white/2 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-all duration-500 gap-6"
            >
              <div className="flex items-center gap-6">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden"
                  style={{ borderColor: `${cert.color}20`, background: `${cert.color}05` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cert.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Text className="text-lg font-black tracking-tight">{cert.title}</Text>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                      style={{ backgroundColor: `${cert.color}10`, color: cert.color }}
                    >
                      {cert.issuer_short}
                    </span>
                  </div>
                  <Text className="text-xs text-muted/60 tracking-wider">
                    {cert.issuer} — {cert.issue_date}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <Link 
                  href={`/admin/certifications/edit/${cert.id}`}
                  className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Edit
                </Link>
                <div className="flex-1 md:flex-none">
                  <DeleteCertificationButton id={cert.id} title={cert.title} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
