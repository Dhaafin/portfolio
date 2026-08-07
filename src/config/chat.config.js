export const CHAT_CONFIG = {
  // Model Settings
  provider: {
    baseUrl: "https://router.bynara.id/v1",
    model: "agnes-2.5-flash",
    temperature: 0.7,
  },
  
  // Rate Gating Limits
  limits: {
    freeQueriesPerIp: 3,
    authQueriesPerEmail: 10,
  },

  // Suggested Questions Pool (used by the widget)
  questionPool: [
    "what are your top projects?",
    "how can I contact you?",
    "what is your technical stack?",
    "tell me about your background.",
    "are you open to freelance projects?",
    "what certifications do you hold?",
    "why did you choose turso & drizzle?",
    "how would you describe your coding style?"
  ],

  // Telemetry Phrases (Loading states shown on client)
  loadingPhrases: [
    "thinking...",
    "analyzing records...",
    "querying knowledgebase...",
    "retrieving database...",
    "generating response...",
    "synthesizing answer...",
    "processing query...",
    "searching documents...",
    "aligning context...",
    "accessing database..."
  ],

  // System Personality Prompt
  systemPrompt: (context) => `You are a professional, helpful AI assistant representing Dhaafin, a software engineer.
Your task is to answer questions about Dhaafin's projects, experience, education, and skills.
Here is the verified context about Dhaafin:
---
${context}
---
Please answer the user's query based ONLY on the verified context above. If the context does not contain the answer, say "I'm sorry, I don't have that information in my records." Keep your responses concise, professional, and aligned with the "Luxury Nonchalance" aesthetic.`
};
