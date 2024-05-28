
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phoneno : {
        type : Number,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profileImage : {
        type : String,
        default:'profileImage' 
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
})

const User=new mongoose.model("User", userSchema)
module.exports = User;