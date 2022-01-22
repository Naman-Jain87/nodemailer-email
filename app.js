const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config()

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from gmail.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.AUTHEMAIL}`, // generated gmail user
      pass:`${process.env.AUTHPASSWORD}` , // generated gmail password
    },
  });
    let htmlTemplate = fs.readFileSync(path.join(__dirname, './template', 'email.html'))

    htmlTemplate = htmlTemplate.toString().replace('{{email}}', `test@email.com`)
    htmlTemplate = htmlTemplate.toString().replace('{{password}}', `${Date.now()}`)
    
    
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Fred Foo 👻" <${process.env.SENDEREMAIL}>`,
    to: `${process.env.TOEMAIL}`,
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: htmlTemplate, // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}

main().catch(console.error);



app.listen(3000, () => {
    console.log("Server connected with 3000");
});