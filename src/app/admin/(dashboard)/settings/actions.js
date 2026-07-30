"use server";

import { put } from "@vercel/blob";

export async function uploadCV(formData) {
  const file = formData.get("file");

  if (!file || file.size === 0) {
    return { error: "No file received" };
  }

  if (file.type !== "application/pdf") {
    return { error: "PDF files only (.pdf)" };
  }

  try {
    const blob = await put("cv/resume.pdf", file, {
      access: "public",
      addRandomSuffix: false,
    });

    return { url: blob.url };
  } catch (error) {
    console.error("Error uploading CV:", error);
    return { error: error.message };
  }
}
