const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("Hello from yelpcamp!");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json({ data: campgrounds, message: "success", status: 200 });
  })
);

app.get("/campgrounds/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.json({ data: camp, message: "success", status: 200 });
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body);
    await camp.save();
    res.json({ data: camp, message: "success", status: 200 });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ data: camp, message: "success", status: 200 });
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    res.json({ data: camp, message: "success", status: 200 });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
