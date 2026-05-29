import nodemailer from 'nodemailer';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  // We can switch back to the domain name since Port 587 handles IPv4 routing cleanly
  host: "smtp.gmail.com", 
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Ensure this is the 16-character string without spaces
  },
  connectionTimeout: 10000,
  tls: {
    // This forces the secure TLS upgrade and handles cloud network certificates
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  }
});

export const sendEmail = async (to, subject, text) => {
  try {

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

    return true;

  } catch (error) {

    console.error('Error sending email:', error.message);

    return false;
  }
};

export default sendEmail;