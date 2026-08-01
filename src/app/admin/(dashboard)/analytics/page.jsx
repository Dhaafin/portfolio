import { db } from "@/lib/db/index.js";
import Text from "@/components/atoms/Text";

export const metadata = { title: "Chat Analytics | Admin" };

export default async function AdminAnalyticsPage() {
  const users = await db.query.chatUsers.findMany({
    orderBy: (chatUsers, { desc }) => [desc(chatUsers.last_active)],
  });

  const nodeColor = "#A78BFA"; // Violet

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            Chatbot Leads & Activity
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter text-white">
            analytics<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>
      </header>

      <div>
        {!users || users.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-white/40">No verified chatbot users found in the database.</Text>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase font-bold tracking-widest bg-white/2">
                  <th className="p-6">Email Address</th>
                  <th className="p-6">First Verified</th>
                  <th className="p-6 text-center">Queries</th>
                  <th className="p-6">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-white/2 transition-colors">
                    <td className="p-6 font-bold text-white font-mono">{user.email}</td>
                    <td className="p-6 text-white/60">{formatDate(user.verified_at)}</td>
                    <td className="p-6 text-center font-bold text-[#A78BFA] font-mono">{user.query_count}</td>
                    <td className="p-6 text-white/60">{formatDate(user.last_active)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
