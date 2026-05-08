"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExperience(formData) {
  const supabase = await createClient();

  const data = {
    year: formData.get("year"),
    era: formData.get("era"),
    company: formData.get("company"),
    role: formData.get("role"),
    period: formData.get("period"),
    points: formData.get("points").split("\n").map(s => s.trim()).filter(Boolean),
    color: formData.get("color"),
    order: parseInt(formData.get("order") || "0", 10),
    skills: formData.get("skills").split(",").map(s => s.trim()).filter(Boolean),
  };

  const { error } = await supabase.from("experiences").insert([data]);

  if (error) {
    console.error("Error creating experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function updateExperience(id, formData) {
  const supabase = await createClient();

  const data = {
    year: formData.get("year"),
    era: formData.get("era"),
    company: formData.get("company"),
    role: formData.get("role"),
    period: formData.get("period"),
    points: formData.get("points").split("\n").map(s => s.trim()).filter(Boolean),
    color: formData.get("color"),
    order: parseInt(formData.get("order") || "0", 10),
    skills: formData.get("skills").split(",").map(s => s.trim()).filter(Boolean),
  };

  const { error } = await supabase.from("experiences").update(data).eq("id", id);

  if (error) {
    console.error("Error updating experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(id) {
  const supabase = await createClient();

  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    console.error("Error deleting experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}

export async function reorderExperiences(items) {
  const supabase = await createClient();

  await Promise.all(
    items.map(({ id, order }) =>
      supabase.from("experiences").update({ order }).eq("id", id)
    )
  );

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}
