const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schema");
const { isLoggedIn, isAuthor, validateSchema } = require("../middleware");

const validateCampground = validateSchema(campgroundSchema);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json({ data: campgrounds, message: "success", status: 200 });
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    res.json({ data: camp, message: "success", status: 200 });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body);
    camp.author = req.user._id;
    await camp.save();
    res.json({ data: camp, message: "success", status: 200 });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ data: updatedCamp, message: "success", status: 200 });
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.json({ message: "success", status: 200 });
  })
);

module.exports = router;
