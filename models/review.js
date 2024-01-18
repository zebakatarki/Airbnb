const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema = new Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

// const tryin = async()=>{
//     const first = new Review({
//         comment:"Trying",
//         rating:3,
//     })

//     await first.save();
//     console.log("Successfull");
// }

// tryin();
// // const Review = mongoose.model("Review", reviewSchema);
// // module.exports=Review;

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports=Listing;
// OR

 module.exports = mongoose.model("Review",reviewSchema);

