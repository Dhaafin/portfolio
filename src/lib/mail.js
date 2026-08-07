import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[DEV MODE] Mail simulated to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    return { success: true, dev: true };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  return transporter.sendMail({
    from: `"Portfolio Chatbot" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  });
}
