const connection = require("./mongo_connection");

async function getOnlineUsers() {
  const clientmongo = await connection.getConnection();
  const collection = await clientmongo
    .db("db_tic_tac_toe")
    .collection("OnlineUsers")
    .find()
    .toArray();
  return collection;
}

async function getOnlineUser(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("OnlineUsers")
    .findOne({ googleId: googleId.toString() });
  return user;
}

async function getOnlineUserBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("OnlineUsers")
    .findOne({ socketId: socketId.toString() });
  return user;
}

async function insertOnlineUser(onlineUser) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db("db_tic_tac_toe")
    .collection("OnlineUsers")
    .insertOne(onlineUser);
  return ops[0];
}

async function deleteOnlineUseBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db("db_tic_tac_toe")
    .collection("OnlineUsers")
    .deleteOne({ socketId: googleId });
}

module.exports = {
  getOnlineUsers,
  getOnlineUser,
  insertOnlineUser,
  deleteOnlineUseBySocketId,
  getOnlineUserBySocketId,
};
