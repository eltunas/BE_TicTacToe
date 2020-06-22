const connection = require("./mongo_connection");

async function getRoomByPlayerId(playerId) {
  const clientmongo = await connection.getConnection();
  const room = await clientmongo
    .db(process.env.DATABASE)
    .collection("Rooms")
    .findOne({
      $or: [
        { player1Id: playerId.toString() },
        { player2Id: playerId.toString() },
      ],
    });
  return room;
}

async function insertRoom(room) {
  const clientmongo = await connection.getConnection();
  const { ops } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Rooms")
    .insertOne(room);
  return ops[0];
}

async function deleteRoom(roomId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db(process.env.DATABASE)
    .collection("Rooms")
    .deleteOne({ id: roomId.toString() });
}

async function deleteRoomsByPlayerId(playerId) {
  const clientmongo = await connection.getConnection();
  await clientmongo
    .db(process.env.DATABASE)
    .collection("Rooms")
    .deleteMany({
      $or: [
        { player1Id: playerId.toString() },
        { player2Id: playerId.toString() },
      ],
    });
}

async function updateRoom(room, { socketId, square }) {
  const clientmongo = await connection.getConnection();
  const query = { id: room.id };
  room.boardState[square] = room.nextToMove;
  const newValues = {
    $set: {
      nextToMove: room.nextToMove === "X" ? "O" : "X",
      boardState: room.boardState,
      moves: room.moves + 1,
    },
  };
  const options = { returnOriginal: false };
  const { value } = await clientmongo
    .db(process.env.DATABASE)
    .collection("Rooms")
    .findOneAndUpdate(query, newValues, options);
  return value;
}

module.exports = {
  getRoomByPlayerId,
  insertRoom,
  deleteRoom,
  updateRoom,
  deleteRoomsByPlayerId,
};
