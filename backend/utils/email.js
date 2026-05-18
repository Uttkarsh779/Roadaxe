const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const port = Number(process.env.EMAIL_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.revarion.com',
    port: port,
    secure: port === 465, // true only for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER || 'jim@revarion.com',
      pass: process.env.EMAIL_PASS || 'Ketan@2001',
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Roadaxe <${process.env.EMAIL_USER || 'jim@revarion.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Support for HTML
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
