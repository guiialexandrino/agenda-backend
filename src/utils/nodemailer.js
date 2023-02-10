require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail(msgContent, subject, msgTo) {
  await transporter.sendMail({
    html: msgContent,
    subject: subject,
    from: `Recuperar Senha - App Agenda<${process.env.EMAIL_USER}>`,
    to: [msgTo],
  });
}

module.exports = sendEmail;
