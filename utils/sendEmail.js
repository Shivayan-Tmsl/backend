import nodemailer from 'nodemailer';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  // Google's alternate relay server that accepts connections over non-standard restrictions
  host: "smtp-relay.gmail.com", 
  port: 25, // Sometimes cloud providers leave port 25 open for relays, or try 443 if supported
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
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