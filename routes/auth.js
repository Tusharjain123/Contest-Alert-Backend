const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../model/User.jsx");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")

// For Adding data and Sending subscription message
router.post("/subscribe", [
  body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    let u = await User.findOne({ email: req.body.email })
    if (u) {
      return res.status(400).json({ error: "Sorry a user with this email already exist" });
    }
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email } = req.body;
      const userData = jwt.sign({ name: name, email: email }, process.env.SECRET_KEY)
      const user = new User({ name: name, email: email, verified: false, userid: userData });
      const saveNote = await user.save();
      res.json(saveNote);
      const msg = {
        from: process.env.REACT_APP_EMAIL,
        to: req.body.email,
        subject: "Email Verification",
        html: `<div style="font-family:Verdana, Geneva, Tahoma, sans-serif;width: fit-content;padding: 30px;display: block;margin: auto;border: 2px solid black;border-radius: 10px;text-align: center;background-color: rgb(0, 0, 0, 0.7);color: white;">
        <div>
            <h1 style="font-size: 48px; font-weight: 400">Welcome ${name}</h1> 
            <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;margin: auto;" />
        </div>
        <div>
            <p>We're excited to have you here. First, you need to confirm your account.<br> Just press the button below.</p>
            <button style="border-radius: 10px;border: 1px solid black;padding: 5px 10px;"><a href="${process.env.BASE_URL}/verificationemail/user/verification/${process.env.START_SECURE+userData +process.env.END_SECURE}" style="text-decoration: none;">Click here</a> </button>
        </div>
    </div>`
      };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.REACT_APP_EMAIL,
          pass: process.env.REACT_APP_PASSWORD,
        },
        port: 587,
        secure: true,
        host: "smtp.gmail.com",
      })
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          transporter.sendMail(msg, (err) => {
            if (err) {
              return console.log("Error occurs", err);
            } else {
              return console.log("Email sent");
            }
          })
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
module.exports = router;