import { db } from "@/lib/db/index.js";
import { aiSettings } from "@/lib/db/schema.js";
import { CHAT_CONFIG } from "@/config/chat.config.js";
import { eq, sql } from "drizzle-orm";

export async function getAISettings() {
  try {
    const settings = await db.query.aiSettings.findFirst({
      where: (table, { eq }) => eq(table.id, "default"),
    });

    if (settings) {
      return settings;
    }
  } catch (error) {
    console.error("Error reading aiSettings from DB, using fallback:", error);
  }

  // Resilient fallback to static config if DB record not found
  return {
    id: "default",
    is_enabled: true,
    model: CHAT_CONFIG.provider.model,
    temperature: CHAT_CONFIG.provider.temperature,
    system_prompt: null,
  };
}

export async function updateAISettings({ is_enabled, model, temperature, system_prompt }) {
  const current = await getAISettings();
  const payload = {
    id: "default",
    is_enabled: typeof is_enabled === "boolean" ? is_enabled : current.is_enabled,
    model: model?.trim() || current.model,
    temperature: typeof temperature === "number" ? temperature : current.temperature,
    system_prompt: system_prompt !== undefined ? (system_prompt?.trim() || null) : current.system_prompt,
    updated_at: sql`(CURRENT_TIMESTAMP)`,
  };

  await db
    .insert(aiSettings)
    .values(payload)
    .onConflictDoUpdate({
      target: aiSettings.id,
      set: payload,
    });

  return payload;
}
