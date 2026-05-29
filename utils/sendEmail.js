// Step 1: Import the nodemailer module
import nodemailer from 'nodemailer';


// Step 2: Create a transporter object
// This transporter will be responsible for communicating with the email service.
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
});

export const sendEmail = async (to, subject, text) => {
  try {
    // Step 3: Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    // Step 4: Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

export default sendEmail;