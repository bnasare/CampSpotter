const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const { isLoggedIn, isAuthor, validateSchema } = require("../middleware");

const validateReview = validateSchema(reviewSchema);

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.json({ data: camp, message: "success", status: 200 });
  })
);

// router.post(
//   "/",
//   validateReview,
//   catchAsync(async (req, res) => {
//     const camp = await Campground.findById(req.params.id);

//     if (!camp) {
//       throw new ExpressError("Campground not found", 404);
//     }

//     const review = new Review(req.body);
//     camp.reviews.push(review);
//     await camp.save();
//     await review.save();
//     res.json({ data: camp, message: "success", status: 200 });
//   })
// );

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: "success", status: 200 });
  })
);

module.exports = router;
