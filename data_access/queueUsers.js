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

async function getSingleQueueUser() {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db(process.env.DATABASE)
    .collection("Queue")
    .findOne();
  return user;
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

module.exports = {
  getQueueUsers,
  insertQueueUser,
  deleteQueueUserBySocketId,
  getSingleQueueUser,
  popQueueUser,
};
