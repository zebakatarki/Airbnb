const express=require("express");
const router  = express.Router();
const User = require("../models/user.js"); //model
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

//only wth wrapAsync if we get user is already wala error than it is displaying "A user with the given
//username is already registered" Error not in the form of flash to make it flash we use try catch
router.post("/signup",wrapAsync(async(req,res)=>{ 
    try{
    let{username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post(
"/login",
passport.authenticate("local",{
failureRedirect:"/login", failureFlash:true //flash message is handled by passport itself
})
,async(req,res)=>{ //this only get executed when above things are passed if fail we directly redirected to the login page with flash message 
    // res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect("/listings");
})

module.exports = router;