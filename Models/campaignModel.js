const mongoose = require("mongoose");
const {v4} = require("uuid")

const fundraiserSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    userId:{
        type:String,
        required:true
    },
    fundraiserName: 
    { 
        type: String, 
        required: true 
    },
    title: 
    { 
        type: String, 
        required: true 
    },
    totalAmount: 
    { 
        type: Number, 
        required: true 
    },
    endDate: 
    { 
        type: Date, 
        required: true 
    },
    category: 
    { 
        type: String, 
        required: true 
    },
    about: 
    { 
        type: String, 
        required: true 
    },
    bannerImage: 
    { 
        type: String, 
        required: true 
    },
    status: 
    { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    profileImage: 
    { 
        type: String, 
        required: true 
    },
    patientImages: 
    [
        { type: String }
    ] 
}, { timestamps: true });

Fundraiser= mongoose.model("pendingFundraiser", fundraiserSchema);

module.exports = Fundraiser
