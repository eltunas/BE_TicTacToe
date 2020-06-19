const connection = require("./mongo_connection");

async function getQueueUsers() {
  const clientmongo = await connection.getConnection();
  const collection = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .find()
    .toArray();
  return collection;
}

async function getSingleQueueUser() {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .findOne();
  return user;
}

async function popQueueUser() {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .findAndModify({
      remove: true,
    })
    .limit(1);
  return user;
}

async function insertQueueUser(QueueUser) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .insertOne(QueueUser);
  return ops[0];
}

async function deleteQueueUserBySocketId(socketId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .deleteOne({ socketId: socketId });
}

module.exports = {
  getQueueUsers,
  insertQueueUser,
  deleteQueueUserBySocketId,
  getSingleQueueUser,
};
