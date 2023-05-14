const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const User = require("../model/User.jsx");
const secondsToTime = require("../secondtoTime")
const date_time = require("date-fns-tz")
const send = require("../services/mailservice.js")


const mailWriter = (value) => {
  var txt = ""
  var content = axios.get("https://kontests.net/api/v1/" + value).then((response) => {
    if (value === "code_chef" || value === "leet_code") {
      response.data = response.data.reverse()
  }
    const filterData = (response.data.filter((ele) => {
      return ele.in_24_hours === "Yes"
    }))
    if (filterData.length >= 1) {
      txt += `<!DOCTYPE html>
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
                    <div class="heading">Reminder Contest ${value}</div>`;
      filterData.forEach((element) => {
        let sdt = new Date(element.start_time)
        let new_start_date = date_time.formatInTimeZone(element.start_time, "Asia/Kolkata", 'yyyy-MM-dd HH:mm:ss')
        let new_end_date = date_time.formatInTimeZone(element.end_time, "Asia/Kolkata", 'yyyy-MM-dd HH:mm:ss')
        let arr_new_date = new_start_date.split(" ")
        let arr_new_end_date = new_end_date.split(" ")
        txt += `<div class="contest_data"> <div class="name"> <span class="h">Contest name </span> <span style="font-family:Verdana, Geneva, Tahoma, sans-serif ; font-size: 17px;font-style: italic;">: ${element.name}</span></div>
              <div class="date"><span class="h">Date : </span> ${(sdt.toDateString())}</div>
              <div class="time"><span class="h">Time(IST 24 hr format) :  </span>${arr_new_date[1].slice(0, 5)} to ${arr_new_end_date[1].slice(0, 5)} </div>
              <div class="duration"><span class="h">Duration : </span> ${secondsToTime(element.duration)}</div>
              <div class="link"><span class="h">Link : </span><a href="${element.url}">Click Here</a></div>
              <hr></div>`;
      });
      txt += `</div></div><div style = "margin-top: 10px;">To unsubscribe from our newsletter Click here -> <a href='https://contest-saathi.web.app/unsubscribe'>Unsubscribe</a></div></body></html>`;
    }
    return txt
  })
  return content
}


const sendmsg = async (dat, email_msg) => {
  dat.forEach(async (ele) => {
    if (ele.choices) {
      const choice = (ele.choices).split(",")
      for (let i = 0; i < choice.length; i++) {
        switch (choice[i]) {
          case "Code Chef":
            if (email_msg.code_chef != "") {
              await send(ele.email, "Reminder", email_msg.code_chef)
            }
            break;
          case "Codeforces":
            if (email_msg.codeforces != "") {
              await send(ele.email, "Reminder", email_msg.codeforces)
            }
            break
          case "Leet Code":
            if (email_msg.leet_code != "") {
              await send(ele.email, "Reminder", email_msg.leet_code)
            }
            break
          case "Kick Start":
            if (email_msg.kick_start != "") {
              await send(ele.email, "Reminder", email_msg.kick_start)
            }
            break
          case "AtCoder":
            if (email_msg.at_coder != "") {
              await send(ele.email, "Reminder", email_msg.at_coder)
            }
            break
          default:
            break;
        }
      }
    }
    else {
      if (email_msg.code_chef != "") {
        await send(ele.email, "Reminder", email_msg.code_chef)
      }
      if (email_msg.codeforces != "") {
        await send(ele.email, "Reminder", email_msg.codeforces)
      }
      if (email_msg.leet_code != "") {
        await send(ele.email, "Reminder", email_msg.leet_code)
      }
    }
  })
}


router.post("/reminder", async (req, res) => {
  let dat = await User.find({ verified: true });
  const email_msg = {
    "codeforces": "",
    "leet_code": "",
    "kick_start": "",
    "code_chef": "",
    "at_coder": ""
  }
  for (const keys in email_msg) {
    email_msg[keys] = await mailWriter(keys)
  }
  await sendmsg(dat, email_msg)
  res.json({msg: "Reminder mail send"});
})
module.exports = router;
