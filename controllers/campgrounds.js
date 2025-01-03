const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

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
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Campground.findByIdAndUpdate(id, {
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  const imagePromises = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const newImages = await Promise.all(imagePromises);
  const updatedCamp = await Campground.findByIdAndUpdate(
    id,
    { ...req.body, $push: { images: { $each: newImages } } },
    { new: true, runValidators: true }
  );
  res.json({ data: updatedCamp, message: "success", status: 200 });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  res.json({ data: deletedCamp, message: "success", status: 200 });
};
