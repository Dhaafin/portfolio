import { db } from "@/lib/db/index.js";
import { otps } from "@/lib/db/schema.js";
import { sendMail } from "@/lib/mail.js";
import { eq } from "drizzle-orm";

async function verifyTurnstile(token) {
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
    });
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.error("Turnstile error:", e);
    return false;
  }
}

export async function POST(req) {
  try {
    const { email, turnstileToken } = await req.json();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Turnstile verification (only if secret key is configured)
    if (process.env.TURNSTILE_SECRET_KEY) {
      const isValidTurnstile = await verifyTurnstile(turnstileToken);
      if (!isValidTurnstile) {
        return Response.json({ error: "Captcha verification failed" }, { status: 400 });
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Upsert OTP in Turso DB
    // SQLite upsert behavior using insert...onConflictDoUpdate
    await db.insert(otps).values({
      email,
      code,
      expires_at: expiresAt
    }).onConflictDoUpdate({
      target: otps.email,
      set: {
        code,
        expires_at: expiresAt
      }
    });

    // Send email using the unified sendMail helper
    const mailResult = await sendMail({
      to: email,
      subject: `Verification Code: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #050505; color: #fff; border-radius: 16px; border: 1px solid #222;">
          <h2 style="font-size: 20px; font-weight: 900; margin-bottom: 16px;">Chatbot Verification Code</h2>
          <p style="color: #888; font-size: 14px;">Use the following OTP code to access the portfolio assistant:</p>
          <div style="font-size: 32px; font-weight: 900; letter-spacing: 0.1em; color: #A78BFA; margin: 24px 0; font-family: monospace;">${code}</div>
          <p style="color: #444; font-size: 11px;">This code is valid for 5 minutes. If you did not request this, you can ignore this email.</p>
        </div>
      `
    });

    return Response.json({ success: true, dev: !!mailResult?.dev });
  } catch (error) {
    console.error("OTP send error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
