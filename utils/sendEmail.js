import nodemailer from 'nodemailer';
import { BrevoClient } from "@getbrevo/brevo";

// Initialize the Brevo Client with your API key configuration object
const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async (to, subject, text) => {
  try {
    // Send using the new .transactionalEmails method chain
    await client.transactionalEmails.sendTransacEmail({
      subject: subject,
      textContent: text,
      sender: { 
        name: "Budget Tracker", 
        email: process.env.EMAIL_USER 
      },
      to: [{ email: to }],
    });

    console.log("Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error.message);
    return false;
  }
};

export default sendEmail;