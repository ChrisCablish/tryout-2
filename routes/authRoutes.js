const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const router = express.Router();
const db = require("../models/index");

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

router.get("/login-success", (req, res) => {
  res.render("login-success");
});

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate a salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing password." });
        }

        // Combine the salt and the hashed password
        const combinedHash = salt + hashedPassword.toString("hex");
        console.log("Storing combined hash:", combinedHash);

        // Save the user with the combined hash
        try {
          const newUser = await db.User.create({
            email,
            password: combinedHash,
            firstName,
            lastName,
          });
          res.status(200).json({ message: "User created successfully." });
        } catch (err) {
          res.status(500).json({ message: "Error creating user." });
        }
      }
    );
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
    successRedirect: "/auth/login-success",
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
