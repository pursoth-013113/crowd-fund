
const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
    userId:
     { type:String, 
        required: true 
    },
    amount:{
         type: Number, 
         required: true 
    },
    currency: 
    { type: String, 
        default: "INR" 
    },
    razorpayOrderId: 
    { type: String, 
        required: true 
    },
    razorpayPaymentId: 
    { type: String, 
        required: true 
    },
    status: 
    { type: String, 
        default: "Successful" 
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    Fundraiser_Name:{
        type:String,
        required:true
    },
    Fundraiser_id:{
        type:String,
        required:true
    }

});

Paymentdata = mongoose.model("Payment", paymentSchema);

module.exports = Paymentdata;


