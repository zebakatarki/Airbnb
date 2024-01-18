// In this entered all the listings routes
const express=require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("../schema.js");
// const {listingSchema} = require("../schema.js");
//Requiring listning.js first model
const Listing=require("../models/listing.js");
const{isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//To validate the joi schema or hopscotch requests for post of listing
// const validateListing = (req,res,next) => {
//     let {error}=listingSchema.validate(req.body); //validating data from req on linstingSchema and storin in fetched error
//     console.log(error);
//     if(error){
//         //Here in errMsg v r storing only message of error 
//         //firstly we map the details of error each element of details 
//         //in that v r gng to store and display message of details of error
//         //we can heck this in a bash 
//         let errMsg = error.details.map((el) => el.message).join(","); //"listing.description" is required
//         // throw new ExpressError(400, error); //ValidationError: "listing.description" is required
//         throw new ExpressError(400, errMsg);
//     }else{
//         next(); 
//     }
// };

//INDEX Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log("/new After Logged In User information",req.user);  //user related info after logged in 
    // res.send("New Route");
    // if(!req.isAuthenticated()){ //checking for logged in user
    //     req.flash("error","You must be logged in to create listing");
    //     res.redirect("/login");
    // }

    res.render("listings/new.ejs");
})

//SHOW Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
    path : "reviews",
    populate: {
        path:"author",
    },
    }) //Populating reviews with their details
    .populate("owner"); //Populating owner with their details
    if(!listing){
        req.flash("error","Listing You Requested For Does not Exist!");
        res.redirect("/listings");
    }
    console.log("Listinng Information With its owner",listing);
    res.render("listings/show.ejs",{listing});
}))

//Create Route

//Try Catch Used
// app.post("/listings",async(req,res,next)=>{
//     try{
//         // let{title,description,image,price,country,location}=req.body;
//     //OR
//     // let listing = req.body.Listing;
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//     // console.log(listing);
//     }catch(err){
//         next(err);
//     }
// })

//wrapAsync Used
//Used many if conditions
// app.post("/listings",wrapAsync(async(req,res,next)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send valid data for listing");
//     }
//     const newListing = new Listing(req.body.listing);
//     if(!newListing.title){
//         throw new ExpressError(400,"title is missing!!");
//     }
//     if(!newListing.description){
//         throw new ExpressError(400,"Description is missing!!");
//     }

//     //If image is not sent Bydefault image will be added
//     // if(!newListing.image){
//     //     throw new ExpressError(400,"image is missing!!");
//     // }

//     if(!newListing.price){
//         throw new ExpressError(400,"price is missing!!");
//     }
//     if(!newListing.location){
//         throw new ExpressError(400,"location is missing!!");
//     }
//     if(!newListing.country){
//         throw new ExpressError(400,"country is missing!!");
//     }
//     await newListing.save();
//     res.redirect("/listings");
//     // console.log(listing);
// }));

//Create new listing
router.post("/",
isLoggedIn,
//added here bcz if the user sendthe post request from hopscotch or postman  
validateListing,
wrapAsync(async(req,res,next)=>{
    //Using validation schema and commented out bcz of validateListing middleware
    //data whc is cmg wth the hoppscotch req that data is satisfyin wth validation schema
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    // req.flash("success","user registered successfully!");
    // req.session.name=name;
    // console.log(req.session.name);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //current user id
    console.log("LOggedIn User Id:",req.user._id);
    console.log("LoggedIn User information:",req.user);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log("/:id/edit After Logged In User information",req.user);
    if(!listing){ //when we searched directly 
        req.flash("error","Listing You Requested For Does not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
router.put("/:id/update",
isLoggedIn,
isOwner,
validateListing,
wrapAsync(async(req,res)=>{
    //commented out bcz of validateListing middleware
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let{id}=req.params;
    //2nd of authorisation of edit and delete To protect editing from hopscotch requests
    //let listing = await findById(id);
    // if(!currentUser && listing.owner._id.equals(res.locals.currentUser._id)){ 
    //     req.flash("error","You dont have permission to edit this post");
    //     req.redirect(`/listings/${id}`);
    // }
    //Rather than adding it into every route we make it middleware 

    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing the individual values
    console.log("/:id/Update After Logged In User information",req.user);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//Delete Listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    // res.send("Delete");
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("/:id/delete After Logged In User information",req.user);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

router.post("/:id/template",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    console.log(id);
}))

module.exports = router;