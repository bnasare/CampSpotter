const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("Hello from yelpcamp!");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.json({ data: campgrounds, message: "success", status: 200 });
});

app.get("/campgrounds/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.json({ data: camp, message: "success", status: 200 });
});

app.post("/campgrounds", async (req, res) => {
  const camp = new Campground(req.body);
  await camp.save();
  res.json({ data: camp, message: "success", status: 200 });
});

app.put("/campgrounds/:id", async (req, res) => {
  const camp = await Campground.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ data: camp, message: "success", status: 200 });
});

app.delete("/campgrounds/:id", async (req, res) => {
  const camp = await Campground.findByIdAndDelete(req.params.id);
  res.json({ data: camp, message: "success", status: 200 });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
