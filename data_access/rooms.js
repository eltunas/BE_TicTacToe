const connection = require("./mongo_connection");

async function getRoomByPlayerId(playerId) {
  const clientmongo = await connection.getConnection();
  const room = await clientmongo
    .db("db_tic_tac_toe")
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
    .db("db_tic_tac_toe")
    .collection("Rooms")
    .insertOne(room);
  return ops[0];
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
  const newValues = {
    $set: {
      nextToMove: room.nextToMove.toString(),
      boardState: room.boardState,
      moves: room.moves + 1,
    },
  };
  await clientmongo
    .db("db_tic_tac_toe")
    .collection("Rooms")
    .updateOne(query, newValues);
}

async function updateRoomWithSteroids(room, { socketId, square }) {
  const clientmongo = await connection.getConnection();
  const query = {
    $or: [
      { player1Id: socketId.toString() },
      { player2Id: socketId.toString() },
    ],
  };
  room.boardState[square] = room.nextToMove;
  const newValues = {
    $set: {
      nextToMove: room.nextToMove === "X" ? "O" : "X",
      boardState: room.boardState,
      moves: room.moves + 1,
    },
  };
  const options = { returnOriginal: false };
  const updatedRoom = await clientmongo.findOneAndUpdate(
    query,
    newValues,
    options
  );
  return updatedRoom;
}

module.exports = {
  getRoomByPlayerId,
  insertRoom,
  deleteRoom,
  updateRoom,
  updateRoomWithSteroids,
};
