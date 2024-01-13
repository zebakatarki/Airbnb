//isLoggedIn is a function name
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl);
    console.log(req.user);
    if(!req.isAuthenticated()){ //checking for logged in user
        req.session.redirectUrl = req.originalUrl; //redirectUrl is a variable which contains originalUrl
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

//if we directly want to access redirectUrl in login route it shows undefined bcz when clicked the login and middleware approved all authetication 
//login will reset the redirectUrl which are stored in session so we the local bcz passport dnt hv the any access to delete 
//that redirectUrl
//so we are storing the redirectUrl in locals
module.exports.saveRedirectUrl=(req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};