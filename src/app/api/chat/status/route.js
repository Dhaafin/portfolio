import { getAISettings } from "@/services/aiSettings.js";

export async function GET() {
  try {
    const settings = await getAISettings();
    return Response.json({
      paused: !settings.is_enabled,
      model: settings.model,
    });
  } catch (error) {
    return Response.json({ paused: false });
  }
}

export const dynamic = "force-dynamic";
