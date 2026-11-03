import { db } from "@/lib/db/index.js";
import { chatMessages } from "@/lib/db/schema.js";
import { desc } from "drizzle-orm";
import ChatLogsViewer from "@/components/organism/admin/ChatLogsViewer";

export const metadata = { title: "Chat Logs | Admin" };

export default async function AdminChatLogsPage() {
  const messages = await db
    .select()
    .from(chatMessages)
    .orderBy(desc(chatMessages.created_at));

  return (
    <div className="flex flex-col gap-10">
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
          Chat Logs
        </h1>
        <p className="text-xs text-muted font-normal mt-1">
          Conversation history and user inquiries
        </p>
      </header>

      <ChatLogsViewer initialMessages={messages} />
    </div>
  );
}
