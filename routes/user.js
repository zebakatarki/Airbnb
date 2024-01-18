const express=require("express");
const router  = express.Router();
const User = require("../models/user.js"); //model
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    console.log("Rendering signup form to user");
    res.render("users/signup.ejs");
});

//only wth wrapAsync if we get user is already wala error than it is displaying "A user with the given
//username is already registered" Error not in the form of flash to make it flash we use try catch
router.post("/signup",wrapAsync(async(req,res)=>{ 
    try{
    let{username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log("User is signup successfully",registeredUser);  //User is stored in dbsuccessfully

    req.login(registeredUser,(err)=>{ //Automatically login to current registered user
        if(err){
            return next(err);
        }
        console.log("User directly loggedIn");
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

//Login Routes
router.get("/login",(req,res)=>{
    console.log("Login form to signup user");
    res.render("users/login.ejs");
});

//3rd now our saveRedirectUrl ll stores the url then ll login wth passport than from req.session 
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true})//flash message is handled by passport itself
,async(req,res)=>{ //this only get executed when above things are passed if fail we directly redirected to the login page with flash message  
    // res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success","Welcome back to Wanderlust!");
    console.log("Logged In manually");

    //1st
    //res.redirect(req.session.redirectUrl);
    //it will not work bcz mw stores extra infor in it example redirectUrl so when post mw give the success like user 
    //is present in database msg then the /login will delete the extra information of session so when we try to access 
    //it ll be undefined so we store the value of redirectUrl in locals it is accessable for every where and passport 
    //also dont hv any access to delete the the locals so to store redirectUrl we make mw cld saveRedirectUrl in mw.js
    
    //4th res.redirect(res.locals.redirectUrl); now ll see flaw from directly using login button shows page not found bcz
    //here v hv not defined anything or call isLoggedIn function 

    //if in redirectUrl res.locals.redirectUrl is present then redirect redirectUrl else redirect  "/listings"
    // || "/listings";
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
);

router.get("/logout",async(req,res)=>{
    console.log("LogOut User",req.user);
    req.logOut((err)=>{
        if(err){   
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    })
})

module.exports = router;