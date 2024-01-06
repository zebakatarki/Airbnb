const express=require("express");
const app=express();
const mongoose=require("mongoose");
//Requiring listning.js first model
const Listing=require("./models/listing.js");

const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

//joi 
const {listingSchema, reviewSchema} = require("./schema.js");

const Review=require("./models/review.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to MongooDB Of Major Project");
})
.catch((err)=>{
    console.log("MongoDB Error",err);
});

async function main(){
    await mongoose.connect(mongo_url);
} 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//Ejs Mate
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Checking Route
app.get("/",(req,res)=>{
    res.send("Hii im root:)")
});

//To validate the joi schema or hopscotch requests for post of listing
const validateListing = (req,res,next) => {
    let {error}=listingSchema.validate(req.body); //validating data from req on linstingSchema and storin in fetched error
    console.log(error);
    if(error){
        //Here in errMsg v r storing only message of error 
        //firstly we map the details of error each element of details 
        //in that v r gng to store and display message of details of error
        //we can heck this in a bash 
        let errMsg = error.details.map((el) => el.message).join(","); //"listing.description" is required
        // throw new ExpressError(400, error); //ValidationError: "listing.description" is required
        throw new ExpressError(400, errMsg);
    }else{
        next(); 
    }
};

//To validate the joi schema or hopscotch requests for post of review
const validateReview = (req,res,next) => {
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    }else{
        next(); 
    }
};

//INDEX Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
app.get("/listings/new",(req,res)=>{
    // res.send("New Route");
    res.render("listings/new.ejs");
})

//SHOW Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
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

app.post("/listings",
validateListing,
wrapAsync(async(req,res,next)=>{
    //Using validation schema and commented out bcz of validateListing middleware
    //data whc is cmg wth the hoppscotch req that data is satisfyin wth validation schema
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
app.put("/listings/:id/update",
validateListing,
wrapAsync(async(req,res)=>{
    //commented out bcz of validateListing middleware
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing the individual values
    res.redirect(`/listings/${id}`);
}))

//Delete
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    // res.send("Delete");
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Review POST ROUTE
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //In review ratings and comments both are present

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();  //whn v wnt to change in existing database v hv cll async save function

    // console.log("New Review Saved");
    // res.send("New Review Saved");

    res.redirect(`/listings/${listing._id}`);
}));

// app.get("/testListing",async(req,res)=>{
//     adding document
//     let sampleListening = new Listing({
//         title:"New Villa1",
//         description:"By the beach1",
//         image:"",
//         price:1200,
//         location: "Hubli, Karnataka",
//         country: "India",
//     });

//     await sampleListening1.save().then(()=>{
//         console.log("Doc is saved");
//     }).catch(()=>{
//         console.log("Document is not saved");
//     })
//     console.log("Sample was saved");
//     // console.log(sampleListening);
//     res.send("Successful Testing");
// })

//it gets in play when any random route is searched which is not defined define in our system
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    //Used this to show error with wrapAsync
    // res.send("Something Went Wrong!!");

    //Used this to show error with Error Class
    //Deconstruct
    let{statusCode=500,message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);
    // res.render("error.ejs",{err});
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});