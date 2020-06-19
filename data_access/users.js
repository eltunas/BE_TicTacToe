const connection = require("./mongo_connection");

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
  return ops[0];
}

async function updateWins(user) {
  const newValues = { $set: { wins: (user.wins += 1) } };
  await updateUser(user, newValues);
}

async function updateTies(user) {
  const newValues = { $set: { ties: (user.ties += 1) } };
  await updateUser(user, newValues);
}

async function updateLosses(user) {
  const newValues = { $set: { losses: (user.losses += 1) } };
  await updateUser(user, newValues);
}

async function updateUser(user, newValues) {
  const clientmongo = await connection.getConnection();
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
