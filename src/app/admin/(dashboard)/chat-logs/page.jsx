import { db } from "@/lib/db/index.js";
import { chatMessages } from "@/lib/db/schema.js";
import { desc } from "drizzle-orm";
import Text from "@/components/atoms/Text";
import ChatLogsViewer from "@/components/organism/admin/ChatLogsViewer";

export const metadata = { title: "Chat Logs | Admin" };

export default async function AdminChatLogsPage() {
  const messages = await db
    .select()
    .from(chatMessages)
    .orderBy(desc(chatMessages.created_at));

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            AI Assistant
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
            chat logs<span className="text-[#A78BFA]">.</span>
          </Text>
        </div>
      </header>

      <ChatLogsViewer initialMessages={messages} />
    </div>
  );
}
