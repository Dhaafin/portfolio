"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "projects", href: "/projects" },
  { label: "experience", href: "/experience" },
  { label: "certifications", href: "/certifications" },
];

const SOCIAL_LINKS = [
  { label: "github", href: "https://github.com/dhaafin" },
  { label: "linkedin", href: "https://linkedin.com/in/dhaafin" },
  { label: "twitter", href: "https://twitter.com/dhaafin" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      className="w-full border-t border-[hsla(217,91%,60%,0.08)] mt-32"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-8">

          {/* Brand block */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="group w-fit">
              <span className="text-xl font-black lowercase tracking-tighter text-foreground group-hover:opacity-60 transition-opacity duration-500">
                dhaafin<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted/50">
              full-stack developer.
            </p>
            <p className="text-xs uppercase tracking-[0.18em] font-medium text-muted/30 mt-6">
              © {new Date().getFullYear()} — all work, no noise.
            </p>
          </div>

          {/* Links block */}
          <div className="flex flex-col gap-8 md:items-end">
            {/* Nav links */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs uppercase tracking-[0.2em] font-bold text-muted/40 hover:text-foreground transition-colors duration-500"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full md:w-48 bg-[hsla(217,91%,60%,0.1)]" />

            {/* Social links */}
            <div className="flex gap-6 md:gap-8">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] font-bold text-muted/60 hover:text-foreground transition-colors duration-500"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.footer>
  );
}
