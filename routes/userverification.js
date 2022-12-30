const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const User = require("../model/User.jsx");
const jwt = require("jsonwebtoken");

router.get(`/user/verification/:id` ,async (req, res) => {
    try {
        const userid = (req.params.id).slice(128,-128)
        const ve = jwt.verify(userid, process.env.SECRET_KEY)
        if (userid) {
            const userFind = await User.findOne({ userid: userid })
            if (userFind) {
                await User.updateOne({ userid: userid }, { $set: { verified: true } })
                res.sendFile(__dirname+"/verify.html")
            }
            else {
                res.status(403).send("Invalid Token")
            }
        }
        else {
            res.status(403).send({ message: "Invalid Token or token does not exist" })
        }
    } catch (error) {
        res.status(401).send({ message: "Either the token is expired or the token is invalid" })
    }
})

module.exports = router;
