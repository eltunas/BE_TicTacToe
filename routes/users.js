var express = require("express");
var router = express.Router();
const dataUsers = require("../data_access/users");
const userModel = require("../data_access/Models/UserModel");

router.get("/", async (req, res) => {
  try {
    const users = await dataUsers.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

router.post("/", async (req, res) => {
  const user = new userModel.User(req.body.googleId, req.body.name, req.body.createdDate);
  try {
    const newUser = await dataUsers.insertUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.delete("/:id", getUser, async (req, res) => {
  try {
    await dataUsers.deleteUser(res.user.googleId);
    res.status(200).json({ message: `Deleted user ${res.user.googleId}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.put("/updateWins/:id", getUser, async (req, res) => {
  try {
    await dataUsers.updateWins(res.user);
    res.json(res.user);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.put("/updateTies/:id", getUser, async (req, res) => {
  try {
    await dataUsers.updateTies(res.user);
    res.json(res.user);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.put("/updateLosses/:id", getUser, async (req, res) => {
  try {
    await dataUsers.updateLosses(res.user);
    res.json(res.user);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await dataUsers.getUser(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.user = user;
  next();
}

module.exports = router;
