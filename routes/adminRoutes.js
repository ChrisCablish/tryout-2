const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);

router.get("/create-group", (req, res) => {
  res.render("create-group");
});

router.post("/create-group", async (req, res) => {
  //   try {
  //       const newUser = await db.User.create({
  //         email,
  //         password: combinedHash,
  //         firstName,
  //         lastName,
  //       });
  //       if (!autoPop) {
  //         res.status(200).json({ message: "User created successfully." });
  //       }
  //     } catch (err) {
  //       if (!autoPop) {
  //         res.status(500).json({ message: "Error creating user." });
  //       }
  //     }

  // use nanoid to generate unique 7 digit public id's when necessary
  // const { customAlphabet } = require('nanoid');
  // const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

  // // When creating a group
  // const newGroup = await Group.create({
  //   name: "New Ensemble",
  //   publicGroupId: nanoid()  // Generates something like "5H7R12Z"
  // });

  try {
    const groupName = req.body.groupName;
    const newGroup = await db.Group.create({
      name: groupName,
      publicGroupId: nanoid(),
    });
    res.status(200);
  } catch (err) {
    res.status(500);
    console.log(err);
  }
});

module.exports = router;
