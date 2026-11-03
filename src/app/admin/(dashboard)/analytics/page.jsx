import { db } from "@/lib/db/index.js";

export const metadata = { title: "Analytics | Admin" };

export default async function AdminAnalyticsPage() {
  const users = await db.query.chatUsers.findMany({
    orderBy: (chatUsers, { desc }) => [desc(chatUsers.last_active)],
  });

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
          Analytics
        </h1>
        <p className="text-xs text-muted font-normal mt-1">
          Chatbot visitors and query activity
        </p>
      </header>

      <div>
        {!users || users.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted font-normal">
              No verified chatbot users found in the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-xl bg-white/[0.02]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted font-normal tracking-wider bg-white/2">
                  <th className="p-4 font-normal">Email Address</th>
                  <th className="p-4 font-normal">First Verified</th>
                  <th className="p-4 font-normal text-center">Queries</th>
                  <th className="p-4 font-normal">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-white font-mono">{user.email}</td>
                    <td className="p-4 text-muted">{formatDate(user.verified_at)}</td>
                    <td className="p-4 text-center text-primary font-mono">{user.query_count}</td>
                    <td className="p-4 text-muted">{formatDate(user.last_active)}</td>
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
