const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

const testEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Testing SMTP connection...');
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('Server is ready to take our messages');

    const mailOptions = {
      from: `RoadX <${process.env.EMAIL_USER}>`,
      to: 'uttkarshtiwari03@gmail.com', // Just to test
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error in sending email:', error);
  }
};

testEmail();
