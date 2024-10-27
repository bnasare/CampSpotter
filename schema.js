const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(1),
  location: Joi.string().required(),
  images: Joi.array(),
  description: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
