import { db } from "@/lib/db/index.js";
import { documents, chatLogs, projects, experiences, certifications } from "@/lib/db/schema.js";
import { verifyJWT } from "@/lib/auth.js";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

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
      // 10 queries limit for authenticated emails
      const logs = await db.query.chatLogs.findMany({
        where: (chatLogs, { eq }) => eq(chatLogs.email, email)
      });
      if (logs.length >= 10) {
        return Response.json({ error: "Query limit reached. Maximum 10 queries allowed." }, { status: 403 });
      }
    } else {
      // 3 free queries limit per IP for unauthenticated users
      const logs = await db.query.chatLogs.findMany({
        where: (chatLogs, { and, eq, isNull }) => and(
          eq(chatLogs.ip, clientIp),
          isNull(chatLogs.email)
        )
      });
      if (logs.length >= 3) {
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
      .map((proj) => `[Project] ${proj.title} (${proj.year}) - Role: ${proj.role}. Type: ${proj.project_type}. Tech Stack: ${formatArray(proj.technologies)}.\nDescription: ${proj.description}\nDetails: ${proj.details || "None"}`)
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

    const systemPrompt = `You are a professional, helpful AI assistant representing Dhaafin, a software engineer.
Your task is to answer questions about Dhaafin's projects, experience, education, and skills.
Here is the verified context about Dhaafin:
---
${context}
---
Please answer the user's query based ONLY on the verified context above. If the context does not contain the answer, say "I'm sorry, I don't have that information in my records." Keep your responses concise, professional, and aligned with the "Luxury Nonchalance" aesthetic.`;

    const apiKey = process.env.NARAYA_API_KEY;
    let aiReply = "";

    if (!apiKey) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[DEV MODE] NARAYA_API_KEY missing. Mocking response for: "${message}"`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      aiReply = `[DEV MODE] This is a simulated response. To enable real AI responses, please add NARAYA_API_KEY to your .env.local file. Received message: "${message}"`;
    } else {
      const response = await fetch("https://router.bynara.id/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "agnes-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Naraya API error");
      }

      const data = await response.json();
      aiReply = data.choices[0].message.content;
    }

    // Log the chat query
    await db.insert(chatLogs).values({
      id: crypto.randomUUID(),
      ip: clientIp,
      email: email,
    });

    return Response.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
