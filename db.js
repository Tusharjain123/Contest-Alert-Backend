const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI=process.env.REACT_APP_MONGODB_URI
const connectToMongo = async()=>{
    mongoose.connect(process.env.REACT_APP_MONGODB_URI, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>
{console.log("Connected to Mongo")}).catch((err)=>{
    console.log("Not connected")
})
}

module.exports = connectToMongo
