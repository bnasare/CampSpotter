const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new ExpressError("You are not authenticated", 401);
  }
  next();
};
