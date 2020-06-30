const express = require("express");
const router = express.Router();
const queueUsers = require("../data_access/queueUsers");
const queueUserModel = require("../data_access/Models/queueUserModel");
const auth = require("../Middlewares/auth");

router.get("/", auth.verifyToken, async (req, res) => {
  try {
    const users = await queueUsers.getQueueUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", [auth.verifyToken, getDuplicateUser], async (req, res) => {
  let user;
  if (
    req.body.googleId == null ||
    req.body.name == null ||
    req.body.socketId == null
  ) {
    return res.status(400).json({ message: "Parametros incorrectos" });
  } else {
    user = new queueUserModel.QueueUser(
      req.body.googleId,
      req.body.name,
      req.body.socketId
    );
  }
  try {
    const newUser = await queueUsers.insertQueueUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDuplicateUser(req, res, next) {
  let user;
  try {
    user = await queueUsers.getQueueUser(req.body.googleId);
    return user != null ? res.status(200).json(user) : next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
