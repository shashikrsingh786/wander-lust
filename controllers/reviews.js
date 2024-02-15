const Reviews = require('../models/review.js');
const Listing = require('../models/listings.js');


module.exports.createReview = async (req, res) => {
  let review = new Reviews(req.body.review);
  review.author = req.user;

  // Save the review to the database
  await review.save();

  // Get the listing ID from the route parameters
  let listId = req.params.id;

  // Find the listing by ID and populate its reviews
  let list = await Listing.findById(listId).populate("reviews");

  // Add the new review to the listing's reviews array
  list.reviews.push(review);
  

  // Save the updated listing with the new review
  await list.save();

  // Redirect to the listing page after the review has been added
  res.redirect(`/listings/${listId}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }; 