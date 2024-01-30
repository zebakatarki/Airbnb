const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async(req,res)=>{
    console.log("User is loggedIn to add review");
    let {id}=req.params;
    console.log("review.js",id);
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render("listings/review.ejs",{listing});
};

module.exports.createdReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id); 
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id; //id of author
    console.log("New Review Added By",newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();  

    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!"); 
    res.redirect(`/listings/${id}`);
}