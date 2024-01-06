const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema = new Schema({
    Comment:String,
    rating:{
        Type:Number,
        min:1,
        max:5
    },
    createdAt: {
        Type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("Review",reviewSchema);
