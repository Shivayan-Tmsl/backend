import nodemailer from 'nodemailer';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

// Initialize the Brevo API client correctly for ES Modules
const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(0, process.env.BREVO_API_KEY); // '0' represents the default API Key slot

export const sendEmail = async (to, subject, text) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = { name: "Budget Tracker", email: process.env.EMAIL_USER }; 
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
    return false;
  }
};

export default sendEmail;