const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
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
  // 1. SendGrid HTTPS API (Preferred)
  if (process.env.SENDGRID_API_KEY) {
    console.log(`[sendEmail] Using provider: SendGrid`);
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to,
        from: {
          email: process.env.EMAIL_USER,
          name: 'FSDM Project Repository',
        },
        subject,
        html,
      };

      const [response] = await sgMail.send(msg);
      console.log(`[SendGrid] Email sent successfully to: ${to} (Status: ${response?.statusCode})`);
      return response;
    } catch (error) {
      const details = error.response?.body?.errors
        ? JSON.stringify(error.response.body.errors)
        : error.message || error;
      console.error(`[SendGrid] Email error for ${to}:`, details);
      throw new Error(`SendGrid error: ${details}`);
    }
  }

  // 2. Resend HTTPS API (Fallback)
  if (process.env.RESEND_API_KEY) {
    console.log(`[sendEmail] Using provider: Resend`);
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.RESEND_FROM || `"FSDM Project Repository" <${process.env.EMAIL_USER}>`;
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }

      console.log(`[Resend] Email sent successfully to: ${to} (ID: ${data?.id || 'unknown'})`);
      return data;
    } catch (error) {
      console.error(`[Resend] Email error for ${to}:`, error.message || error);
      throw error;
    }
  }

  // 3. Nodemailer SMTP with IPv4 (Fallback)
  console.log(`[sendEmail] Using provider: SMTP`);
  try {
    const info = await transporter.sendMail({
      from: `"FSDM Project Repository" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[SMTP] Email sent successfully to: ${to}`);
    return info;
  } catch (error) {
    console.error(`[SMTP] Email error for ${to}:`, error.message || error);
    throw error;
  }
};

sendEmail.transporter = transporter;

module.exports = sendEmail;
module.exports.transporter = transporter;
