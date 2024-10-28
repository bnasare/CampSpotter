const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");

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

  // Delete images if any are specified
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      // Remove the image from Cloudinary
      await cloudinary.uploader.destroy(filename);
    }

    // Remove image references from the campground's images array in the database
    await Campground.findByIdAndUpdate(id, {
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  // Process new images if any are uploaded
  const imagePromises = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const newImages = await Promise.all(imagePromises);

  // Find the campground and update it with req.body and new images
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
