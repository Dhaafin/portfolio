import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Text from "@/components/atoms/Text";
import { logout } from "./login/actions";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    return redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-3xl sticky top-0 h-screen flex flex-col p-6">
        <div className="mb-12">
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            Control Center
          </Text>
          <Text className="text-xl font-black lowercase tracking-tighter">
            antigravity<span className="text-primary">.</span>
          </Text>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <AdminNavLink href="/admin/projects" label="projects." />
          <AdminNavLink href="/admin/experience" label="experience." />
          <AdminNavLink href="/admin/settings" label="settings." />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
          <div>
            <Text className="text-[10px] uppercase tracking-widest text-white/20 mb-4">
              Authenticated as
            </Text>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">A</span>
              </div>
              <Text className="text-xs font-bold truncate text-white/60">
                {user?.email || "Admin"}
              </Text>
            </div>
          </div>
          
          <form action={logout}>
            <button className="w-full py-3 rounded-xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-red-500 transition-all">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, label }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300"
    >
      <span className="text-sm font-bold uppercase tracking-[0.1em] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
        {label}
      </span>
    </Link>
  );
}
