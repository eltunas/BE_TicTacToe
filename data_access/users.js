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
  const result = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .insertOne(user);
  return result;
}

async function deleteUser(googleId) {
  const clientmongo = await connection.getConnection();
  const result = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Users")
    .deleteOne({ googleId: googleId.toString() });
  return result;
}

module.exports = { getUsers, getUser, insertUser, deleteUser };
