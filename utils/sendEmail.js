import nodemailer from 'nodemailer';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,

  tls: {
    rejectUnauthorized: false,
  },

  family: 4,
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