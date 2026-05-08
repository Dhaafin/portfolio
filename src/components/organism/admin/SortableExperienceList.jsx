"use client";

import { Reorder, useDragControls } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
import Text from "@/components/atoms/Text";
import DeleteExperienceButton from "@/components/organism/admin/DeleteExperienceButton";
import { reorderExperiences } from "@/app/admin/(dashboard)/experience/actions";

function DragHandle({ controls }) {
  return (
    <div
      onPointerDown={(e) => controls.start(e)}
      className="cursor-grab active:cursor-grabbing p-2 text-white/20 hover:text-white/60 transition-colors touch-none shrink-0"
      title="Drag to reorder"
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="2.5" cy="2.5" r="1.5" />
        <circle cx="7.5" cy="2.5" r="1.5" />
        <circle cx="2.5" cy="8" r="1.5" />
        <circle cx="7.5" cy="8" r="1.5" />
        <circle cx="2.5" cy="13.5" r="1.5" />
        <circle cx="7.5" cy="13.5" r="1.5" />
      </svg>
    </div>
  );
}

function SortableExperienceItem({ exp }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={exp}
      dragListener={false}
      dragControls={controls}
      className="group p-4 sm:p-6 bg-white/2 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors duration-300 gap-6"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 10 }}
    >
      <div className="flex items-center gap-2">
        <DragHandle controls={controls} />
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
          style={{ backgroundColor: `${exp.color}10` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }} />
        </div>
        <div className="ml-2">
          <div className="flex items-center gap-3 mb-1">
            <Text className="text-lg font-black tracking-tight">{exp.company}</Text>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest">
              {exp.year}
            </span>
          </div>
          <Text className="text-xs text-muted/60 tracking-wider">
            {exp.role} — {exp.era}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
        <Link
          href={`/admin/experience/edit/${exp.id}`}
          className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          Edit
        </Link>
        <div className="flex-1 md:flex-none">
          <DeleteExperienceButton id={exp.id} company={exp.company} />
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function SortableExperienceList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleReorder(newItems) {
    setItems(newItems);
    setIsDirty(true);
  }

  function handleSave() {
    startTransition(async () => {
      await reorderExperiences(items.map((item, i) => ({ id: item.id, order: i })));
      setIsDirty(false);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-2xl">
          <Text className="text-xs text-white/40 tracking-wider">Order changed — save to persist.</Text>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 rounded-full bg-[#6366F1] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {isPending ? "Saving…" : "Save Order"}
          </button>
        </div>
      )}

      <Reorder.Group
        as="div"
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="flex flex-col gap-4"
      >
        {items.map((exp) => (
          <SortableExperienceItem key={exp.id} exp={exp} />
        ))}
      </Reorder.Group>
    </div>
  );
}
