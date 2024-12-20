const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Donationdata = require("../Models/Donation.model")

const razorpay = new Razorpay({
    key_id: "rzp_test_UtFEEE7DLIxos0",
    key_secret: "vUIGiPmVJGuagAoWTIiOSKUW",
});

const PaymentDonation =  async(req,res)=>{
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const verifyDonation=async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, userId,  amount, razorpay_signature} = req.body;
        const generated_signature = crypto.createHmac("sha256", "vUIGiPmVJGuagAoWTIiOSKUW")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {

            const data = await Donationdata.create({
                userId,
                amount,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id
            });
            console.log(data);
            

            res.status(200).json({ message: "Payment verified successfully"});

            console.log("Success");
            
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports ={ PaymentDonation,verifyDonation}
