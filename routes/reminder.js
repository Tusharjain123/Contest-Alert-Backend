const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const User = require("../model/User.jsx");
const nodemailer = require("nodemailer");
const secondsToTime = require("../secondtoTime")

router.post("/reminder", async (req, res) => {
    let dat = await User.find({});
    res.json(dat);
    dat.forEach((ele) => {
      if (ele.verified){
        const reminder = async (value) => {
          axios.get("https://www.kontests.net/api/v1/" + value).then((response) => {
            const filterData = (response.data.filter((ele) => {
              return ele.in_24_hours === "Yes"
            }))
            if (filterData.length >= 1) {
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
                        <div class="heading">Reminder Contest ${value}</div>
                        `;
    
    
              filterData.forEach((element) => {
                let sdt = new Date(element.start_time)
                let edt = new Date(element.end_time)
                txt += `<div class="contest_data"> <div class="name"> <span class="h">Contest name </span> <span style="font-family:Verdana, Geneva, Tahoma, sans-serif ; font-size: 17px;font-style: italic;">: ${element.name}</span></div>
                  <div class="date"><span class="h">Date : </span> ${(sdt.toDateString())}</div>
                  <div class="time"><span class="h">Time(IST 24 hr format) :  </span>${sdt.toLocaleTimeString({timezone : "IST"}).slice(0, 5)} to ${edt.toLocaleTimeString({timezone : "IST"}).slice(0, 5)} </div>
                  <div class="duration"><span class="h">Duration : </span> ${secondsToTime(element.duration)}</div>
                  <div class="link"><span class="h">Link : </span><a href="${element.url}">Click Here</a></div>
                  <hr></div>`;
              });
              txt += `</div></div><div style = "margin-top: 10px;">To unsubscribe from our newsletter Click here -> <a href='https://contest-saathi.web.app/unsubscribe'>Unsubscribe</a></div></body></html>`;
              const msg = {
                from: process.env.REACT_APP_EMAIL,
                to: ele.email,
                subject: "Reminder",
                html: txt,
              };
    
              const transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.REACT_APP_EMAIL,
                    pass: process.env.REACT_APP_PASSWORD,
                  },
                  secure: true,
                  port: 587,
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
                    });
                  }
                });
            }
          })
            .catch(function (error) {
              console.log(error);
            });
        }
        reminder("codeforces")
        reminder("code_chef")
        reminder("leet_code")
      }
    })
  })
  module.exports = router;