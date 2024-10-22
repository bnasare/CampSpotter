const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");

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
      .populate("reviews")
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
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
      throw new ExpressError("You are not allowed to do that", 400);
    }
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
      throw new ExpressError("You are not allowed to do that", 400);
    }
    await Campground.findByIdAndDelete(id);
    res.json({ message: "success", status: 200 });
  })
);

module.exports = router;
