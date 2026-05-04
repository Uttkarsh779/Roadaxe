const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.revarion.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // true for 465
    auth: {
      user: process.env.EMAIL_USER || 'jim@revarion.com',
      pass: process.env.EMAIL_PASS || 'Ketan@2001',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `RoadX <${process.env.EMAIL_USER || 'jim@revarion.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Support for HTML
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
