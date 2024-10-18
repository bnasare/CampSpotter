const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

const campgroundRoutes = require("./routes/campgrounds");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
};

const validateCampground = validateSchema(campgroundSchema);
const validateReview = validateSchema(reviewSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use("/campgrounds", campgroundRoutes);

app.get("/", (req, res) => {
  res.send("Hello from yelpcamp!");
});

app.post(
  "/campgrounds/:id/reviews",
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

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: "success", status: 200 });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
