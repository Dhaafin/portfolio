"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCertification(formData) {
  const supabase = await createClient();

  const skillsString = formData.get("skills") || "";
  const skillsArray = skillsString.split(",").map(s => s.trim()).filter(Boolean);

  const certData = {
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    issuer_short: formData.get("issuer_short"),
    issue_date: formData.get("issue_date"),
    credential_url: formData.get("credential_url"),
    color: formData.get("color") || "#60A5FA",
    skills: skillsArray,
    order: parseInt(formData.get("order") || "0", 10),
  };

  const { error } = await supabase.from("certifications").insert([certData]);

  if (error) {
    console.error("Error creating certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function updateCertification(id, formData) {
  const supabase = await createClient();

  const skillsString = formData.get("skills") || "";
  const skillsArray = skillsString.split(",").map(s => s.trim()).filter(Boolean);

  const certData = {
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    issuer_short: formData.get("issuer_short"),
    issue_date: formData.get("issue_date"),
    credential_url: formData.get("credential_url"),
    color: formData.get("color") || "#60A5FA",
    skills: skillsArray,
    order: parseInt(formData.get("order") || "0", 10),
  };

  const { error } = await supabase.from("certifications").update(certData).eq("id", id);

  if (error) {
    console.error("Error updating certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertification(id) {
  const supabase = await createClient();

  const { error } = await supabase.from("certifications").delete().eq("id", id);

  if (error) {
    console.error("Error deleting certification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}
