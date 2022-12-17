const connectToMongo = require("./db")
const express = require("express")
const cors = require("cors")
const axios = require("axios");
var cron = require('node-cron');

connectToMongo()
const app = express() 
app.use(cors({
    origin: process.env.REACT_APP_PROXY
}))
app.use(express.json())
app.use("/api/auth", require("./routes/auth.js"))

app.get("/", (req,res)=>{
res.send("Your API is working")})


cron.schedule('0 2 * * *', async () => {
  const response =  await axios.post("https://contest-alert-backened-production.up.railway.app/api/auth/senddata")
})

cron.schedule('0 14 * * *', async () => {
  const response =  await axios.post("https://contest-alert-backened-production.up.railway.app/api/auth/reminder")
})


app.listen(process.env.PORT,()=>{
    console.log("Server is started")
})
