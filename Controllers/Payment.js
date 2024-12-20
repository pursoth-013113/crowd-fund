const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Paymentdata=require("../Models/payment.model")

const razorpay = new Razorpay({
    key_id: "rzp_test_UtFEEE7DLIxos0",
    key_secret: "vUIGiPmVJGuagAoWTIiOSKUW",
});

const Payment =  async(req,res)=>{
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // convert amount to paise
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


const verify=async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, userId,  amount, razorpay_signature, Fundraiser_id, Fundraiser_Name } = req.body;
        const generated_signature = crypto.createHmac("sha256", "vUIGiPmVJGuagAoWTIiOSKUW")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {

            const data = await Paymentdata.create({
                userId,
                amount,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                Fundraiser_id,
                Fundraiser_Name
            });
            console.log(data);
            

            res.status(200).json({ message: "Payment verified successfully",data });
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports ={ Payment,verify}
