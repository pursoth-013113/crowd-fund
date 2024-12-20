const mongoose = require("mongoose");

const Qurey = new mongoose.Schema({
    Question:{
        type:String
    },
    Email:{
        type:String
    }
})


const QuerySchema = mongoose.model("question", Qurey);


module.exports = QuerySchema;