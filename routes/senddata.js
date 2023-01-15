const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const User = require("../model/User.jsx");
const nodemailer = require("nodemailer");
const secondsToTime = require("../secondtoTime")
const date_time = require("date-fns-tz")

const transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 100,
    maxMessages: 200,
    service: "gmail",
    auth: {
        user: process.env.REACT_APP_EMAIL,
        pass: process.env.REACT_APP_PASSWORD,
    },
    secure: true,
    port: 587,
    host: "smtp.gmail.com",
})
router.post("/senddata", async (req, res) => {
    let dat = await User.find({});
    res.json(dat);
    dat.forEach((ele) => {
        if (ele.verified) {
            const contestData = async (value) => {
                axios.get("https://www.kontests.net/api/v1/" + value).then((response) => {
                    if (value === "code_chef" || value === "leet_code") {
                        response.data = response.data.reverse()
                    }
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
                        let new_start_date = date_time.formatInTimeZone(element.start_time, "Asia/Kolkata", 'yyyy-MM-dd HH:mm:ss')
                        let new_end_date = date_time.formatInTimeZone(element.end_time, "Asia/Kolkata", 'yyyy-MM-dd HH:mm:ss')
                        let arr_new_date = new_start_date.split(" ")
                        let arr_new_end_date = new_end_date.split(" ")
                        txt += `<div class="contest_data"> <div class="name"> <span class="h">Contest name </span> <span style="font-family:Verdana, Geneva, Tahoma, sans-serif ; font-size: 17px;font-style: italic;">: ${element.name}</span></div>
                <div class="date"><span class="h">Date : </span> ${(sdt.toDateString())}</div>
                <div class="time"><span class="h">Time(IST 24 hr format)  :  </span>${arr_new_date[1].slice(0, 5)} to ${arr_new_end_date[1].slice(0, 5)}</div>
                <div class="duration"><span class="h">Duration : </span> ${secondsToTime(element.duration)}</div>
                <div class="link"><span class="h">Link : </span><a href="${element.url}">Click Here</a></div>
                <hr></div>`;
                    });
                    txt += `</div></div><div style = "margin-top: 10px;">To unsubscribe from our newsletter Click here -> <a href='https://contest-saathi.web.app/unsubscribe'>Unsubscribe</a></div></body></html>`;
                    const msg = {
                        from: process.env.REACT_APP_EMAIL,
                        to: ele.email,
                        subject: value + " Contest",
                        html: txt,
                    };

                    transporter.verify(function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            setTimeout(() => {
                                transporter.sendMail(msg, (err) => {
                                    if (err) {
                                        return console.log("Error occurs", err);
                                    } else {
                                        return console.log("Email sent");
                                    }
                                });
                            },10000)
                        }
                    });

                })
                    .catch(function (error) {
                        console.log(error);
                    });
            };
            if (ele.choices) {
                const choice = (ele.choices).split(",")
                for (let i = 0; i < choice.length; i++) {
                    switch (choice[i]) {
                        case "Code Chef":
                            setTimeout(() => {
                                contestData("code_chef")
                            }, 1000)
                            break;
                        case "Codeforces":
                            setTimeout(() => {
                                contestData("codeforces")
                            }, 1000)
                            break
                        case "Leet Code":
                            setTimeout(() => {
                                contestData("leet_code")
                            }, 1000)
                            break
                        case "Kick Start":
                            setTimeout(() => {
                                contestData("kick_start")
                            }, 1000)
                            break
                        default:
                            break;
                    }
                }
            }
            else {
                setTimeout(() => {
                    contestData("code_chef")
                }, 1000)
                setTimeout(() => {
                    contestData("codeforces")
                }, 1000)
                setTimeout(() => {
                    contestData("leet_code")
                }, 1000)
            }
        }
    });
});

module.exports = router;
