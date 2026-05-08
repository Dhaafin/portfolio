"use server";

import { createClient } from "@supabase/supabase-js";

// Service role bypasses RLS — safe here because this only runs server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function uploadCV(formData) {
  const file = formData.get("file");

  if (!file || file.size === 0) {
    return { error: "No file received" };
  }

  if (file.type !== "application/pdf") {
    return { error: "PDF files only (.pdf)" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from("cv")
    .upload("resume.pdf", buffer, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (error) {
    return { error: error.message };
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("cv")
    .getPublicUrl("resume.pdf");

  return { url: publicUrl };
}
