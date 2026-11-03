"use client";

import { Reorder, useDragControls } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
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
      className="group p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.04] transition-colors gap-4"
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 10 }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <DragHandle controls={controls} />
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 shrink-0"
          style={{ backgroundColor: `${exp.color || "hsl(217, 91%, 60%)"}10` }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: exp.color || "hsl(217, 91%, 60%)" }}
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-white tracking-tight truncate">
              {exp.company}
            </h3>
            <span className="px-2 py-0.5 rounded bg-white/5 text-muted text-[10px] font-normal uppercase tracking-wider">
              {exp.year}
            </span>
          </div>
          <p className="text-xs text-muted/70 font-normal">
            {exp.role} — {exp.era}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Link
          href={`/admin/experience/edit/${exp.id}`}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-normal transition-colors text-center"
        >
          Edit
        </Link>
        <DeleteExperienceButton id={exp.id} company={exp.company} />
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
    <div className="flex flex-col gap-3">
      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <span className="text-xs text-white/70 font-normal">
            Order changed — save to apply new ordering.
          </span>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 disabled:opacity-40 transition-all cursor-pointer"
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
        className="flex flex-col gap-2.5"
      >
        {items.map((exp) => (
          <SortableExperienceItem key={exp.id} exp={exp} />
        ))}
      </Reorder.Group>
    </div>
  );
}
