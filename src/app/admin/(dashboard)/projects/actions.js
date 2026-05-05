"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData) {
  const supabase = await createClient();

  const projectData = {
    title: formData.get("title"),
    github_url: formData.get("github_url"),
    demo_url: formData.get("demo_url"),
    role: formData.get("role"),
    year: formData.get("year"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    is_published: formData.get("is_published") === "true",
    order: parseInt(formData.get("order") || "0", 10),
  };

  const { error } = await supabase.from("projects").insert([projectData]);

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(id, formData) {
  const supabase = await createClient();

  const projectData = {
    title: formData.get("title"),
    github_url: formData.get("github_url"),
    demo_url: formData.get("demo_url"),
    role: formData.get("role"),
    year: formData.get("year"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    is_published: formData.get("is_published") === "true",
    order: parseInt(formData.get("order") || "0", 10),
  };

  const { error } = await supabase.from("projects").update(projectData).eq("id", id);

  if (error) {
    console.error("Error updating project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
