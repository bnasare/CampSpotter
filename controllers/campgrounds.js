const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.json({ data: campgrounds, message: "success", status: 200 });
};

module.exports.createCampground = async (req, res) => {
  const imagePromises = req.files.map(async (file) => ({
    url: file.path,
    filename: file.filename,
  }));
  req.body.images = await Promise.all(imagePromises);
  const camp = new Campground(req.body);
  camp.author = req.user._id;
  await camp.save();
  res.json({ data: camp, message: "success", status: 200 });
};

module.exports.showCampground = async (req, res) => {
  const camp = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  res.json({ data: camp, message: "success", status: 200 });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const updatedCamp = await Campground.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ data: updatedCamp, message: "success", status: 200 });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  res.json({ data: deletedCamp, message: "success", status: 200 });
};
