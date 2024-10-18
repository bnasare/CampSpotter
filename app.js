const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Middleware
app.use(express.json());

// Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Hello from yelpcamp!");
});

// Error handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
