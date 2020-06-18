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

async function getQueueUser(googleId) {
  const clientmongo = await connection.getConnection();
  const user = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .findOne({ googleId: googleId.toString() });
  return user;
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
      remove: true  
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

async function deleteQueueUser(googleId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db("db_tic_tac_toe")
    .collection("Queue")
    .deleteOne({ googleId: googleId.toString() });
}

module.exports = {
  getQueueUsers,
  getQueueUser,
  insertQueueUser,
  deleteQueueUser,
  getSingleQueueUser
};
