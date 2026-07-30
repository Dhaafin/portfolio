"use server";

import { db } from "@/lib/db/index.js";
import { certifications } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCertification(formData) {
  const id = crypto.randomUUID();
  const skillsString = formData.get("skills") || "";
  const skillsArray = skillsString.split(",").map(s => s.trim()).filter(Boolean);

  const certData = {
    id,
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    issuer_short: formData.get("issuer_short") || null,
    issue_date: formData.get("issue_date") || null,
    credential_url: formData.get("credential_url") || null,
    color: formData.get("color") || "#60A5FA",
    skills: skillsArray,
    order: parseInt(formData.get("order") || "0", 10),
  };

  try {
    await db.insert(certifications).values(certData);
  } catch (error) {
    console.error("Error creating certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function updateCertification(id, formData) {
  const skillsString = formData.get("skills") || "";
  const skillsArray = skillsString.split(",").map(s => s.trim()).filter(Boolean);

  const certData = {
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    issuer_short: formData.get("issuer_short") || null,
    issue_date: formData.get("issue_date") || null,
    credential_url: formData.get("credential_url") || null,
    color: formData.get("color") || "#60A5FA",
    skills: skillsArray,
    order: parseInt(formData.get("order") || "0", 10),
  };

  try {
    await db.update(certifications).set(certData).where(eq(certifications.id, id));
  } catch (error) {
    console.error("Error updating certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertification(id) {
  try {
    await db.delete(certifications).where(eq(certifications.id, id));
  } catch (error) {
    console.error("Error deleting certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}

export async function reorderCertifications(items) {
  try {
    await Promise.all(
      items.map(({ id, order }) =>
        db.update(certifications).set({ order }).where(eq(certifications.id, id))
      )
    );
  } catch (error) {
    console.error("Error reordering certifications:", error);
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}
