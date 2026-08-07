"use client";

import { useState, useEffect, useRef } from "react";
import EraSelector from "./molecules/EraSelector";
import ExperienceCard from "./molecules/ExperienceCard";

const FALLBACK_EXPERIENCES = [
  {
    id: "01",
    year: "2024",
    era: "present.",
    company: "astra dynamic.",
    role: "lead frontend engineer",
    period: "2024 — present",
    description:
      "architecting high-performance visual engines for aerospace simulations. focused on webgl performance and complex state orchestration across distributed render pipelines.",
    skills: ["react", "three.js", "rust", "webgl", "typescript"],
    color: "hsl(217, 91%, 60%)",
  },
];

export default function ExperienceOrganism({ experiences = [] }) {
  const list = experiences.length > 0 ? experiences : FALLBACK_EXPERIENCES;
  const [active, setActive] = useState(0);
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = list.findIndex(
              (e) => e.id === entry.target.id
            );
            if (index !== -1) setActive(index);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-20% 0px -40% 0px",
      }
    );

    list.forEach((e) => {
      const el = document.getElementById(e.id);
      if (el) observer.current.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [list]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-12 md:px-24 lg:px-48 pt-24 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-32 xl:gap-64 relative">
          <EraSelector
            experiences={list}
            active={active}
            scrollTo={scrollTo}
          />

          <div className="w-full lg:w-[32rem] flex flex-col gap-16 sm:gap-24 md:gap-40 lg:gap-56">
            {list.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}

            <div className="h-[40vh] lg:h-[40vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}
