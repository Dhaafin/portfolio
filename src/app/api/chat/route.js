import { db } from "@/lib/db/index.js";
import { documents, chatLogs, projects, experiences, certifications, chatUsers, chatMessages } from "@/lib/db/schema.js";
import { verifyJWT } from "@/lib/auth.js";
import { CHAT_CONFIG } from "@/config/chat.config.js";
import { sendMail } from "@/lib/mail.js";

export async function POST(req) {
  try {
    // Check if chatbot is paused/standby (Failsafe flag stored in documents table)
    const chatbotStatusDoc = await db.query.documents.findFirst({
      where: (documents, { and, eq }) => and(
        eq(documents.id, "system_chatbot_paused"),
        eq(documents.category, "system")
      )
    });

    if (chatbotStatusDoc && chatbotStatusDoc.content === "true") {
      return Response.json(
        { error: "The AI assistant is temporarily on standby. Please try again later." },
        { status: 503 }
      );
    }

    const reqBody = await req.json();
    const { message, sessionId: bodySessionId } = reqBody;

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const headerSessionId = req.headers.get("x-session-id");
    const sessionId = bodySessionId || headerSessionId || "anonymous-session";

    // Get client IP address safely
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const clientIp = rawIp.split(",")[0].trim();

    // Check authorization header
    const authHeader = req.headers.get("authorization");
    let email = null;
    let isAuthenticated = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const secret = process.env.ADMIN_SECRET_KEY || "chatbotDefaultFallbackSecret99";
      const payload = await verifyJWT(token, secret);

      if (!payload) {
        return Response.json({ error: "Invalid session token" }, { status: 401 });
      }

      email = payload.email;
      isAuthenticated = true;
    }

    if (isAuthenticated) {
      // Limit for authenticated emails (except owner/admin)
      if (email !== "dhaafinm@gmail.com") {
        const logs = await db.query.chatLogs.findMany({
          where: (chatLogs, { eq }) => eq(chatLogs.email, email)
        });
        if (logs.length >= CHAT_CONFIG.limits.authQueriesPerEmail) {
          return Response.json({ error: `Query limit reached. Maximum ${CHAT_CONFIG.limits.authQueriesPerEmail} queries allowed.` }, { status: 403 });
        }
      }
    } else {
      // Free queries limit per IP for unauthenticated users
      const logs = await db.query.chatLogs.findMany({
        where: (chatLogs, { and, eq, isNull }) => and(
          eq(chatLogs.ip, clientIp),
          isNull(chatLogs.email)
        )
      });
      if (logs.length >= CHAT_CONFIG.limits.freeQueriesPerIp) {
        return Response.json(
          { needsVerification: true, error: "Free query limit reached. Please verify email." },
          { status: 401 }
        );
      }
    }

    const formatArray = (value) => {
      if (!value) return "none";
      if (Array.isArray(value)) return value.join(", ");
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch {}
      return String(value);
    };

    const formatPoints = (value) => {
      if (!value) return "";
      if (Array.isArray(value)) return value.join(". ");
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(". ");
      } catch {}
      return String(value);
    };

    // Retrieve documents, projects, experiences, and certifications context for RAG injection
    const [allDocs, allProjects, allExperiences, allCertifications] = await Promise.all([
      db.select().from(documents),
      db.select().from(projects),
      db.select().from(experiences),
      db.select().from(certifications)
    ]);

    const docsContext = allDocs
      .map((doc) => `[Document - Category: ${doc.category || "General"}] ${doc.title}:\n${doc.content}`)
      .join("\n\n");

    const projectsContext = allProjects
      .map((proj) => {
        const highlightMarker = proj.is_featured ? " [HIGHLIGHTED/FEATURED PROJECT - The owner wants to highlight/showcase this project]" : "";
        return `[Project] ${proj.title} (${proj.year})${highlightMarker} - Role: ${proj.role}. Type: ${proj.project_type}. Tech Stack: ${formatArray(proj.technologies)}.\nDescription: ${proj.description}\nDetails: ${proj.details || "None"}`;
      })
      .join("\n\n");

    const experiencesContext = allExperiences
      .map((exp) => `[Experience] Company: ${exp.company}. Role: ${exp.role} (${exp.period || exp.year}). Era: ${exp.era}.\nPoints: ${formatPoints(exp.points)}\nSkills Used: ${formatArray(exp.skills)}`)
      .join("\n\n");

    const certificationsContext = allCertifications
      .map((cert) => `[Certification] ${cert.title} issued by ${cert.issuer} (${cert.issue_date || ""}). Skills: ${formatArray(cert.skills)}`)
      .join("\n\n");

    const context = [
      "=== Documents & Bio ===",
      docsContext || "No custom documents.",
      "=== Projects ===",
      projectsContext || "No projects listed.",
      "=== Work Experience ===",
      experiencesContext || "No experience listed.",
      "=== Certifications ===",
      certificationsContext || "No certifications listed."
    ].join("\n\n");

    const systemPrompt = CHAT_CONFIG.systemPrompt(context);
    const apiKey = process.env.AI_API_KEY;
    let aiReply = "";

    if (!apiKey) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[DEV MODE] AI_API_KEY missing. Mocking response for: "${message}"`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      aiReply = `[DEV MODE] This is a simulated response. To enable real AI responses, please add AI_API_KEY to your .env.local file. Received message: "${message}"`;
    } else {
      try {
        const response = await fetch(`${CHAT_CONFIG.provider.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: CHAT_CONFIG.provider.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            temperature: CHAT_CONFIG.provider.temperature,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Naraya API error");
        }

        const data = await response.json();
        aiReply = data.choices[0].message.content;
      } catch (apiErr) {
        console.error("API completions request failed, triggering failsafe:", apiErr);
        
        // Pause chatbot in database (documents table)
        try {
          await db.insert(documents).values({
            id: "system_chatbot_paused",
            title: "Chatbot Status",
            content: "true",
            category: "system"
          }).onConflictDoUpdate({
            target: documents.id,
            set: { content: "true" }
          });
        } catch (dbErr) {
          console.error("Failed to pause chatbot in database:", dbErr);
        }

        // Notify the owner via email
        try {
          await sendMail({
            to: "dhaafinm@gmail.com",
            subject: "🚨 ALERT: Portfolio Chatbot Paused (API Down)",
            html: `
              <div style="font-family: sans-serif; padding: 24px; background: #050505; color: #fff; border-radius: 16px; border: 1px solid #222;">
                <h2 style="font-size: 20px; font-weight: 900; color: #EF4444; margin-bottom: 16px;">AI Chatbot Deactivated</h2>
                <p style="color: #ccc; font-size: 14px;">The portfolio chatbot was automatically placed on standby due to an API completion error:</p>
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #FCA5A5; margin: 16px 0;">
                  ${apiErr.message || "Network connection failure"}
                </div>
                <p style="color: #888; font-size: 13px;">To reactivate the chatbot, log into the Admin Panel, search for the document with ID <strong>"system_chatbot_paused"</strong>, and delete it or edit its content to <strong>"false"</strong>.</p>
              </div>
            `
          });
        } catch (mailErr) {
          console.error("Failed to send alert email:", mailErr);
        }

        return Response.json(
          { error: "The AI assistant is temporarily on standby. Please try again later." },
          { status: 503 }
        );
      }
    }

    // Log messages to chat_messages table
    try {
      await db.insert(chatMessages).values({
        id: crypto.randomUUID(),
        session_id: sessionId,
        email: email,
        role: "user",
        content: message,
      });

      await db.insert(chatMessages).values({
        id: crypto.randomUUID(),
        session_id: sessionId,
        email: email,
        role: "assistant",
        content: aiReply,
      });
    } catch (dbErr) {
      console.error("Failed to log chat messages to database:", dbErr);
    }

    // Log the chat query limit check
    await db.insert(chatLogs).values({
      id: crypto.randomUUID(),
      ip: clientIp,
      email: email,
    });

    if (email) {
      try {
        const existingUser = await db.query.chatUsers.findFirst({
          where: (chatUsers, { eq }) => eq(chatUsers.email, email)
        });

        const newCount = (existingUser?.query_count || 0) + 1;

        await db.insert(chatUsers).values({
          email,
          verified_at: new Date().toISOString(),
          query_count: newCount,
          last_active: new Date().toISOString()
        }).onConflictDoUpdate({
          target: chatUsers.email,
          set: {
            query_count: newCount,
            last_active: new Date().toISOString()
          }
        });
      } catch (dbErr) {
        console.error("Failed updating chat user analytics:", dbErr);
      }
    }

    return Response.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
