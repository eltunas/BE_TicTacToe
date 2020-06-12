const connection = require("./mongo_connection");

async function getRoomByPlayerId(playerId) {
    const clientmongo = await connection.getConnection();
    const room = await clientmongo
      .db("db_tic_tac_toe")
      .collection("Rooms")
      .findOne({ $or: [ { player1Id: playerId.toString() }, { player2Id: playerId.toString() } ] });

    console.log(room);
      
    return room;
}
  
async function insertRoom(room) {
    const clientmongo = await connection.getConnection();
    const { ops } = await clientmongo
    .db("db_tic_tac_toe")
    .collection("Rooms")
    .insertOne(room);
    return ops;
}
  
async function deleteRoom(roomId) {
    const clientmongo = await connection.getConnection();
    await clientmongo
    .db("db_tic_tac_toe")
    .collection("Rooms")
    .deleteOne({ id: roomId.toString() });
}

async function updateRoom(room) {
    const clientmongo = await connection.getConnection();
    const query = { id: room.id.toString() };
    const newValues = { $set: { 
                            nextToMove: room.nextToMove.toString(),
                            boardState: room.boardState
                         } };
    await clientmongo
      .db("db_tic_tac_toe")
      .collection("Rooms")
      .updateOne(query, newValues);
}

module.exports = {getRoomByPlayerId, insertRoom, deleteRoom, updateRoom}