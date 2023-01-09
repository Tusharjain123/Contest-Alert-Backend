const express = require("express");
const router = express.Router();
const User = require("../model/User.jsx");
const { body, validationResult } = require("express-validator");

router.post("/updatedata",  [
    body("email", "Enter a valid email").isEmail(),
    body("alert", "Alert field is empty").isLength({
    min: 1,
  }),],async (req,res)=>{
    let u = await User.findOne({email: req.body.email})
    if( !u){
        return res.status(400).send({msg : "User with this e-mail does not exist."})
    }
    try {
      const {email, alert } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(406).send({ msg:"Enter a valid mail or your alert choice is empty" });
        }
        if (u && !u.verified){
            return res.status(400).send({msg : "User with this e-mail does not exist."})
        }
        await User.updateOne({email: email}, {$set : {choices : alert }})
        return res.status(200).send({msg : "Your alert choices is updated"})
    }
    catch (err){
        console.log(err)
        res.status(500).send({msg : "Internal Server Error"});
    }
})
module.exports = router;