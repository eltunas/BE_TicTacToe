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

router.post("/", getDuplicateUser, async (req, res) => {
  let user;
  if (
    req.body.googleId == null ||
    req.body.name == null ||
    req.body.socketId == null
  ) {
    return res.status(400).json({ message: "Parametros incorrectos" });
  } else {
    user = new onlineUserModel.OnlineUser(
      req.body.googleId,
      req.body.name,
      req.body.socketId
    );
  }
  try {
    const newUser = await onlineUsers.insertOnlineUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDuplicateUser(req, res, next) {
  let user;
  try {
    user = await onlineUsers.getOnlineUser(req.body.googleId);
    return user != null ? res.status(200).json(user) : next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
