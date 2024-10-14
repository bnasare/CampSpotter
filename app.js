const express = require("express");
const app = express();
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
