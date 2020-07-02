const connection = require("./mongo_connection");

async function getUser(googleId) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const projection = { token: 0 };
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOne(query)
    .project(projection);
  return user;
}

async function getUserByToken(token) {
  const clientmongo = await connection.getConnection();
  const query = { token: token.toString() };
  const projection = { token: 0 };
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOne(query, options)
    .project(projection);
  return user;
}

async function refreshToken(googleId, token) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const newValues = { $set: { token: token.toString() } };
  const options = { returnOriginal: false };
  const projection = { token: 0 };
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOneAndUpdate(query, newValues, options)
    .project(projection);
  return value;
}

async function insertUser(user) {
  const clientmongo = await connection.getConnection();
  const projection = { token: 0 };
  const { ops } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .insertOne(user)
    .project(projection);
  return ops[0];
}

async function updateWins(googleId) {
  const newValues = { $inc: { wins: 1 } };
  const user = await updateUser(googleId, newValues);
  return user;
}

async function updateTies(googleId) {
  const newValues = { $inc: { ties: 1 } };
  const user = await updateUser(googleId, newValues);
  return user;
}

async function updateLosses(googleId) {
  const newValues = { $inc: { losses: 1 } };
  const user = await updateUser(googleId, newValues);
  return user;
}

async function updateUser(googleId, newValues) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const options = { returnOriginal: false };
  const projection = { token: 0 };
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOneAndUpdate(query, newValues, options)
    .project(projection);
  return value;
}

async function getRanking() {
  const clientmongo = await connection.getConnection();
  const sortOptions = { wins: -1, ties: -1, losses: 1 };
  const projection = { token: 0 };
  const collection = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .find()
    .project(projection)
    .sort(sortOptions)
    .toArray();
  return collection;
}

async function getRankOne() {
  const clientmongo = await connection.getConnection();
  const sortOptions = { wins: -1, ties: -1, losses: 1 };
  const projection = { token: 0 };
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .find()
    .project(projection)
    .sort(sortOptions)
    .limit(1)
    .toArray();
  return user;
}

module.exports = {
  getUser,
  insertUser,
  updateWins,
  updateTies,
  updateLosses,
  getRanking,
  getRankOne,
  getUserByToken,
  refreshToken,
};
