// Step 1: Import the nodemailer module
import nodemailer from 'nodemailer';


// Step 2: Create a transporter object
// This transporter will be responsible for communicating with the email service.
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the 'gmail' service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password (CRUCIAL - see note below)
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
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;