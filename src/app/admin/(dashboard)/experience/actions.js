"use server";

import { db } from "@/lib/db/index.js";
import { experiences } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExperience(formData) {
  const id = crypto.randomUUID();
  const data = {
    id,
    year: formData.get("year") || null,
    era: formData.get("era") || null,
    company: formData.get("company"),
    role: formData.get("role"),
    period: formData.get("period") || null,
    points: formData.get("points")
      ? formData.get("points").split("\n").map(s => s.trim()).filter(Boolean)
      : [],
    color: formData.get("color") || null,
    order: parseInt(formData.get("order") || "0", 10),
    skills: formData.get("skills")
      ? formData.get("skills").split(",").map(s => s.trim()).filter(Boolean)
      : [],
  };

  try {
    await db.insert(experiences).values(data);
  } catch (error) {
    console.error("Error creating experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function updateExperience(id, formData) {
  const data = {
    year: formData.get("year") || null,
    era: formData.get("era") || null,
    company: formData.get("company"),
    role: formData.get("role"),
    period: formData.get("period") || null,
    points: formData.get("points")
      ? formData.get("points").split("\n").map(s => s.trim()).filter(Boolean)
      : [],
    color: formData.get("color") || null,
    order: parseInt(formData.get("order") || "0", 10),
    skills: formData.get("skills")
      ? formData.get("skills").split(",").map(s => s.trim()).filter(Boolean)
      : [],
  };

  try {
    await db.update(experiences).set(data).where(eq(experiences.id, id));
  } catch (error) {
    console.error("Error updating experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(id) {
  try {
    await db.delete(experiences).where(eq(experiences.id, id));
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}

export async function reorderExperiences(items) {
  try {
    await Promise.all(
      items.map(({ id, order }) =>
        db.update(experiences).set({ order }).where(eq(experiences.id, id))
      )
    );
  } catch (error) {
    console.error("Error reordering experiences:", error);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}
