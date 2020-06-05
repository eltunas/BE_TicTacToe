var express = require("express");
var router = express.Router();
var redisConn = require("../data_access/redis_connection");
const dataUsers = require("../data_access/users");
const userModel = require("../data_access/Models/UserModel");

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   let redis = redisConn.getRedisClient();
//   redis.set("some-value", 1);
//   res.send('respond with a resource');
// });

router.get("/", async (req, res, next) => {
  const users = await dataUsers.getUsers().catch(error => {
    console.log(error);
  });
  res.status(200).send(users);
});

router.get("/:id", async (req, res) => {
  let user = await dataUsers.getUser(req.params.id);
  const statusCode = user === null ? 404 : 200;
  const answerResult =
    user === null ? JSON.stringify("El usuario no existe") : user;
  res.status(200).send(answerResult);
});

router.post("/", async (req, res) => {
  const user = new userModel.User(
    req.body.googleId,
    req.body.name,
    req.body.createdDate
  );

  let result = await dataUsers.insertUser(user).catch(error => {
    console.log(error);
  });

  res.status(201).send(result);
});

router.delete("/:id", async (req, res) => {
  let result = await dataUsers.deleteUser(req.params.id).catch(error => {
    console.log(error);
  });
  const statusCode = result.deletedCount === 0 ? 404 : 200;
  const answerResult =
    result.deletedCount === 0
      ? JSON.stringify("El usuario no existe")
      : JSON.stringify(`El usuario ${req.params.id} se borro correctamente`);
  res.status(statusCode).send(answerResult);
});

router.put("/updateWins/:id", async (req, res) => {
  await dataUsers.updateWins(req.params.id).catch(error => {
    console.log(error);
  });
  res.status(200).send(JSON.stringify("updated"));
});

router.put("/updateTies/:id", async (req, res) => {
  await dataUsers.updateTies(req.params.id).catch(error => {
    console.log(error);
  });
  res.status(200).send(JSON.stringify("updated"));
});

router.put("/updateLosses/:id", async (req, res) => {
  await dataUsers.updateLosses(req.params.id).catch(error => {
    console.log(error);
  });
  res.status(200).send(JSON.stringify("updated"));
});

module.exports = router;
