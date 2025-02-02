const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const router = express.Router();
const db = require("../models/index");
const createUser = require("../util/createUser");

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser((id, done) => {
  db.User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

// Define local authentication strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    email,
    password,
    done
  ) {
    console.log("LocalStrategy invoked");
    db.User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Extract the salt from the stored hash
        const storedHash = user.password;
        const salt = storedHash.slice(0, 32); // Assuming the salt is 16 bytes (32 hex characters)
        const hash = storedHash.slice(32);

        // Hash the password with the extracted salt
        crypto.pbkdf2(
          password,
          salt,
          310000,
          32,
          "sha256",
          (err, hashedPassword) => {
            if (err) {
              return done(err);
            }
            if (
              !crypto.timingSafeEqual(Buffer.from(hash, "hex"), hashedPassword)
            ) {
              console.log("Password mismatch");
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }
            console.log("Authentication successful");
            return done(null, user);
          }
        );
      })
      .catch((err) => {
        console.log("Error in database query", err);
        return done(err);
      });
  })
);

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/login-failed", (req, res) => {
  res.render("login-failed");
});

router.get("/create-join", (req, res) => {
  if (req.user && req.user.firstName) {
    res.render("create-join", { firstName: req.user.firstName });
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    createUser(email, password, firstName, lastName, res, false);
  } catch (err) {
    res.status(500).json({ message: "Error creating user." });
  }
});

router.post(
  "/login",
  (req, res, next) => {
    console.log("Login route invoked");
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/auth/create-join",
    failureRedirect: "/auth/login-failed",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
