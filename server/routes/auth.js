const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

console.log("Auth.js loaded, ADMIN_PASS:", process.env.ADMIN_PASS);
const ADMIN_PASS = String(process.env.ADMIN_PASS);

// Signup
router.post("/signup", async (req, res) => {
  const { username, password, adminPassword } = req.body;
  if (String(adminPassword) !== ADMIN_PASS) {
    console.log("Admin password mismatch:", String(adminPassword), "vs", ADMIN_PASS);
    return res.status(401).json({ message: "Admin password wrong" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "Signup successful", username });
  } catch (err) {
    res.status(400).json({ message: "Username already exists" });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  res.json({ message: "Signin successful", username });
});

module.exports = router;
