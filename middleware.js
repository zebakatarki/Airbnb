const Listing = require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
// const {listingSchema, reviewSchema} = require("../schema.js");

//isLoggedIn is a function name
module.exports.isLoggedIn=(req,res,next)=>{
    console.log("isLoggedIn Called");
    console.log(req.path,"..",req.originalUrl);
    console.log("Mw bfr req.user",req.user);
    if(!req.isAuthenticated()){ //checking for logged in user
        console.log("Mw Aft req.user",req.user);
        req.session.redirectUrl = req.originalUrl; //1st redirectUrl is a variable which contains originalUrl
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.isLoggedInReview=(req,res,next)=>{
    console.log("Review's req.user",req.user);
    if(!req.isAuthenticated()){ //checking for logged in user
        req.session.redirectUrl = req.originalUrl; //1st redirectUrl is a variable which contains originalUrl
        req.flash("error","You must be logged in to add review");
        res.redirect("/login");
    }
    next();
}

//2nd
//if we directly want to access redirectUrl in login route it shows undefined bcz when clicked the login and middleware 
//approved all authetication login will reset the redirectUrl which are stored in session so we the local bcz passport 
//dnt hv the any access to delete that redirectUrl so we are storing the redirectUrl in locals

module.exports.saveRedirectUrl=(req,res,next) => {
    //if in our req session any redirectUrl is saved then store that into res.locals's redirectUrl
    console.log("saveRedirectUrl is not present");
    if(req.session.redirectUrl){
        console.log("saveRedirectUrl is present");
        res.locals.redirectUrl = req.session.redirectUrl; //2nd
    }
    next();
};

 //3rd Middle Ware of authorisation of edit and delete To protect editing from hopscotch requests
module.exports.isOwner = async (req,res,next)=>{
    console.log("isOwner is Called");
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){ 
        console.log("Current User And Admin not matched");
        req.flash("error","You are not the owner of this post");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
    
//Using validateListing as MiddleWare 
module.exports.validateListing = (req,res,next) => {
    let {error}=listingSchema.validate(req.body); //listingSchema Joi's Schema
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg); //ExpressError   
    }else{
        next(); 
    }
};

//Using validateReview As MiddleWare
module.exports.validateReview = (req,res,next) => {
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    }else{
        next(); 
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId); 
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};