const express=require("express");
const router  = express.Router();
const User = require("../models/user.js"); //model
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js"); //controller

router.route("/signup")
.get((userController.renderSignupForm)) //Render Signup form
.post(wrapAsync(userController.signup));

router.route("/login")
.get((userController.renderLoginForm)) //Render Login form
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),userController.logIn);

router.get("/logout",(userController.logout));
module.exports = router;
