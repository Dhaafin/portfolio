"use client";

import { useRef, useState, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Text from "@/components/atoms/Text";

const CV_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/resume.pdf`;
const smoothTransition = { duration: 0.2, ease: [0.23, 1, 0.32, 1] };
const fastTransition = { duration: 0.05, ease: [0.23, 1, 0.32, 1] };

// --- Sub-Components ---

const SectionLabel = memo(({ children, color = "hsl(217,91%,60%)" }) => {
  return (
    <div className="flex items-center gap-4 mb-8 md:mb-12">
      <div className="h-[1px] w-12" style={{ background: color }} />
      <p
        className="text-[10px] font-black uppercase tracking-[0.4em]"
        style={{ color }}
      >
        {children}
      </p>
    </div>
  );
});

SectionLabel.displayName = "SectionLabel";

const PrimaryCTA = memo(({ href, color, text }) => {
  return (
    <div className="mt-16 flex justify-center">
      <Link
        href={href}
        className="group relative px-10 py-5 flex items-center justify-center rounded-sm overflow-hidden"
      >
        {/* Subtle Colored Background for Button Presence */}
        <div
          className="absolute inset-0 rounded-lg opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
        />

        {/* Center-Growing Underline */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ backgroundColor: color }}
        />

        {/* Text */}
        <span
          className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-200"
          style={{ color: color }}
        >
          {text}
        </span>
      </Link>
    </div>
  );
});
PrimaryCTA.displayName = "PrimaryCTA";

const ViewAllLink = memo(({ href, color, text = "view full archive" }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-muted/50 hover:text-foreground transition-colors duration-500 group mt-8 md:mt-12"
    >
      <span
        className="h-[1px] rounded-lg bg-linear-to-t from-w-8 transition-all duration-500 group-hover:w-16"
        style={{ background: color }}
      />
      {text}.<span style={{ color }}>↗</span>
    </Link>
  );
});
ViewAllLink.displayName = "ViewAllLink";

// --- Main Component ---

export default function AboutSection({
  projects = [],
  experiences = [],
  certifications = [],
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  // State for Project Hover image peek
  const [hoveredProjectImage, setHoveredProjectImage] = useState(null);

  // Hardcoded Education
  const educations = [
    {
      degree: "Postgraduate Student S2",
      institution: "Institut Teknologi Bandung",
      status: "Currently",
      color: "#60A5FA",
      neon: "#3B82F6",
      image: "/schools/itb.jpg",
    },
    {
      degree: "Freshgraduate Student S1",
      institution: "Universitas Pendidikan Indonesia",
      status: "Completed",
      color: "#EF4444",
      neon: "#EF4444",
      image: "/schools/isola.png",
    },
  ];

  const springTransition = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <section
      id="identity"
      ref={sectionRef}
      className="relative bg-background overflow-hidden pb-24 md:pb-48 scroll-mt-32"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #F472B6, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #60A5FA, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48">
        {/* ── 1. HERO IDENTITY: Portrait + Intro ── */}
        <div className="py-16 sm:py-24 md:py-36 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <motion.div
              style={{ y: portraitY }}
              className="relative w-full max-w-sm mx-auto lg:mx-0"
            >
              {/* Portrait Frame */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-surface">
                <Image
                  src="/profile.png"
                  alt="Dhaafin Portrait"
                  fill
                  className="object-cover transition-all duration-1000 ease-in-out"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Intro Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-8"
          >
            <div>
              <Text
                as="h2"
                className="text-5xl md:text-6xl xl:text-7xl font-black lowercase tracking-tighter leading-none mb-2"
              >
                dhaafin<span className="text-accent">.</span>
              </Text>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted/40">
                Software Engineer & Creative Developer
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Text className="text-lg md:text-xl text-muted/70 font-medium leading-relaxed">
                i build things that live on the internet. full-stack developer
                focused on crafting premium digital experiences that feel alive.
              </Text>
              <Text className="text-lg md:text-xl text-muted/70 font-medium leading-relaxed">
                currently obsessed with the intersection of data architecture
                and expressive UI. if it scrolls, it should be beautiful.
              </Text>
            </div>

            {/* CV Download */}
            <motion.a
              href={CV_URL}
              download="dhaafin-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 self-start mt-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-white/[0.02] group-hover:border-accent/40 group-hover:bg-accent/5 transition-all duration-500">
                <motion.svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/30 group-hover:text-accent transition-colors duration-500"
                  animate={{ y: [0, 2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    d="M6.5 1v7M6.5 8L4 5.5M6.5 8L9 5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M1 11h11" strokeLinecap="round" />
                </motion.svg>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  Download CV
                </span>
              </div>
            </motion.a>
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="h-[1px] my-16 origin-left"
          style={{
            background:
              "linear-gradient(90deg, hsla(217,91%,60%,0.3), transparent)",
          }}
        />

        {/* ── 2. EDUCATION: Academic Foundation ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <SectionLabel color="#34D399">academic foundation.</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {educations.map((edu, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-surface hover:border-white/20 transition-colors duration-200"
              >
                {/* Neon Light Top Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] z-20 opacity-30 group-hover:opacity-100 transition-opacity duration-150 ease-out"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${edu.neon}, transparent)`,
                    boxShadow: `0 0 15px ${edu.neon}`,
                  }}
                />

                {/* Ambient Neon Flare */}
                <div
                  className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-150 ease-out"
                  style={{ backgroundColor: edu.neon }}
                />

                {/* Background Image with luxury overlay */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <div className="h-full w-full opacity-40 group-hover:opacity-70 scale-100 group-hover:scale-105 transition-all duration-150 ease-out">
                    <Image
                      src={edu.image}
                      alt={edu.institution}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={i < 2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col min-h-[200px] sm:min-h-[260px] md:min-h-[320px] justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-[1px] w-6 bg-white/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        {edu.status}
                      </span>
                    </div>

                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white/90 leading-[1.1] mb-6 italic font-medium">
                      {edu.degree}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 mb-1">
                      Institution
                    </p>
                    <p className="text-xl font-bold tracking-tight text-white/60 lowercase">
                      {edu.institution}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <motion.div
                    className="absolute top-10 right-10"
                    initial={{ opacity: 0.1 }}
                    whileHover={{ opacity: 0.3 }}
                    transition={smoothTransition}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 1H39V40" stroke="white" strokeWidth="2" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 3. PROJECTS: The Showcase ("The Ledger") ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative mb-32"
        >
          <SectionLabel color="#A78BFA">selected works.</SectionLabel>

          <div className="flex flex-col border-t border-white/10 mt-12">
            {[...projects]
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .slice(0, 3)
              .map((project, i) => (
              <Link href="/projects" key={project.id}>
                <motion.div
                  className="group relative flex flex-col md:flex-row items-baseline justify-between gap-4 py-8 border-b border-white/10 overflow-hidden"
                  initial="initial"
                  whileHover="hover"
                >
                  {/* Left Hover Glow */}
                  <motion.div
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#A78BFA]/10 to-transparent opacity-0 origin-left"
                    variants={{
                      initial: { opacity: 0, scaleX: 0 },
                      hover: { opacity: 1, scaleX: 1 },
                    }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  />

                  <div className="flex items-baseline gap-6 md:gap-12 w-full md:w-auto relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-[#A78BFA] transition-colors duration-300 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl md:text-5xl lg:text-7xl font-black lowercase tracking-tighter text-white/60 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 relative z-10 self-end md:self-auto w-full md:w-auto justify-end">
                    <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 group-hover:text-[#A78BFA] transition-colors duration-300">
                        [{project.role}]
                      </p>
                    </div>
                    <motion.span
                      className="text-[#A78BFA] text-lg font-light opacity-0 -translate-x-4"
                      variants={{
                        initial: { opacity: 0, x: -10 },
                        hover: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      ↗
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <PrimaryCTA href="/projects" color="#A78BFA" text="explore archive" />
        </motion.div>

        {/* ── 4. EXPERIENCES: The Path ("The Ticker") ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <SectionLabel color="#F472B6">professional path.</SectionLabel>

          <div className="flex flex-col mt-12 gap-2 overflow-hidden">
            {[...experiences]
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .slice(0, 3)
              .map((exp, i) => (
              <div
                key={exp.id}
                className="group flex items-stretch gap-6 opacity-80 hover:opacity-100 transition-opacity duration-300"
                style={
                  i === 2
                    ? {
                        maskImage:
                          "linear-gradient(to bottom, black 20%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 20%, transparent 100%)",
                      }
                    : {}
                }
              >
                {/* Left Color Tab */}
                <motion.div
                  className="w-1 md:w-2 shrink-0 transition-all duration-300"
                  style={{ backgroundColor: exp.color || "#F472B6" }}
                  whileHover={{ width: "12px" }}
                />

                <div className="flex flex-col py-6 w-full relative">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4 w-full">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl md:text-5xl lg:text-6xl italic text-white/90">
                      {exp.role}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 whitespace-nowrap ml-4">
                      {exp.era || exp.period}
                    </span>
                  </div>

                  {/* Huge low opacity company name */}
                  <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none -z-10">
                    <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-white/[0.02] whitespace-nowrap pt-8">
                      {exp.company}
                    </span>
                  </div>
                  <div className="pt-4">
                    <span className="text-sm md:text-base font-bold uppercase tracking-widest text-muted/60">
                      {exp.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PrimaryCTA
            href="/experience"
            color="#F472B6"
            text="view trajectory"
          />
        </motion.div>

        {/* ── 5. CERTIFICATIONS: The Verified ("The Receipt") ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <SectionLabel color="#FACC15">verified credentials.</SectionLabel>

          <div className="mt-12 bg-black/40 border border-white/5 p-8 md:p-12 rounded-2xl font-mono text-sm md:text-base tracking-wider shadow-inner">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 text-white/40 uppercase text-xs font-bold tracking-[0.2em]">
              <span>
                {String(Math.min(3, certifications.length)).padStart(2, "0")} /{" "}
                {String(certifications.length).padStart(2, "0")} verified
              </span>
              <span>credentials</span>
            </div>

            <div className="flex flex-col gap-4">
              {[...certifications]
                .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
                .slice(0, 3)
                .map((cert) => (
                <Link href="/certifications" key={cert.id}>
                  <motion.div className="flex flex-col sm:flex-row items-baseline gap-2 sm:gap-4 text-white/50 hover:text-[#FACC15] transition-colors duration-300 group cursor-pointer">
                    <span className="uppercase font-bold shrink-0 w-24 md:w-32 truncate text-white/80 group-hover:text-white">
                      [{cert.issuer_short || "CERT"}]
                    </span>

                    <span className="hidden sm:block flex-grow border-b border-dashed border-white/20 group-hover:border-[#FACC15]/50 relative top-[-6px]" />

                    <span className="truncate max-w-[200px] md:max-w-none">
                      {cert.title}
                    </span>

                    <span className="hidden sm:block flex-grow border-b border-dashed border-white/20 group-hover:border-[#FACC15]/50 relative top-[-6px]" />

                    <span className="shrink-0 text-white/30 group-hover:text-[#FACC15]/80 text-xs">
                      [{cert.issue_date || "XXXX"}]
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {certifications.length > 3 && (
              <div className="mt-8 text-center text-white/20 text-xs italic">
                ... and {certifications.length - 3} more entries ...
              </div>
            )}
          </div>

          <PrimaryCTA
            href="/certifications"
            color="#FACC15"
            text="examine credentials"
          />
        </motion.div>
      </div>
    </section>
  );
}
