const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 100,
    maxMessages: 200,
    service: "gmail",
    auth: {
        tpye: "OAuth2",
      user: process.env.REACT_APP_EMAIL,
      pass: process.env.REACT_APP_PASSWORD
    },
    secure: true,
    port: 587,
    host: "smtp.gmail.com",
})
const send = async (rec_mail,sub, text) => {
    const msg = {
        from: process.env.REACT_APP_EMAIL,
        to: rec_mail,
        subject: sub,
        html: text,
    };
    transporter.sendMail(msg,(err) => {
        if (err) {
            console.log("Error occurs", err);
          } else {
            console.log("Email sent");
          }
    })
}

module.exports = send