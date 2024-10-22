const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { userSchema } = require("../schema");

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

const validateUser = validateSchema(userSchema);

router.post(
  "/register",
  validateUser,
  catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: registeredUser._id,
        username: registeredUser.username,
        email: registeredUser.email,
      },
    });
  })
);

module.exports = router;
