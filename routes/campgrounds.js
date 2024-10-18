const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schema");

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

router.get("/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id).populate("reviews");
  res.json({ data: camp, message: "success", status: 200 });
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body);
    await camp.save();
    res.json({ data: camp, message: "success", status: 200 });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ data: camp, message: "success", status: 200 });
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    res.json({ message: "success", status: 200 });
  })
);

module.exports = router;
