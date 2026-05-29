import nodemailer from 'nodemailer';
import { TransactionalEmailsApi } from '@getbrevo/brevo';

// Initialize the API client
const apiInstance = new TransactionalEmailsApi();

// Set the API Key using the required method structure
apiInstance.setApiKey(0, process.env.BREVO_API_KEY); 

export const sendEmail = async (to, subject, text) => {
  try {
    // Just create a plain JavaScript object matching the Brevo API schema
    const emailData = {
      subject: subject,
      textContent: text,
      sender: { name: "Budget Tracker", email: process.env.EMAIL_USER },
      to: [{ email: to }]
    };

    // Pass the plain object straight into the function
    await apiInstance.sendTransacEmail(emailData);
    
    console.log("Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
    return false;
  }
};

export default sendEmail;