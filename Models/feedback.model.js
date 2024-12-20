const mongoose= require("mongoose")

const feedback = new mongoose.Schema({
    feedback:{
        type:String
    },
    Email:{
        type:String
    }
})

const FeedbackSchema = mongoose.model("Feedback",feedback)

module.exports = FeedbackSchema