import { db } from "@/lib/db/index.js";
import { chatLogs } from "@/lib/db/schema.js";
import { verifyJWT } from "@/lib/auth.js";

export async function checkChatLimit(req, token = null) {
  // Get IP address
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

  // Case 1: Token provided (Attempting authenticated query)
  if (token) {
    const secret = process.env.ADMIN_SECRET_KEY || "chatbotDefaultFallbackSecret99";
    const payload = await verifyJWT(token, secret);

    if (payload && payload.email) {
      const email = payload.email;

      // Count queries by this email
      const emailLogs = await db.query.chatLogs.findMany({
        where: (chatLogs, { eq }) => eq(chatLogs.email, email),
      });

      const count = emailLogs.length;

      return {
        allowed: email === "dhaafinm@gmail.com" ? true : count < 10,
        email,
        ip,
        count,
        limit: 10,
        remaining: email === "dhaafinm@gmail.com" ? 999999 : Math.max(0, 10 - count),
        type: "authenticated"
      };
    }
  }

  // Case 2: No valid token (Attempting free queries by IP)
  const ipLogs = await db.query.chatLogs.findMany({
    where: (chatLogs, { eq, and, isNull }) => and(
      eq(chatLogs.ip, ip),
      isNull(chatLogs.email)
    ),
  });

  const freeCount = ipLogs.length;

  return {
    allowed: freeCount < 3,
    email: null,
    ip,
    count: freeCount,
    limit: 3,
    remaining: Math.max(0, 3 - freeCount),
    type: "free"
  };
}

export async function logChatQuery(ip, email = null) {
  const id = crypto.randomUUID();
  await db.insert(chatLogs).values({
    id,
    ip,
    email
  });
}
