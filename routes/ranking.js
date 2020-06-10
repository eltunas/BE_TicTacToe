const express = require("express");
const router = express.Router();
const dataUsers = require("../data_access/users");

router.get("/getRankOne", async (req, res) => {
  try {
    const user = await dataUsers.getRankOne();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await dataUsers.getRanking();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

module.exports = router;
