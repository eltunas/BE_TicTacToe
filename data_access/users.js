const connection = require("./mongo_connection");

async function getUsers() {
  const clientmongo = await connection.getConnection();
  const collection = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .find()
    .toArray();
  return collection;
}

async function getUser(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .findOne({ googleId: googleId.toString() });
  return user;
}

async function insertUser(user) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .insertOne(user);
  return ops;
}

async function deleteUser(googleId) {
  const clientmongo = await connection.getConnection();
  const result = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .deleteOne({ googleId: googleId.toString() });
  return result;
}

async function updateWins(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .findOne({ googleId: googleId.toString() });
  const newValues = { $set: { wins: (user.wins += 1) } };
  await updateUser(user, newValues, clientmongo);
}

async function updateTies(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .findOne({ googleId: googleId.toString() });
  const newValues = { $set: { ties: (user.ties += 1) } };
  await updateUser(user, newValues, clientmongo);
}

async function updateLosses(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .findOne({ googleId: googleId.toString() });
  const newValues = { $set: { losses: (user.losses += 1) } };
  await updateUser(user, newValues, clientmongo);
}

async function updateUser(user, newValues, clientmongo) {
  const query = { googleId: user.googleId.toString() };
  await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .updateOne(query, newValues);
}

async function getRanking() {
  const clientmongo = await connection.getConnection();
  const sortOptions = { wins: -1, ties: -1, losses: 1 };
  const collection = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .find()
    .sort(sortOptions)
    .toArray();
  return collection;
}

async function getRankOne() {
  const clientmongo = await connection.getConnection();
  const sortOptions = { wins: -1, ties: -1, losses: 1 };
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .find()
    .sort(sortOptions)
    .limit(1)
    .toArray();
  console.log(user);
  return user;
}

module.exports = {
  getUsers,
  getUser,
  insertUser,
  deleteUser,
  updateWins,
  updateTies,
  updateLosses,
  getRanking,
  getRankOne,
};
