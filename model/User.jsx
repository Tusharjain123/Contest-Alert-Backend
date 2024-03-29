const mongoose =require("mongoose")
const {Schema} = mongoose
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
    },
    choices : {
        type : String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    verified : {
        type: Boolean,
        required : true
    }
})
module.exports = mongoose.model("user", UserSchema)