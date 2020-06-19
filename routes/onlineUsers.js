const express = require("express");
const router = express.Router();
const onlineUsers = require("../data_access/onlineUsers");
const onlineUserModel = require("../data_access/Models/onlineUserModel");

router.get("/", async (req, res) => {
  try {
    const users = await onlineUsers.getOnlineUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
