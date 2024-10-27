const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const review = new Review(req.body);
  review.author = req.user._id;
  const campground = await Campground.findById(req.params.id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.json({ data: review, message: "success", status: 200 });
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  const camp = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  res.json({ data: deletedReview, message: "success", status: 200 });
};
