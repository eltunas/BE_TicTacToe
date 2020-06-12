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

router.get("/:id", getQueueUser, (req, res) => {
  res.json(res.user);
});

router.post("/", async (req, res) => {
  let user;
  if (
    req.body.googleId == null ||
    req.body.name == null ||
    req.body.socket == null
  ) {
    return res.status(400).json({ message: "Parametros incorrectos" });
  } else {
    user = new queueUserModel.QueueUser(
      req.body.googleId,
      req.body.name,
      req.body.socket
    );
  }
  try {
    const newUser = await queueUsers.insertQueueUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", getQueueUser, async (req, res) => {
  try {
    await queueUsers.deleteQueueUser(res.user.googleId);
    res.status(200).json({ message: `Deleted user ${res.user.googleId}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getQueueUser(req, res, next) {
  let user;
  try {
    user = await queueUsers.getQueueUser(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find queue user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
