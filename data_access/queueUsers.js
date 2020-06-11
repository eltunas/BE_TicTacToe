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

async function insertQueueUser(QueueUser) {
    const clientmongo = await connection.getConnection();
    const { ops } = await clientmongo
        .db("db_tic_tac_toe")
        .collection("Queue")
        .insertOne(QueueUser);
    return ops;
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
    insertQueueUser,
    deleteQueueUser,
};
