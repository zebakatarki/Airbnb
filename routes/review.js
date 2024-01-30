const express=require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedInReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.get("/",isLoggedInReview,(reviewController.createReview));
router.post("/",isLoggedInReview,validateReview, wrapAsync(reviewController.createdReview));
router.delete("/:reviewId", isLoggedInReview,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;