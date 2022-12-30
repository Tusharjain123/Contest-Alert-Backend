const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../model/User.jsx");

router.delete("/unsubscribeMe", async (req, res) => {
    const email = req.body.email
    let cancel = await User.findOne({ email: email });
    if (!cancel) {
        return res.status(404).json({ error: "NotFound" });
    }
    try {
        del = await User.findByIdAndDelete(cancel._id);
        res.json({ Success: "Subscription has been Cancelled", user: del });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servor Error");
    }
});

module.exports = router;