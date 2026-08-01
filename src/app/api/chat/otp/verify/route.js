import { db } from "@/lib/db/index.js";
import { otps, chatUsers } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";
import { signJWT } from "@/lib/auth.js";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    // Find the OTP in the database
    const otpRecord = await db.query.otps.findFirst({
      where: (otps, { eq }) => eq(otps.email, email),
    });

    if (!otpRecord) {
      return Response.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Check if expired
    if (Date.now() > otpRecord.expires_at) {
      // Clean up expired OTP
      await db.delete(otps).where(eq(otps.email, email));
      return Response.json({ error: "Verification code expired" }, { status: 400 });
    }

    // Check if code matches
    if (otpRecord.code !== code.trim()) {
      return Response.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Delete the OTP after successful verification to prevent reuse
    await db.delete(otps).where(eq(otps.email, email));

    // Save email address in analytics database
    try {
      await db.insert(chatUsers).values({
        email,
        verified_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        query_count: 0
      }).onConflictDoUpdate({
        target: chatUsers.email,
        set: {
          last_active: new Date().toISOString()
        }
      });
    } catch (dbErr) {
      console.error("Failed logging chat user:", dbErr);
    }

    // Sign a secure JWT session token for the chatbot
    const chatbotSecret = process.env.ADMIN_SECRET_KEY || "chatbotDefaultFallbackSecret99";
    const token = await signJWT({ email }, chatbotSecret, 7 * 24 * 3600); // 7 days session

    return Response.json({ success: true, token });
  } catch (error) {
    console.error("OTP verification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
