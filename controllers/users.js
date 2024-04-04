const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    console.log("Rendering signup form to user");
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{ 
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
        req.flash("success","Welcome to Destination-Explorer!");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    console.log("Login form to signup user");
    res.render("users/login.ejs");
}

module.exports.logIn=async(req,res)=>{ 
    req.flash("success","Welcome back to Destination-Explorer!");
    console.log("Logged In manually");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = async(req,res)=>{
    console.log("LogOut User",req.user);
    req.logOut((err)=>{
        if(err){   
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    })
}