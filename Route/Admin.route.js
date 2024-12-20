const express = require("express");
const Route3 = express.Router();

const {Dashboard,User,add,block,unblock,deleteUser,fetch,DeleteUser} =  require("../Controllers/admin.controller");

Route3.get("/data",Dashboard);
Route3.get("/register",User);
Route3.post("/add",add)
Route3.post("/block/:_id",block);
Route3.post("/unblock/:_id",unblock);
Route3.post("/delete/:_id",deleteUser)
Route3.get("/campaigns",fetch)
Route3.post("/deleteCampaigns/:_id",DeleteUser)

module.exports = Route3