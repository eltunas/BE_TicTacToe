const express = require("express");
const router = express.Router();
const queueUsers = require("../data_access/queueUsers");
const queueUserModel = require("../data_access/Models/queueUserModel");

router.get("/", async (req, res) => {
  try {
    const users = await queueUsers.getQueueUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
