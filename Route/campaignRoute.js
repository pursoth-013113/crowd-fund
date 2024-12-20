const express = require("express");
const Route1 = express.Router();
const multiUpload = require("../Middlewares/multer")
const {createFundraiser,fetchCard,Details,Query,feedback,FundraiserDetails,Fundraisermaintain,PendingCard,Approve,Reject,fund,Payments} = require("../Controllers/campaignController");
const AmountController = require("../Controllers/AmountController");
const {Payment,verify} = require("../Controllers/Payment");
const {PaymentDonation,verifyDonation} = require("../Controllers/Donation")


Route1.post("/uploads", multiUpload, createFundraiser);
Route1.post("/Amount",AmountController)
Route1.get("/card",fetchCard);
Route1.get("/details/:id",Details)
Route1.post("/question",Query)
Route1.post("/feedback",feedback)
Route1.post("/orders",Payment);
Route1.post("/verify",verify)
Route1.get("/fundDetails",FundraiserDetails);
Route1.get("/canpaigndetails/:_id",Fundraisermaintain)
Route1.get("/pendingcampaigns",PendingCard)
Route1.post("/approve/:campaignId",Approve);
Route1.post("/reject/:campaignId",Reject);
Route1.get("/fundedit/:_id",fund);
Route1.post("/donation",PaymentDonation);
Route1.post("/donationverify",verifyDonation)
Route1.get ("/donation",Payments)


module.exports = Route1;
