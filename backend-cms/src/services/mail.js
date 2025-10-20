import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const from = `"${process.env.SMTP_FROM_NAME || 'CARE Admin'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

export const sendMail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({ from, to, subject, text, html });
};

export const notifySuperAdmin = async ({ subject, text, html }) => {
  return sendMail({ to: process.env.SUPERADMIN_EMAIL, subject, text, html });
};
