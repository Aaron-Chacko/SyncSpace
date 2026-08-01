const appUrl = () => process.env.CLIENT_ORIGIN?.split(",")[0] ?? "http://localhost:5173";

async function sendEmail({ to, subject, text }) {
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text }),
    });
    if (!response.ok) throw new Error("Email provider rejected the request.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[development email to ${to}] ${subject}: ${text}`);
    return;
  }
  throw new Error("Email delivery is not configured.");
}

export const sendVerificationEmail = (email, token) =>
  sendEmail({
    to: email,
    subject: "Verify your SyncSpace email",
    text: `Verify your email: ${appUrl()}/verify-email?token=${token}`,
  });

export const sendPasswordResetEmail = (email, token) =>
  sendEmail({
    to: email,
    subject: "Reset your SyncSpace password",
    text: `Reset your password: ${appUrl()}/reset-password?token=${token}`,
  });
