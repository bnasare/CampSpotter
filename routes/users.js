const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { userSchema } = require("../schema");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");

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
  catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(
          new ExpressError("Failed to log in after registration", 500)
        );
      }
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  })
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(new ExpressError("An error occurred during login", 500));
    }
    if (!user) {
      return next(new ExpressError("Invalid email or password", 401));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(new ExpressError("Failed to log in user", 500));
      }
      return res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(new ExpressError("An error occurred during logout", 500));
    }
    res.status(200).json({ message: "User logged out successfully" });
  });
});

module.exports = router;
