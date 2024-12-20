const express =require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const session = require("express-session");

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,               
}));
app.use(session({
    secret: "Ashwin", 
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }        
}));
app.use(express.json())


const connection = require("./Config/Connection")
connection();

const Route = require("./Route/RegisterRoute");
app.use(Route)

const Route1 = require("./Route/campaignRoute")
app.use(Route1)

const Route3 =  require("./Route/Admin.route");
app.use(Route3)




const port = 1000;

app.listen(port,()=>{
    console.log("Port is running in",port);
    
})