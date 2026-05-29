import nodemailer from 'nodemailer';
import * as Brevo from '@getbrevo/brevo';

// Initialize the Brevo API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    // You can use your own dedicated Gmail address as the sender here!
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