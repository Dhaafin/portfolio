"use server";

import { put } from "@vercel/blob";
import { updateAISettings } from "@/services/aiSettings.js";
import { revalidatePath } from "next/cache";

export async function updateAISettingsAction(formData) {
  try {
    const is_enabled = formData.get("is_enabled") === "true";
    const model = formData.get("model")?.toString();
    const temperatureRaw = formData.get("temperature");
    const temperature = temperatureRaw !== null ? parseFloat(temperatureRaw.toString()) : 0.7;
    const system_prompt = formData.get("system_prompt")?.toString() || null;

    if (!model || !model.trim()) {
      return { error: "Model name is required" };
    }

    const updated = await updateAISettings({
      is_enabled,
      model,
      temperature,
      system_prompt,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/api/chat/status");

    return { success: true, settings: updated };
  } catch (error) {
    console.error("Error updating AI settings:", error);
    return { error: error.message || "Failed to update AI settings" };
  }
}

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
