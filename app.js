if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express"); 
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); //Session
const MongoStore = require("connect-mongo");//mongostore
const flash=require("connect-flash"); //flash
const passport = require("passport"); //passport
const LocalStrategy = require("passport-local");//passport-local
const User = require("./models/user.js"); //User Schema 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 

const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connected to MongooDB Of Major Project");
})
.catch((err)=>{
    console.log("MongoDB Error",err);
});

async function main(){
    await mongoose.connect(dbUrl);
} 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//Ejs Mate
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

//session 
const sessionOptions = {
    store,  
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,  //One week time
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//Session and flash
app.use(session(sessionOptions));
app.use(flash());

//passport initialize for each session
app.use(passport.initialize());

//making our website if the user using diff pages of website dont need to ask permission(login) for each page login is needed once in a one complete session
app.use(passport.session());

//in passport.use new LocalStrategy whc v hv made to authentic each user use User schema and aunthenticate() method
//authenticate() it is a function whc generates a function that used in passport's localStrategy
passport.use(new LocalStrategy(User.authenticate()));

//serializeUser means storing information of user in session
passport.serializeUser(User.serializeUser());

//After complition session by user to remove the information from temporary storage we use deserializeUser()
passport.deserializeUser(User.deserializeUser());

//middle ware's 
app.use((req,res,next)=>{
    console.log("Locals Route Called");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; //navbar's currentUser
    console.log("Current User Is:",res.locals.currentUser);
    next();
}); 

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter); 

//it gets in play when any random route is searched which is not defined in our system
app.all("*",(req,res,next)=>{
    console.log("Invalid route searched");
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    console.log("ExpressError.js:",err); 
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

// const domain = process.env.DOMAIN || 'http://localhost:8080';

// // const port = process.env.PORT || 8080;
// app.listen(domain, ()=>{
//     console.log("Server is listening to port 8080");
// });

// const domain = process.env.DOMAIN || 'http://localhost:8080';
// const port = process.env.PORT || 8080;


// app.listen(port, ()=>{
//     console.log("Server is listening to port 8080");
// });

const domain = process.env.DOMAIN || 'http://localhost:8080';

// const port = process.env.PORT || 8080;
app.listen(domain, ()=>{
    console.log("Server is listening to port 8080");
});

// const domain = process.env.DOMAIN || 'http://localhost:8080';
const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log("Server is listening to port 8080");
});
