"use client";

import { useState } from "react";
import Link from "next/link";
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
        className="fixed top-6 right-6 z-[100] md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl cursor-pointer"
        aria-label="Toggle navigation"
      >
        <span className={`text-sm transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
          {isOpen ? "✕" : "☰"}
        </span>
      </button>

      {/* Sidebar Overlay / Static Desktop Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[90] w-64 border-r border-white/10 bg-neutral-950/90 backdrop-blur-3xl flex flex-col p-6
          transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header (Simple, Non-bold) */}
        <div className="mb-8 flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h1 className="text-sm font-medium tracking-tight text-white">
              Portfolio Admin
            </h1>
            <p className="text-[11px] text-muted/60 font-normal mt-0.5">
              Control Panel
            </p>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Navigation (Pure text, no icons, non-bold) */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          <AdminNavLink
            href="/admin"
            label="Overview"
            active={pathname === "/admin"}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/projects"
            label="Projects"
            active={pathname.startsWith("/admin/projects")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/experience"
            label="Experience"
            active={pathname.startsWith("/admin/experience")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/certifications"
            label="Certifications"
            active={pathname.startsWith("/admin/certifications")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/documents"
            label="Documents"
            active={pathname.startsWith("/admin/documents")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/analytics"
            label="Analytics"
            active={pathname.startsWith("/admin/analytics")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/chat-logs"
            label="Chat Logs"
            active={pathname.startsWith("/admin/chat-logs")}
            onClick={() => setIsOpen(false)}
          />
          <AdminNavLink
            href="/admin/settings"
            label="Settings"
            active={pathname === "/admin/settings"}
            onClick={() => setIsOpen(false)}
          />
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-muted/50 font-normal">
              Signed in as
            </span>
            <span className="text-xs text-white/80 font-normal truncate mt-0.5">
              {user?.email || "Admin"}
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg border border-white/10 bg-white/2 hover:bg-red-500/10 hover:border-red-500/20 text-xs font-normal text-muted hover:text-red-400 transition-all cursor-pointer"
            >
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
        flex items-center px-3.5 py-2 rounded-lg transition-colors duration-200 text-xs tracking-wide
        ${
          active
            ? "bg-white/10 text-white font-medium border border-white/10"
            : "text-muted hover:text-white hover:bg-white/5 font-normal"
        }
      `}
    >
      <span>{label}</span>
    </Link>
  );
}
