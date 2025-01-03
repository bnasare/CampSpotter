// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "thissession";

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Create a session store using connect-mongo
const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

// Error handling for the session store
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

// Session configuration
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Middleware
app.use(express.json());
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home route
app.get("/", (req, res) => {
  res.send("Hello from yelpcamp!");
});

// Routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Error handling for 404 Not Found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
});

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
