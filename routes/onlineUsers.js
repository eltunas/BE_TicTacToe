const express = require("express");
const router = express.Router();
const onlineUsers = require("../data_access/onlineUsers");
const onlineUserModel = require("../data_access/Models/onlineUserModel");
const auth = require("../Middlewares/auth");
const onlineUserMiddleware = require("../Middlewares/onlineUser");
const queueUsers = require("../data_access/queueUsers");

router.get("/", auth.verifyToken, async (req, res) => {
  try {
    const users = await onlineUsers.getOnlineUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  [auth.verifyToken, onlineUserMiddleware.getDuplicateUser],
  async (req, res) => {
    let user;
    if (req.body.googleId == null || req.body.name == null) {
      return res.status(400).json({ message: "cannot insert online user" });
    } else {
      user = new onlineUserModel.OnlineUser(req.body.googleId, req.body.name);
    }
    try {
      const newUser = await onlineUsers.insertOnlineUser(user);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.put(
  "/:id/refreshSocketId",
  [auth.verifyToken, onlineUserMiddleware.getOnlineUser],
  async (req, res) => {
    try {
      const updatedUser = await onlineUsers.refreshSocketId(
        req.params.id,
        req.body.socketId
      );
      await queueUsers.refreshSocketId(req.params.id, req.body.socketId);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
