const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get all messages
router.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = router;
