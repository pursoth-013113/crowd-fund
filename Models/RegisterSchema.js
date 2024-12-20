const mongoose = require("mongoose");
const {v4} = require("uuid")

const RegisterSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    Name:{
        type:String,
        required:true
    },
    Username:{
        type:String,
        
    },
    Email:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:String,
        
    },
    Address:{
        type:String,
        
    },
    Pincode:{
        type:Number,
    },
    Password:{
        type:String,
    },
    conformPassword:{
        type:String
    },
    status:{
        type:String,
        default:"active"
    },
    Role:{
        type:String,
        default:"User"
    }

})

const Register = mongoose.model("Register",RegisterSchema);

module.exports = Register