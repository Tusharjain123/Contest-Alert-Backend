const connectToMongo = require("./db")
const express = require("express")
const cors = require("cors")
const axios = require("axios");
var cron = require('node-cron');

connectToMongo()

const app = express() 
app.use(cors({
    origin: "*"
}))

app.use(express.urlencoded({ extended: true })); 
app.use(express.json())
app.use("/api/auth", require("./routes/auth.js"))
app.use("/api/delete", require("./routes/delete.js"))
app.use("/api/reminderemail", require("./routes/reminder.js"))
app.use("/api/senddataemail", require("./routes/senddata.js"))
app.use("/api/verificationemail", require("./routes/userverification.js"))
app.use("/api/updating", require("./routes/update.js"))
app.get("/", (req,res)=>{
res.send("Working")})


cron.schedule('0 0 * * 0', async () => {
  const response =  await axios.post("https://contestsaathi.onrender.com/api/senddataemail/senddata")
})

cron.schedule('0 1 * * *', async () => {
  const response =  await axios.post("https://contestsaathi.onrender.com/api/reminderemail/reminder")
})

cron.schedule('30 13 * * *', async () => {
  const response =  await axios.post("https://contestsaathi.onrender.com/api/reminderemail/reminder")
})


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server is started")
})
