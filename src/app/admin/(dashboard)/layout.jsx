import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/auth.js";
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

  // Mimic user object format for compatibility with sidebar
  const user = { email: process.env.ADMIN_USERNAME || "admin" };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#07090E] text-foreground flex flex-col md:flex-row">
      <AdminSidebar user={user} logoutAction={logout} />

      {/* Main Content Area (Independent Scroll - Sidebar never scrolls) */}
      <main className="flex-1 h-screen overflow-y-auto p-6 sm:p-10 md:p-12">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
