const connectToMongo = require("./db")
const express = require("express")
const cors = require("cors")
const axios = require("axios");
var cron = require('node-cron');
const run = async () =>{
  await connectToMongo().then(()=>{
    console.log("Connected")
  }).catch(err => console.log(err))

}
run()

const app = express() 
app.use(cors({
    origin: "*"
}))

app.use(express.urlencoded({ extended: true })); 
app.use(express.json())
app.use("/api/auth", require("./routes/auth.js"))

app.get("/", (req,res)=>{
res.send("Your API is working")})


cron.schedule('0 2 * * *', async () => {
  const response =  await axios.post("https://contest-alert-backened-production.up.railway.app/api/auth/senddata")
})

cron.schedule('0 21 * * *', async () => {
  const response =  await axios.post("https://contest-alert-backened-production.up.railway.app/api/auth/reminder")
})


app.listen(process.env.PORT,()=>{
    console.log("Server is started")
})
