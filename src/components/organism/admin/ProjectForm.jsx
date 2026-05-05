"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Text from "@/components/atoms/Text";
import {
  createProject,
  updateProject,
} from "@/app/admin/(dashboard)/projects/actions";

const projectSchema = z.z.object({
  title: z.z.string().min(1, "Title is required"),
  slug: z.z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes"),
  role: z.z.string().min(1, "Role is required"),
  year: z.z.string().min(1, "Year is required"),
  description: z.z
    .string()
    .min(10, "Description must be at least 10 characters"),
  image_url: z.z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.z.literal("")),
  order: z.z.number().int().default(0),
  is_published: z.z.boolean().default(false),
});

export default function ProjectForm({ initialData, id }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      role: "",
      year: new Date().getFullYear().toString(),
      description: "",
      image_url: "",
      order: 0,
      is_published: false,
    },
  });

  const onSubmit = async (data) => {
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const result = id
        ? await updateProject(id, formData)
        : await createProject(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 max-w-2xl"
    >
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Title"
          id="title"
          register={register}
          error={errors.title?.message}
          placeholder="Project Title"
        />
        <FormField
          label="Slug"
          id="slug"
          register={register}
          error={errors.slug?.message}
          placeholder="project-slug"
        />
        <FormField
          label="Role"
          id="role"
          register={register}
          error={errors.role?.message}
          placeholder="Frontend Developer"
        />
        <FormField
          label="Year"
          id="year"
          register={register}
          error={errors.year?.message}
          placeholder="2026"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
          placeholder="Describe the project..."
        />
        {errors.description && (
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <FormField
        label="Image URL"
        id="image_url"
        register={register}
        error={errors.image_url?.message}
        placeholder="https://..."
      />

      <div className="flex items-center gap-12 border-t border-white/5 pt-8">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            {...register("is_published")}
            className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
          />
          <label
            htmlFor="is_published"
            className="text-xs font-bold uppercase tracking-widest text-white/60 cursor-pointer"
          >
            Published
          </label>
        </div>

        <div className="flex items-center gap-4 flex-1">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold whitespace-nowrap">
            Order
          </label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="w-20 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 px-12 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
      >
        {isPending ? "Syncing..." : id ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

function FormField({ label, id, register, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
      />
      {error && (
        <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
