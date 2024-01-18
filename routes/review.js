const express=require("express");
const router  = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// // const {listingSchema, reviewSchema} = require("../schema.js");
// const {reviewSchema} = require("../schema.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const {validateReview, isLoggedInReview, isReviewAuthor} = require("../middleware.js");

//Extra's
// const express=require("express");
// const router  = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// // const {listingSchema, reviewSchema} = require("../schema.js");
// const {listingSchema} = require("../schema.js");
// //Requiring listning.js first model
// const Listing=require("../models/listing.js");


//To validate the joi schema or hopscotch requests for post of review
//Adding it in middleware
// const validateReview = (req,res,next) => {
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(","); 
//         throw new ExpressError(400, errMsg);
//     }else{
//         next(); 
//     }
// };

// app.get("/listings/:id/reviews",async(req,res)=>{
//     let {id}=req.params;
//     // console.log(id);
//     const listing=await Listing.findById(id);
//     console.log(listing);
//     res.render("listings/review.ejs",{listing});
// })

// router.get("/listings/<%= listing.id %>/reviews",async(req,res)=>{     
// router.get("/template",async(req,res)=>{  
//     console.log("Working");
//     let {id}=req.query;
//     console.log(id);
//     const listing=await Listing.findById(id);
//     console.log(listing);
//     res.render("listings/review.ejs",{listing});
// })

// //Chat gpt
// router.post("/template", async (req, res) => {
//     console.log("Working");
//     let { id } = req.params;  // Use req.params to get the id from route parameters
//     console.log(id); //Undefined
//     const listing = await Listing.findById(id);
//     console.log(listing); //null
//     res.render("listings/review.ejs", { listing });
// });


// //Review POST ROUTE
// router.post("/",validateReview, wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review); //In review ratings and comments both are present

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();  //whn v wnt to change in existing database v hv cll async save function

//     // console.log("New Review Saved");
//     // res.send("New Review Saved");

//     res.redirect(`/listings/${listing._id}`);
// }));

// //Review Delete Route
// router.delete("/:reviewId", wrapAsync(async(req,res)=>{
//     let {id , reviewId} = req.params;
//     //Deleting the perticular review from listing's review array also
//     //So here firstly v are finding the listing which is matched to the id 
//     //Secondly v r pulling the perticular review via its id from reviews array of Listing 
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});

//     //Deleting the perticular review from review model or collection
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// })
// ); 

//Review get request
router.get("/",isLoggedInReview,async(req,res)=>{
    console.log("User is loggedIn to add review");
    let {id}=req.params;
    console.log("review.js",id);
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render("listings/review.ejs",{listing});
})

//Review POST ROUTE
router.post("/",isLoggedInReview,validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id); //id of listing
    let newReview = new Review(req.body.review); //In review ratings and comments both are present

    newReview.author = req.user._id; //id of author
    console.log("New Review Added By",newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();  //whn v wnt to change in existing database v hv cll async save function

    // console.log("New Review Saved");
    // res.send("New Review Saved");

    req.flash("success","Review Added:)");
    res.redirect(`/listings/${listing._id}`);
}));

//Review Delete Route
router.delete("/:reviewId", isLoggedInReview,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id , reviewId} = req.params;

    //Deleting the perticular review from listing's review array also
    //So here firstly v are finding the listing which is matched to the id 
    //Secondly v r pulling the perticular review via its id from reviews array of Listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});

    //Deleting the perticular review from review model or collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted:(");

    res.redirect(`/listings/${id}`);
})
); 

module.exports = router;