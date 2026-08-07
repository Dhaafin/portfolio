import { db } from "@/lib/db/index.js";
import { documents } from "@/lib/db/schema.js";

export async function GET() {
  try {
    const chatbotStatusDoc = await db.query.documents.findFirst({
      where: (documents, { and, eq }) => and(
        eq(documents.id, "system_chatbot_paused"),
        eq(documents.category, "system")
      )
    });
    
    return Response.json({ paused: chatbotStatusDoc?.content === "true" });
  } catch (error) {
    return Response.json({ paused: false });
  }
}
export const dynamic = "force-dynamic";
