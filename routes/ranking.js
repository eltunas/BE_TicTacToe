const express = require("express");
const router = express.Router();
const dataUsers = require("../data_access/users");
const auth = require("../Middlewares/auth");

//router.use(async(req, res, next) => await auth.verifyToken(req, res, next));

router.get("/getRankOne", auth.verifyToken, async (req, res, next) => {
  try {
    const user = await dataUsers.getRankOne();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get("/", auth.verifyToken, async (req, res, next) => {
  console.log("fetching ranking");
  try {
    const users = await dataUsers.getRanking();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

module.exports = router;
