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

async function insertOnlineUser(onlineUser) {
    const clientmongo = await connection.getConnection();
    const { ops } = await clientmongo
        .db("db_tic_tac_toe")
        .collection("OnlineUsers")
        .insertOne(onlineUser);
    return ops;
}

async function deleteOnlineUser(googleId) {
    const clientmongo = await connection.getConnection();
    await clientmongo
        .db("db_tic_tac_toe")
        .collection("OnlineUsers")
        .deleteOne({ googleId: googleId.toString() });
}


module.exports = {
    getOnlineUsers,
    getOnlineUser,
    insertOnlineUser,
    deleteOnlineUser,
};
