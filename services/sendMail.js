const nodemailer = require("nodemailer");
const config = require('config');
const smptHost = config.get('smptHost');
const authUser = config.get('authUser');
const authPass = config.get('authPass');

const sendMail = async(toEmail, htmlForm) => {
    let transporter = nodemailer.createTransport({
        host: smptHost,
        port: 465,
        secure: true,
        auth: {
            user: authUser,
            pass: authPass,
        },
        tls: { 
            rejectUnauthorized: false 
        }
    });

    await transporter.sendMail({
        from: '"Preis Alarm⏰" <alert@pricealarm.com>',
        to: toEmail,
        subject: "Preis Alarm",
        html: htmlForm,
    });
}

module.exports = sendMail