const nodemailer = require('nodemailer');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

function createTransporter() {
  const smtp = env.smtp;
  if (!smtp.host || !smtp.user || !smtp.pass) {
    throw new ApiError(500, 'Email service is not configured');
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  });
}

exports.sendContactMessage = async ({ name, email, subject, message }) => {
  const smtp = env.smtp;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"BuyKIT Contact" <${smtp.from}>`,
    to: smtp.to,
    replyTo: email,
    subject: subject || `New BuyKIT contact message from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject || 'No subject'}`,
      '',
      message
    ].join('\n'),
    html: `
      <h2>New BuyKIT Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  });
};
