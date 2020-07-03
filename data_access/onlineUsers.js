const connection = require("./mongo_connection");

async function getOnlineUsers() {
  const clientmongo = await connection.getConnection();
  const collection = await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .find()
    .toArray();
  return collection;
}

async function getOnlineUser(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .findOne({ googleId: googleId.toString() });
  return user;
}

async function getOnlineUserBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .findOne({ socketId: socketId.toString() });
  return user;
}

async function insertOnlineUser(onlineUser) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .insertOne(onlineUser);
  return ops[0];
}

async function deleteOnlineUserBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .deleteOne({ socketId: socketId });
}

async function refreshSocketId(googleId, socketId) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const newValues = { $set: { socketId: socketId.toString() } };
  const options = { returnOriginal: false };
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("OnlineUsers")
    .findOneAndUpdate(query, newValues, options);
}

module.exports = {
  getOnlineUsers,
  getOnlineUser,
  insertOnlineUser,
  deleteOnlineUserBySocketId,
  getOnlineUserBySocketId,
  refreshSocketId,
};
