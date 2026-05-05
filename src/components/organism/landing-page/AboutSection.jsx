"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Text from "@/components/atoms/Text";

// --- Sub-Components ---

function SectionLabel({ children, color = "hsl(217,91%,60%)" }) {
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
}

function ViewAllLink({ href, color, text = "view full archive" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-muted/50 hover:text-foreground transition-colors duration-500 group mt-8 md:mt-12"
    >
      <span
        className="h-[1px] w-8 transition-all duration-500 group-hover:w-16"
        style={{ background: color }}
      />
      {text}.<span style={{ color }}>↗</span>
    </Link>
  );
}

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
  const smoothTransition = { duration: 0.2, ease: [0.23, 1, 0.32, 1] };

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden pb-48"
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
        <div className="py-24 md:py-36 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
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
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(160deg, hsl(222,47%,10%) 0%, hsl(222,47%,6%) 60%, hsl(262,40%,10%) 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Text
                      className="text-[8rem] font-black lowercase tracking-tighter leading-none select-none"
                      style={{
                        WebkitTextStroke: "1.5px hsla(217,91%,60%,0.25)",
                        color: "transparent",
                      }}
                    >
                      df.
                    </Text>
                  </div>
                  {/* Film grain overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%221%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>')",
                    }}
                  />
                </div>
              </div>
              {/* Floating status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 glass rounded-2xl px-5 py-3 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    available for work.
                  </span>
                </div>
              </motion.div>
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
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-surface transition-colors duration-700"
                whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
              >
                {/* Neon Light Top Border */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] z-20"
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 1 }}
                  transition={smoothTransition}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${edu.neon}, transparent)`,
                    boxShadow: `0 0 15px ${edu.neon}`,
                  }}
                />

                {/* Ambient Neon Flare */}
                <motion.div
                  className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={smoothTransition}
                  style={{ backgroundColor: edu.neon }}
                />

                {/* Background Image with luxury overlay */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <motion.img
                    src={edu.image}
                    alt={edu.institution}
                    initial={{ scale: 1, opacity: 0.1 }}
                    whileHover={{ scale: 1.1, opacity: 0.2 }}
                    transition={smoothTransition}
                    className="h-full w-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
                </div>

                <div className="relative p-10 md:p-12 flex flex-col min-h-[320px] justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-[1px] w-6 bg-white/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        {edu.status}
                      </span>
                    </div>

                    <h3 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl text-white/90 leading-[1.1] mb-6 italic font-medium">
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 3. PROJECTS: The Showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32 relative"
        >
          <SectionLabel color="#A78BFA">selected works.</SectionLabel>

          <div
            className="flex flex-col group/list"
            onMouseLeave={() => setHoveredProjectImage(null)}
          >
            {projects.slice(0, 3).map((project, i) => (
              <Link
                href="/projects"
                key={project.id}
                onMouseEnter={() => setHoveredProjectImage(project.image_url)}
              >
                <motion.div
                  className="py-8 md:py-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 -mx-6 rounded-2xl cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                  transition={smoothTransition}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 lg:gap-16">
                    <motion.span
                      className="text-xs font-black uppercase tracking-[0.3em] text-muted/20"
                      whileHover={{ color: "#A78BFA" }}
                    >
                      0{i + 1}
                    </motion.span>
                    <motion.h3
                      className="text-4xl md:text-5xl lg:text-7xl font-black lowercase tracking-tighter text-muted/40"
                      whileHover={{ color: "hsl(var(--foreground))" }}
                      transition={smoothTransition}
                    >
                      {project.title}
                    </motion.h3>
                  </div>
                  <div className="text-left md:text-right">
                    <motion.p
                      className="text-sm font-medium text-muted/50"
                      whileHover={{ color: "white" }}
                    >
                      {project.role}
                    </motion.p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted/30">
                      {project.year}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Peek-thru Image effect */}
          <AnimatePresence>
            {hoveredProjectImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute right-[5%] top-1/2 -translate-y-1/2 w-80 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl pointer-events-none hidden lg:block z-50"
              >
                <img
                  src={hoveredProjectImage}
                  alt="Project preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>
            )}
          </AnimatePresence>

          <ViewAllLink
            href="/projects"
            color="#A78BFA"
            text="view all projects"
          />
        </motion.div>

        {/* ── 4. EXPERIENCES: The Path ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <SectionLabel color="#F472B6">professional path.</SectionLabel>

          <div className="relative pl-8 md:pl-12">
            {/* Minimalist Timeline Line */}
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

            <div className="flex flex-col gap-16">
              {experiences.slice(0, 3).map((exp, i) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node */}
                  <motion.div
                    className="absolute top-2 -left-8 md:-left-12 w-2 h-2 rounded-full -translate-x-1/2 bg-surface border border-white/40 shadow-[0_0_10px_rgba(244,114,182,0)]"
                    whileHover={{
                      backgroundColor: "#F472B6",
                      borderColor: "#F472B6",
                      scale: 1.5,
                      boxShadow: "0 0 15px rgba(244,114,182,0.5)",
                    }}
                    transition={springTransition}
                  />

                  <motion.div
                    className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 cursor-default"
                    whileHover={{ x: 10 }}
                    transition={smoothTransition}
                  >
                    <motion.h3
                      className="text-2xl md:text-3xl font-black lowercase tracking-tighter text-foreground transition-colors duration-300"
                      whileHover={{ color: "white" }}
                    >
                      {exp.role}
                    </motion.h3>
                    <span className="text-sm font-medium text-muted/60">
                      — {exp.company}
                    </span>
                  </motion.div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted/40 mt-3">
                    {exp.era || exp.period}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ViewAllLink
            href="/experience"
            color="#F472B6"
            text="view professional history"
          />
        </motion.div>

        {/* ── 5. CERTIFICATIONS: The Verified (Badge Bento) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <SectionLabel color="#FACC15">verified credentials.</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.slice(0, 3).map((cert, i) => (
              <Link href="/certifications" key={cert.id}>
                <motion.div
                  className="group aspect-square rounded-3xl bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden"
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    scale: 1.02,
                  }}
                  transition={smoothTransition}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-0"
                    whileHover={{ opacity: 0.2 }}
                    transition={smoothTransition}
                    style={{ backgroundColor: cert.color || "#FACC15" }}
                  />

                  <div className="flex items-center justify-between z-10">
                    <motion.div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg"
                      style={{
                        borderColor: `${cert.color || "#FACC15"}40`,
                        background: `${cert.color || "#FACC15"}10`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={springTransition}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cert.color || "#FACC15" }}
                      />
                    </motion.div>
                    <motion.span
                      className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40"
                      whileHover={{ opacity: 1 }}
                      style={{ color: cert.color || "#FACC15" }}
                    >
                      {cert.issuer_short}
                    </motion.span>
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-black lowercase tracking-tighter text-foreground leading-tight mb-2 line-clamp-3">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-medium text-muted/50">
                      {cert.issue_date}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <ViewAllLink
            href="/certifications"
            color="#FACC15"
            text="view all certifications"
          />
        </motion.div>
      </div>
    </section>
  );
}
