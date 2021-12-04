const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const sendMail = async (toEmail, htmlForm) => {
  let transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: '"Preis Alarm⏰" <alert@pricealarm.com>',
    to: toEmail,
    subject: 'Preis Alarm',
    html: htmlForm,
  });
};

module.exports = sendMail;
