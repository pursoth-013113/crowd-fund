const express = require("express");
const Route = express.Router();
const {RegisterController,Login,dynamic,Recovery,otpVerify,resetPassword,Profile,ProfileUpdate,User} = require("../Controllers/RegisterController");
const {verify} = require("../Middlewares/token")


Route.post("/register",RegisterController);
Route.post("/Login",Login)
Route.post("/generateOTP", Recovery);
Route.post("/otpverify",otpVerify)
Route.post("/resetPassword",resetPassword)
Route.post("/ProfileUpdate",ProfileUpdate)
Route.get("/Profile",verify,Profile)
Route.get("/dynamic",dynamic)
Route.post("/ProfileUpdate",ProfileUpdate)
Route.get('/users/:userId', User)



module.exports = Route; 