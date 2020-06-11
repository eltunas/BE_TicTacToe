const connection = require("./mongo_connection");

async function getQueueUsers() {
    const clientmongo = await connection.getConnection();
    const collection = await clientmongo
        .db("db_tic_tac_toe")
        .collection("QueueUsers")
        .find()
        .toArray();
    return collection;
}

async function getQueueUser(googleId) {
    const clientmongo = await connection.getConnection();
    const user = await clientmongo
        .db("db_tic_tac_toe")
        .collection("QueueUsers")
        .findOne({ googleId: googleId.toString() });
    return user;
}

async function insertQueueUser(QueueUser) {
    const clientmongo = await connection.getConnection();
    const { ops } = await clientmongo
        .db("db_tic_tac_toe")
        .collection("QueueUsers")
        .insertOne(QueueUser);
    return ops;
}

async function deleteQueueUser(googleId) {
    const clientmongo = await connection.getConnection();
    await clientmongo
        .db("db_tic_tac_toe")
        .collection("QueueUsers")
        .deleteOne({ googleId: googleId.toString() });
}


module.exports = {
    getQueueUsers,
    getQueueUser,
    insertQueueUser,
    deleteQueueUser,
};
