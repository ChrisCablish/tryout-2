const createUser = (email, password, firstName, lastName, req, res) => {
  const crypto = require("crypto");
  const db = require("../models/index");

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
};

module.exports = createUser;
