const express = require("express");
const router = express.Router();
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../model/User.jsx");


function secondsToTime(e) {
  const d = Math.floor(e / (24 * 3600));
  if (d > 0) {
    const h = Math.floor((e % (24 * 3600)) / 3600).toString().padStart(2, "0"),
      m = Math.floor((e % 3600) / 60).toString().padStart(2, "0")
    return d + " days " + h + " hr " + m + " min ";
  }
  else {
    const h = Math.floor(e / 3600).toString().padStart(2, "0"),
      m = Math.floor((e % 3600) / 60).toString().padStart(2, "0")
    return h + " hr " + m + " min ";
  }
}

// For Adding data and Sending subscription message
router.post("/subscribe", async (req, res) => {
  let u = await User.findOne({ email: req.body.email })
  if (u) {
    return res.status(400).json({ error: "Sorry a user with this email already exist" });
  }
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const saveNote = await user.save();
    res.json(saveNote);
    const msg = {
      from: process.env.REACT_APP_EMAIL,
      to: email,
      subject: "Subscription conformation",
      html: `<div style="width:fit-content ; height:fit-content; margin:auto ; padding : 5px ; border: 1px solid black">
                <div style="font-size: 2.5vw; font-family: Verdana, Geneva, Tahoma, sans-serif"><b> Hello <span
                            style="color: red;">Tushar Jain</span> </b></div>
                <div style="font-size: 2.5vw; font-family: Verdana, Geneva, Tahoma, sans-serif;">
                <div > You have been successfully
                    subscribed to our newsletter.</div>
                <div>You will soon receive information
                    about new contest.</div>
                </div>
            </div>`,
    };

    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REACT_APP_EMAIL,
        pass: process.env.REACT_APP_PASSWORD,
      },
      port: 465,
      host: "smtp.gmail.com",
    })
      .sendMail(msg, (err) => {
        if (err) {
          return console.log("Error occurs", err);
        } else {
          return console.log("Email sent");
        }
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Servor Error");
  }
});

// For deleting Data
router.delete("/unsubscribeMe", async (req, res) => {
  const email = req.body.email
  let cancel = await User.findOne({ email: email });
  if (!cancel) {
    return res.status(404).send("NotFound");
  }
  try {
    del = await User.findByIdAndDelete(cancel._id);
    res.json({ Success: "Subscription has been Cancelled", user: del });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Servor Error");
  }
});

// For sending Alert
router.post("/senddata", async (req, res) => {
  let dat = await User.find({});
  res.json(dat);
  dat.forEach((ele) => {
    const contestData = async (value) => {
      axios.get("https://www.kontests.net/api/v1/" + value).then((response) => {
        let txt = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <style>
                  .container{
                      border: 2px solid black;
                      width: fit-content;
                      padding: 2vh 4vw;
                  }
                  .heading{
                      text-align: center;
                      font-size: 23px;
                      font-weight: bold;
                      text-decoration: underline;
                      margin-bottom: 15px;
                  }
                  .contest_data{
                      background-color: antiquewhite;
                      padding: 15px;
                      margin: auto;
                      margin-top: 15px;
                      margin-bottom: 15px;
                      font-size: 16px;
                  }
                  .h{
                      font-weight: bold;
                  }
                  div{
                    margin: 4px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="heading">Upcoming Contests</div>
                  `;
        response.data.forEach((element) => {
          let sdt = new Date(element.start_time)
          let edt = new Date(element.end_time)
          txt += `<div class="contest_data"> <div class="name"> <span class="h">Contest name </span> <span style="font-family:Verdana, Geneva, Tahoma, sans-serif ; font-size: 17px;font-style: italic;">: ${element.name}</span></div>
            <div class="date"><span class="h">Date : </span> ${(sdt.toDateString())}</div>
            <div class="time"><span class="h">Time :  </span>${sdt.toLocaleTimeString().slice(0, 5)} to ${edt.toLocaleTimeString().slice(0, 5)} </div>
            <div class="duration"><span class="h">Duration : </span> ${secondsToTime(element.duration)}</div>
            <div class="link"><span class="h">Link : </span><a href="${element.url}">Click Here</a></div>
            <hr></div>`;
        });
        txt += "</div></div><a href='/unsubscribeme'>Unsubscribe</a></body></html>";
        const msg = {
          from: process.env.REACT_APP_EMAIL,
          to: ele.email,
          subject: value + " Contest",
          html: txt,
        };

        nodemailer
          .createTransport({
            service: "gmail",
            auth: {
              user: process.env.REACT_APP_EMAIL,
              pass: process.env.REACT_APP_PASSWORD,
            },
            secure: true,
            port: 465,
            host: "smtp.gmail.com",
          })
          .sendMail(msg, (err) => {
            if (err) {
              return console.log("Error occurs", err);
            } else {
              return console.log("Email sent");
            }
          });
      })
        .catch(function (error) {
          console.log(error);
        });
    };
    contestData("codeforces");
    contestData("code_chef");
    contestData("leet_code");
  });
});

router.post("/reminder", async (req, res) => {
  let dat = await User.find({});
  res.json(dat);
  dat.forEach((ele) => {
  const reminder = async (value) => {
    axios.get("https://www.kontests.net/api/v1/" + value).then((response) => {
      let txt = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <style>
                  .container{
                      border: 2px solid black;
                      width: fit-content;
                      padding: 2vh 4vw;
                  }
                  .heading{
                      text-align: center;
                      font-size: 23px;
                      font-weight: bold;
                      text-decoration: underline;
                      margin-bottom: 15px;
                  }
                  .contest_data{
                      background-color: antiquewhite;
                      padding: 15px;
                      margin: auto;
                      margin-top: 15px;
                      margin-bottom: 15px;
                      font-size: 16px;
                  }
                  .h{
                      font-weight: bold;
                  }
                  div{
                    margin: 4px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="heading">Upcoming Contests</div>
                  `;
      const filterData = (response.data.filter((ele) => {
        return ele.in_24_hours === "Yes"
      }))

      filterData.forEach((element) => {
        let sdt = new Date(element.start_time)
        let edt = new Date(element.end_time)
        txt += `<div class="contest_data"> <div class="name"> <span class="h">Contest name </span> <span style="font-family:Verdana, Geneva, Tahoma, sans-serif ; font-size: 17px;font-style: italic;">: ${element.name}</span></div>
            <div class="date"><span class="h">Date : </span> ${(sdt.toDateString())}</div>
            <div class="time"><span class="h">Time :  </span>${sdt.toLocaleTimeString().slice(0, 5)} to ${edt.toLocaleTimeString().slice(0, 5)} </div>
            <div class="duration"><span class="h">Duration : </span> ${secondsToTime(element.duration)}</div>
            <div class="link"><span class="h">Link : </span><a href="${element.url}">Click Here</a></div>
            <hr></div>`;
      });
      txt += "</div></div><a href='/unsubscribeme'>Unsubscribe</a></body></html>";
      const msg = {
        from: process.env.REACT_APP_EMAIL,
        to: ele.email,
        subject: "Reminder",
        html: txt,
      };

      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.REACT_APP_EMAIL,
            pass: process.env.REACT_APP_PASSWORD,
          },
          secure: true,
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          if (err) {
            return console.log("Error occurs", err);
          } else {
            return console.log("Email sent");
          }
        });
    })
      .catch(function (error) {
        console.log(error);
      });
  }
  reminder("codeforces")
  reminder("code_chef")
  reminder("leet_code")
})
})
module.exports = router;