const express = require("express");
const router = express.Router();
const db = require("../models/index");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await db.User.findOne({ where: { email: email } });

  try {
    if (existingUser) {
      return res.status(409).send("Email already exists.");
    }

    const newUser = await db.User.create({
      email,
      password,
      firstName,
      lastName,
    });

    res
      .status(201)
      .send(`User ${firstName} ${lastName} was created successfully.`);
  } catch (error) {
    console.error("Singup Error:", error);
    res.status(500).send("Error signing up user.");
  }
});
module.exports = router;
