const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { userSchema } = require("../schema");
const users = require("../controllers/users");
const { validateSchema } = require("../middleware");

const validateUser = validateSchema(userSchema);

router.post("/register", validateUser, catchAsync(users.register));

router.post("/login", users.login);

router.post("/logout", users.logout);

module.exports = router;
