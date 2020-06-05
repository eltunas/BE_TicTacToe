const express = require("express");
const router = express.Router();
const dataUsers = require("../data_access/users");

router.get("/", async (req, res) => {
  const users = await dataUsers.getRanking().catch(error => {
    console.log(error);
  });
  res.status(200).send(users);
});

router.get("/getRankOne", async (req, res) => {
  const user = await dataUsers.getRankOne().catch(error => {
    console.log(error);
  });
  res.status(200).send(user);
});

module.exports = router;
