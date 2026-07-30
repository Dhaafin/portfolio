import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/auth.js";
import Link from "next/link";
import Text from "@/components/atoms/Text";
import AdminSidebar from "@/components/organism/admin/AdminSidebar";
import { logout } from "../login/actions";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = token ? await verifyJWT(token, process.env.ADMIN_SECRET_KEY) : null;

  // Redirect to login if not authenticated
  if (!session) {
    return redirect("/admin/login");
  }

  // Mimic Supabase user object format for compatibility with sidebar
  const user = { email: process.env.ADMIN_USERNAME || "admin" };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col md:flex-row">
      <AdminSidebar user={user} logoutAction={logout} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
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
      <span className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
        {label}
      </span>
    </Link>
  );
}
