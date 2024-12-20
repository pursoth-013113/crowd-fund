const mongoose =require("mongoose");

const Amount = new mongoose.Schema({
    Name:{
        type:String
    },
    Email:{
        type:String
    },
    Phone_Number:{
        type:String
    },
    Pan_card:{
        type:String
    },
    Account_Number:{
        type:Number
    },
    IFSC_Number:{
        type:String
    },
    Branch:{
        type:String
    }

})

const AmountScheme = mongoose.model("Amount",Amount);

module.exports = AmountScheme;