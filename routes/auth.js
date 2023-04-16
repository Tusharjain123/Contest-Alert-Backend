const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../model/User.jsx");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const send = require("../services/mailservice.js")

// For Adding data and Sending subscription message
router.post("/subscribe", [
  body("email", "Enter a valid email").isEmail(),
body("alert", "Alert field is empty").isLength({
  min: 1,
}),],
  async (req, res) => {
    let u = await User.findOne({ email: req.body.email })
    if (u && u.verified) {
      return res.status(400).json({ error: "Sorry a user with this email already exist" });
    }
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }
      if (u){
        await User.findByIdAndDelete(u._id)
      }
      const { name, email, alert } = req.body;
      const userData = jwt.sign({ name: name, email: email, choices: alert }, process.env.SECRET_KEY,{
        expiresIn: '30m'
    })
      const user = new User({ name: name, email: email, verified: false, userid: userData, choices: alert });
      const saveNote = await user.save();
      const html = `<div style="font-family:Verdana, Geneva, Tahoma, sans-serif;width: fit-content;padding: 30px;display: block;margin: auto;border: 2px solid black;border-radius: 10px;text-align: center;background-color: rgb(0, 0, 0, 0.7);color: white;">
      <div>
      <h1 style="font-size: 48px; font-weight: 400">Welcome ${name}</h1> 
      <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;margin: auto;" />
      </div>
      <div>
      <p>We're excited to have you here. First, you need to confirm your account.<br> Just press the button below.</p>
      <button style="border-radius: 10px;border: 1px solid black;padding: 5px 10px;"><a href="https://contestsaathibackend.azurewebsites.net/api/verificationemail/user/verification/${process.env.START_SECURE+userData +process.env.END_SECURE}" style="text-decoration: none;">Click here</a> </button>
      <p>Link is valid for 30 minutes only!!!</p>
      </div>
      </div>`
      await send(req.body.email,"Email Verification", html )
      res.json({msg: "Data Saved Successfully"});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
module.exports = router;