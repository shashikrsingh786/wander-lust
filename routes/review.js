const express = require("express");
const router = express.Router({mergeParams:true});
const Reviews = require("../models/review.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {validateReviews, isLoggedIn,isReviewAuthor} = require('../middleware.js');
const Listing = require("../models/listings.js");
const { createReview,destroyReview } = require('../controllers/reviews.js');





// submitting the review
router.post(
  "/", // Assuming you are expecting a listing ID as a route parameter
  isLoggedIn,
 validateReviews,
  wrapAsync(createReview)
);


// deleting  the review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,

  wrapAsync(destroyReview)
);

module.exports = router;
