const Listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');//require Mapbox Geocoding service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken }); //starting Geocoding service "geocodingClient" ll work for Geocoding service

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
        console.log("Current",req.user);  //user related info after logged in 
        res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({ //nesting populate
    path : "reviews",
    populate: {
        path:"author",
    },
    }) 
    .populate("owner"); //Populating owner with their details
                                                                  
    if(!listing){
        req.flash("error","Listing You Requested For Does not Exist!");
        res.redirect("/listings");
    }
    console.log("Listing Information With its owner",listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();
    console.log("Forward Geocode",response.body.features[0].geometry); 
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"....",filename);
 
    const newListing = new Listing(req.body.listing);

    console.log("New Listing",newListing)

    const selectedCategory = req.body.listing.category;

    newListing.owner = req.user._id; //current user id
    newListing.image={url,filename};

    newListing.geometry =response.body.features[0].geometry;

    console.log("LOggedIn User Id:",req.user._id);
    console.log("LoggedIn User information:",req.user);
    let savedListing = await newListing.save();

    console.log("Saved listing with map",savedListing);

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log("/:id/edit After Logged In User information",req.user);

    if(!listing){ 
        req.flash("error","Listing You Requested For Does not Exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/c_scale,w_200");

    res.render("listings/edit.ejs",{listing,originalImageUrl});
};


module.exports.updateListing = async(req,res)=>{
    let{id}=req.params;    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing the individual values

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    console.log("req.file is defined")
    await listing.save(); 
    }

    if(typeof req.file==="undefined"){
        console.log("req.file is undefined");
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("/:id/delete After Logged In User information",req.user);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};