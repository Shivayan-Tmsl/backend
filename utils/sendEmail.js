import nodemailer from 'nodemailer';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  // Hardcoded standard IPv4 address for smtp.gmail.com
  host: "74.125.200.108", 
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
    // CRITICAL: Because we are using an IP address instead of a domain name, 
    // we must tell TLS to expect 'smtp.gmail.com' or the handshake will fail SSL validation.
    servername: 'smtp.gmail.com' 
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