const express = require("express");
const router = express.Router();
const dataUsers = require("../data_access/users");
const userModel = require("../data_access/Models/userModel");
const auth = require("../Middlewares/auth");

router.post("/", getDuplicateUser, async (req, res) => {
  let user;
  if (
    req.body.googleId == null ||
    req.body.name == null ||
    req.body.createdDate == null
  ) {
    return res.status(400).json({ message: "Parametros incorrectos" });
  } else {
    user = new userModel.User(
      req.body.googleId,
      req.body.name,
      req.body.createdDate
    );
  }
  try {
    const newUser = await dataUsers.insertUser(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/refreshToken", async (req, res) => {
  try {
    let { token } = req.body;
    if (token == null || token == "") {
      return res.status(401).json({ message: "Unauthorized!" });
    } else {
      const updatedUser = await dataUsers.refreshToken(req.params.id, token);
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/updateWins", [auth.verifyToken, getUser], async (req, res) => {
  try {
    const updatedUser = await dataUsers.updateWins(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/updateTies", [auth.verifyToken, getUser], async (req, res) => {
  try {
    const updatedUser = await dataUsers.updateTies(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put(
  "/:id/updateLosses",
  [auth.verifyToken, getUser],
  async (req, res) => {
    try {
      const updatedUser = await dataUsers.updateLosses(req.params.id);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getUser(req, res, next) {
  let user;
  try {
    user = await dataUsers.getUser(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

async function getDuplicateUser(req, res, next) {
  let user;
  try {
    user = await dataUsers.getUser(req.body.googleId);
    return user != null ? res.status(200).json(user) : next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
