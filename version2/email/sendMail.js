const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.AWS_SES_ENDPOINT,
    port: process.env.AWS_SES_PORT,
    // secure: process.env.AWS_SES_PORT == 465, // Use TLS (false for port 587)
    auth: {
      user: process.env.AWS_SES_USERNAME,
      pass: process.env.AWS_SES_PASS,
    },
  });
  

const sendMail = async (toEmail, subject, body, fromEmail = process.env.DEFAULT_FROM_EMAIL) => {
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}: ${info.response}`);
    return { success: true, response: info.response };
  } catch (error) {
    console.error(`Error sending email to ${toEmail}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;
