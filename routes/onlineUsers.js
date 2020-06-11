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

router.get("/:id", getOnlineUser, (req, res) => {
  res.json(res.user);
});

router.post("/", async (req, res) => {
  let user;
  if (req.body.googleId == null || req.body.name == null) {
    return res.status(400).json({ message: "Parametros incorrectos" });
  } else {
    user = new onlineUserModel.OnlineUser(req.body.googleId, req.body.name);
  }
  try {
    const newUser = await onlineUsers.insertOnlineUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", getOnlineUser, async (req, res) => {
  try {
    await onlineUsers.deleteOnlineUser(res.user.googleId);
    res.status(200).json({ message: `Deleted user ${res.user.googleId}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOnlineUser(req, res, next) {
  let user;
  try {
    user = await onlineUsers.getOnlineUser(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find online user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
