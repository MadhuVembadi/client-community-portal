const nodemailer = require('nodemailer');

require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vembadi.madhu@gmail.com',
      pass: process.env.MAILPASS
    }
  });


function getRandomNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
}
const otpmail = (request,response,next) => {

    const mailOptions = {
        from: 'vembadi.madhu@gmail.com',
        to: request.body.to,
        subject: 'Leave Status Update',
        text: "Your OTP to reset password is " + getRandomNumber()
      };
}
  