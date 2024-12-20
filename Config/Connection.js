const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect("mongodb+srv://FundCommunity:FundsCrowd@fundcommunity.ksxn1.mongodb.net/?retryWrites=true&w=majority&appName=FundCommunity");
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connection;
