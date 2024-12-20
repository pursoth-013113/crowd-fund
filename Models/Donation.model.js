const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Successful"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Donationdata = mongoose.model("Donation", DonationSchema);

module.exports = Donationdata;
