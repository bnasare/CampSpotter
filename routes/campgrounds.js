const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { campgroundSchema } = require("../schema");
const { isLoggedIn, isAuthor, validateSchema } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const validateCampground = validateSchema(campgroundSchema);

router.get("/", catchAsync(campgrounds.index));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
