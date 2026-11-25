const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
  const fromAddress = process.env.RESEND_FROM || `"FSDM Project Repository" <${process.env.EMAIL_USER}>`;

  // If RESEND_API_KEY is configured, send via Resend HTTPS API
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }

      console.log(`[Resend] Email sent successfully to ${to} (ID: ${data?.id || 'unknown'})`);
      return data;
    } catch (error) {
      console.error(`[Resend] send error for ${to}:`, error.message || error);
      throw error;
    }
  }

  // Otherwise, use Nodemailer SMTP with IPv4
  try {
    const info = await transporter.sendMail({
      from: `"FSDM Project Repository" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error(`[Nodemailer] sendMail error for ${to}:`, error.message || error);
    throw error;
  }
};

sendEmail.transporter = transporter;

module.exports = sendEmail;
module.exports.transporter = transporter;
