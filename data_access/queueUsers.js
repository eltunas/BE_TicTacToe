const connection = require("./mongo_connection");

async function getQueueUsers() {
  const clientmongo = await connection.getConnection();
  const collection = await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .find()
    .toArray();
  return collection;
}

async function popQueueUser() {
  const clientmongo = await connection.getConnection();
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .findOneAndDelete({});
  return value;
}

async function insertQueueUser(QueueUser) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .insertOne(QueueUser);
  return ops[0];
}

async function deleteQueueUserBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .deleteOne({ socketId: socketId });
}

async function refreshSocketId(googleId, socketId) {
  const clientmongo = await connection.getConnection();
  const query = { googleId: googleId.toString() };
  const newValues = { $set: { socketId: socketId.toString() } };
  await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .updateOne(query, newValues);
}

module.exports = {
  getQueueUsers,
  insertQueueUser,
  deleteQueueUserBySocketId,
  popQueueUser,
  refreshSocketId,
};
