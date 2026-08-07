"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Text from "@/components/atoms/Text";

const TRANSITION = { duration: 0.8, ease: [0.23, 1, 0.32, 1] };

export default function ExperienceCard({ exp }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = exp.points && exp.points.length > 3;
  const visiblePoints = isExpanded ? exp.points : exp.points?.slice(0, 3);

  return (
    <motion.div
      id={exp.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={TRANSITION}
      className="flex flex-col gap-6 sm:gap-8 scroll-mt-48 lg:scroll-mt-32"
    >
      {/* Index + period */}
      <div className="flex items-center gap-4">
        <Text
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-black"
          style={{ color: exp.color || "hsl(217, 91%, 60%)" }}
        >
          {exp.id}
        </Text>
        <div
          className="h-[1px] flex-1"
          style={{ background: `${exp.color || "hsl(217, 91%, 60%)"}30` }}
        />
        <Text className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-muted/50">
          {exp.period}
        </Text>
      </div>

      {/* Company + role */}
      <div>
        <Text
          as="h2"
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-2 sm:mb-3"
        >
          {exp.company}
        </Text>
        <Text className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-muted">
          {exp.role}
        </Text>
      </div>

      {/* Description / Points */}
      <div className="glass p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col gap-4">
        <div
          className="absolute top-0 left-0 w-[2px] h-full rounded-full opacity-60"
          style={{ backgroundColor: exp.color || "hsl(217, 91%, 60%)" }}
        />

        {exp.points ? (
          <ul className="flex flex-col gap-4 pl-2">
            {visiblePoints?.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-1 h-1 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                <Text className="text-muted/80 text-base sm:text-lg leading-relaxed font-medium">
                  {point}
                </Text>
              </motion.li>
            ))}
          </ul>
        ) : (
          <Text className="text-muted/80 text-base sm:text-lg leading-relaxed font-medium pl-2">
            {exp.description}
          </Text>
        )}

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-all mt-2 pl-6 cursor-pointer"
          >
            {isExpanded ? "less." : `more (+${exp.points.length - 3}).`}
          </button>
        )}
      </div>

      {/* Skill tags */}
      {exp.skills && (
        <div className="flex flex-wrap gap-2">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border"
              style={{
                borderColor: `${exp.color || "hsl(217, 91%, 60%)"}30`,
                color: exp.color || "hsl(217, 91%, 60%)",
                backgroundColor: `${exp.color || "hsl(217, 91%, 60%)"}08`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
