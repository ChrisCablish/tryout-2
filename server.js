require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./models/index");
const session = require("express-session");
const sequelize = require("./config/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

app.set("view engine", "ejs");

app.set("views", "views");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

db.sequelize.sync({ force: true });

module.exports = app;
