const express=require("express");
const app=express();

//Required the user.js to use from here
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

//Require Cookie Parser Pakage
// const cookieParser = require("cookie-parser");
// //To use cookie parser
// app.use(cookieParser("secretcode")); //("secretcode") without thing every route of cookies will only get loading

//Express Session
const session = require("express-session");

//connect flash
const flash = require("connect-flash");
//using path
const path = require("path");
//to display flash
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//To use Express Session
// "resave: false" bcz to solve this warning "Tue, 09 Jan 2024 14:40:20 GMT express-session deprecated undefined resave option;
//provide resave option at server.js:16:9"

//"saveUninitialized:true" to solve this warning "Tue, 09 Jan 2024 14:40:20 GMT express-session deprecated undefined 
//saveUninitialized option; provide saveUninitialized option at server.js:16:9"
// app.use(
//     session({
//         secret: "mysupersecretstring",
//         resave: false, 
//         saveUninitialized:true
//      })
// ); 
// OR 
const sessionOptions = { 
    secret: "mysupersecretstring",
    resave: false, 
    saveUninitialized:true,
};
app.use(session(sessionOptions));
//connect-flash
app.use(flash());

//Storing session information
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    console.log(req.session); //Session Object = Session {cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }}
    //Adding new name object to the session object
    if(name == "anonymous"){
        req.flash("error","user is not registered!");
    }else{
        req.flash("success","user registered successfully!");
    }
    req.session.name=name;
    console.log(req.session.name);
    // res.send(name);*                                                                                                                                                                                      
    //crating message flash (key and message)
    res.redirect("/hello");
});

//Accessing the session information using req.session
app.get("/hello",(req,res)=>{
    // res.send(`Hello ${req.session.name}`); //Hello farhan
    // console.log(req.flash("success")); //[ 'user registered successfully!' ]

    // res.render("page.ejs",{ name:req.session.name, msg:req.flash("success") });
    //OR

    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    res.render("page.ejs",{name : req.session.name});
});

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;//if the value is existed
//     }else{
//         req.session.count = 1; //if the value is not existed initialize it 
//     }
    
//     res.send(`You send a request ${req.session.count} times`);
// });

// app.get("/reqcounts",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;//if the value is existed
//     }else{
//         req.session.count = 1; //if the value is not existed initialize it 
//     }
    
//     res.send(`You send a request ${req.session.count} times`);
// });

// app.get("/",(req,res)=>{
//     res.send("Hii I'm Server.js");
// });

// // Cookies
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("Madein","India");
//     res.cookie("greet","Asslam Walikum");
//     res.send("Sent you some cookies!!");
// })

// app.get("/extracting",(req,res)=>{
//     console.log(req.cookies); //without 9 and 10th line it shows Undefined 
// })

// app.get("/extractingbyusingparse",(req,res)=>{
//     res.send(req.cookies); //after using 9 and 12th line o/p ll be {"Madein":"India","name":"zeba","greet":"Asslam Walikum"}
// })

// app.get("/notadded",(req,res)=>{
//     let {surname = "Katarki"} = req.cookies; // this will  surname = "Katarki"  not displayed on application util and unless we added it manually or by usring res.cookies();
//     res.send(`Hiii ${surname}`);
// })

// //Now we can tampared(Changes) any cookie manually or by using res.cookie(); to prevent our cookies from tampering or check the changes 
// //whether cookies are get tampared or not we make our cookies signed with 2 steps 
// //Signed
// //Verify = is the cookie which v signed is showing results or not 


// //Signed cookie
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("City2","Hubli",{signed:true}); //1st step ,{signed:true} 
//     res.send("Signed Cookie Send");
// })

// //Verifying Signed Cookie
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies); //Shows all unsigned cookies for signed cookies it shows {}
//     console.log(req.signedCookies); //Shows all signed cookies full replace = {} , short area changed {name : false}                       
//     res.send("verified");
// });


// // //To use the user.js
// // //Here v r telling that the requests whc has this "/users" path that also in users of 5th line or in users module
// // //that should get executed
// app.use("/users",users);

// // //Here v r telling that the requests whc has this "/posts" path that also in posts of 6th line or in posts module
// // //that should get executed
// app.use("/posts",posts);

// // //User
// // app.get("/users",(req,res)=>{
// //     res.send("User Route");
// // })

// // app.get("/users/:id",(req,res)=>{ 
// //     res.send("Get for show users");
// // })

// // app.post("/users",(req,res)=>{
// //     res.send("Post for users");
// // })

// // app.delete("/users/:id",(req,res)=>{
// //     res.send("Delete for user id");
// // })

// // //POST
// // app.get("/posts",(req,res)=>{
// //     res.send("Post Route");
// // })

// // app.get("/posts/:id",(req,res)=>{
// //     res.send("Get for show Posts");
// // })

// // app.post("/posts",(req,res)=>{
// //     res.send("Post for Posts");
// // })

// // app.delete("/posts/:id",(req,res)=>{
// //     res.send("Delete for Post id"); 
// // })



app.listen(3000, ()=>{
    console.log("Server is listening to port 3000");
});