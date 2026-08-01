"use client";

import { useState } from "react";
import Link from "next/link";
import Text from "@/components/atoms/Text";
import { usePathname } from "next/navigation";

export default function AdminSidebar({ user, logoutAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 right-6 z-[100] md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl"
      >
        <span className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          {isOpen ? "+" : "☰"}
        </span>
      </button>

      {/* Sidebar Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-[90] w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-6
        transition-transform duration-500 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-12">
          <Text className="text-xl font-black lowercase tracking-tighter text-white">
            portfolio<span className="text-primary">.</span>
          </Text>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <AdminNavLink href="/admin" label="overview." active={pathname === "/admin"} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/projects" label="projects." active={pathname.startsWith("/admin/projects")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/experience" label="experience." active={pathname.startsWith("/admin/experience")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/certifications" label="certifications." active={pathname.startsWith("/admin/certifications")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/documents" label="documents." active={pathname.startsWith("/admin/documents")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/analytics" label="analytics." active={pathname.startsWith("/admin/analytics")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/chat-logs" label="chat logs." active={pathname.startsWith("/admin/chat-logs")} onClick={() => setIsOpen(false)} />
          <AdminNavLink href="/admin/settings" label="settings." active={pathname === "/admin/settings"} onClick={() => setIsOpen(false)} />
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

          <form action={logoutAction}>
            <button className="w-full py-3 rounded-xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-red-500 transition-all">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
        />
      )}
    </>
  );
}

function AdminNavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center px-4 py-3 rounded-xl transition-all duration-300
        ${active ? 'bg-white/5 border border-white/5' : 'hover:bg-white/5'}
      `}
    >
      <span className={`
        text-sm font-bold uppercase tracking-[0.1em] transition-all
        ${active ? 'text-white translate-x-1' : 'text-white/60 group-hover:text-white group-hover:translate-x-1'}
      `}>
        {label}
      </span>
    </Link>
  );
}
