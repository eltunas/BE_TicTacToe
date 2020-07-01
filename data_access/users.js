const connection = require("./mongo_connection");

async function getUser(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOne({ googleId: googleId.toString() });
  return user;
}

async function getUserByToken(token) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOne({ token: token.toString() });
  return user;
}

async function refreshToken(googleId, token) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const newValues = { $set: { token: token.toString() } };
  const options = { returnOriginal: false };
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOneAndUpdate(query, newValues, options);
  return value;
}

async function insertUser(user) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .insertOne(user);
  return ops[0];
}

// async function updateRoom(room, { socketId, square }) {
//   const clientmongo = await connection.getConnection();
//   const query = { id: room.id };
//   room.boardState[square] = room.nextToMove;
//   const newValues = {
//     $set: {
//       nextToMove: room.nextToMove === "X" ? "O" : "X",
//       boardState: room.boardState,
//       moves: room.moves + 1,
//     },
//   };
//   const options = { returnOriginal: false };
//   const { value } = await clientmongo
//     .db(process.env.DATABASE)
//     .collection("Rooms")
//     .findOneAndUpdate(query, newValues, options);
//   return value;
// }

async function updateWins(googleId) {
  const newValues = { $inc: { wins: 1 } };
  await updateUser(googleId, newValues);
}

async function updateTies(googleId) {
  const newValues = { $inc: { ties: 1 } };
  await updateUser(googleId, newValues);
}

async function updateLosses(googleId) {
  const newValues = { $inc: { losses: 1 } };
  await updateUser(googleId, newValues);
}

async function updateUser(googleId, newValues) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  await clientmongo
    .db(process.env.DATABASE)
    .collection("Users")
    .findOneAndUpdate(query, newValues);
}

async function getRanking() {
  const clientmongo = await connection.getConnection();
  const sortOptions = { wins: -1, ties: -1, losses: 1 };
  const collection = await clientmongo
    .db(process.env.DATABASE)
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
    .db(process.env.DATABASE)
    .collection("Users")
    .find()
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
