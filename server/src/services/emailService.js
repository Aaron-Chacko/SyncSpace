const appUrl = () => process.env.CLIENT_ORIGIN?.split(",")[0] ?? "http://localhost:5173";

async function sendEmail({ to, subject, text }) {
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    try {
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
    } catch (err) {
      if (process.env.NODE_ENV === "production") throw err;
      console.warn(`[email warning] Could not send via Resend: ${err.message}. Falling back to console log.`);
    }
  }

  console.info(`[development email to ${to}]\nSubject: ${subject}\nBody: ${text}`);
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
