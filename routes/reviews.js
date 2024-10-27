const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor, validateSchema } = require("../middleware");
const reviews = require("../controllers/reviews");

const validateReview = validateSchema(reviewSchema);

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
