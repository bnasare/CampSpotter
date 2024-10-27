const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { userSchema } = require("../schema");
const users = require("../controllers/users");
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

router.post("/register", validateUser, catchAsync(users.register));

router.post("/login", users.login);

router.post("/logout", users.logout);

module.exports = router;
