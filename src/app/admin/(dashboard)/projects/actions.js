"use server";

import { db } from "@/lib/db/index.js";
import { projects } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Upload helper for project thumbnails to Vercel Blob
export async function uploadImageAction(formData) {
  const file = formData.get("file");
  if (!file) {
    throw new Error("No file provided");
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const blob = await put(`projects/${filename}`, file, {
    access: "public",
  });

  return blob.url;
}

export async function createProject(formData) {
  const id = crypto.randomUUID();
  const technologiesRaw = formData.get("technologies");
  const technologies = technologiesRaw
    ? technologiesRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : null;

  const projectData = {
    id,
    title: formData.get("title"),
    github_url: formData.get("github_url") || null,
    demo_url: formData.get("demo_url") || null,
    role: formData.get("role") || null,
    year: formData.get("year") || null,
    description: formData.get("description") || null,
    details: formData.get("details") || null,
    project_type: formData.get("project_type") || null,
    technologies: technologies,
    image_url: formData.get("image_url") || null,
    is_published: formData.get("is_published") === "true",
    order: parseInt(formData.get("order") || "0", 10),
  };

  try {
    await db.insert(projects).values(projectData);
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(id, formData) {
  const technologiesRaw = formData.get("technologies");
  const technologies = technologiesRaw
    ? technologiesRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : null;

  const projectData = {
    title: formData.get("title"),
    github_url: formData.get("github_url") || null,
    demo_url: formData.get("demo_url") || null,
    role: formData.get("role") || null,
    year: formData.get("year") || null,
    description: formData.get("description") || null,
    details: formData.get("details") || null,
    project_type: formData.get("project_type") || null,
    technologies: technologies,
    image_url: formData.get("image_url") || null,
    is_published: formData.get("is_published") === "true",
    order: parseInt(formData.get("order") || "0", 10),
  };

  try {
    await db.update(projects).set(projectData).where(eq(projects.id, id));
  } catch (error) {
    console.error("Error updating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function reorderProjects(items) {
  try {
    await Promise.all(
      items.map(({ id, order }) =>
        db.update(projects).set({ order }).where(eq(projects.id, id))
      )
    );
  } catch (error) {
    console.error("Error reordering projects:", error);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
