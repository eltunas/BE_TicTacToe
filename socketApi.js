const gameLogic = require("./helpers/gameLogicHelper");
const socket_io = require("socket.io");
const io = socket_io();
const dataRooms = require("./data_access/rooms");
const RoomModel = require("./data_access/Models/RoomModel");
const dataOnline = require("./data_access/onlineUsers");
const dataQueue = require("./data_access/queueUsers");

let socketApi = {};
socketApi.io = io;
module.exports = socketApi;

let queue = [];

socketApi.io.on("connection", socket => {
  socket.on("findMatch", (gameInfo) => subscribeToGame(socket, gameInfo));
});

const subscribeToGame = async (socket, gameInfo) => {
  console.log(gameInfo);
  await findMatch(socket, gameInfo);
  socket.on("move", data => {
    moveData(data);
  });
};

const moveData = async moveData => {
  let room = await dataRooms.getRoomByPlayerId(moveData.socketId);

  room.boardState = updateBoard(room, moveData.square);

  let moves = room.boardState.filter(square => square != null).length;

  let winner = moves > 4 ? gameLogic.gameWon(room.boardState) : null;

  room.nextToMove = room.nextToMove == "X" ? "O" : "X";

  await dataRooms.updateRoom(room);

  socketApi.io.in(room.id).emit("boardUpdate", room);

  if (winner || moves === 9) {
    console.log("match ended");

    socketApi.io.in(room.id).emit("matchEnded", winner ? winner : null);
    console.log(
      "Before removing sockets from room: ",
      io.sockets.adapter.rooms
    );

    socketApi.io.in(room.id).clients((error, clients) => {
      if (clients.length > 0) {
        console.log("clients in the room: \n");
        console.log(clients);
        clients.forEach(socket_id => {
          const player = socketApi.io.sockets.sockets[socket_id];
          player.leave(room.id);
          player.removeAllListeners();
          player.on("findMatch", (gameInfo) => subscribeToGame(player, gameInfo));
          console.log(
            "events: ",
            socketApi.io.sockets.sockets[socket_id].eventNames()
          );
        });
      }
    });

    await dataRooms.deleteRoom(room.id);
    console.log("After removing sockets from room: ", io.sockets.adapter.rooms);
  }
};

async function findMatch(socket, gameInfo) {
  let peer = await dataQueue.getSingleQueueUser();
  console.log(peer);
  if (peer!=null) {    
    if (peer.socketId != socket.id){
      let player1;
      let player2;

      let random = Math.random();
      if (random > 0.5) {
        player1 = "X";
        player2 = "O";
      } else {
        player1 = "O";
        player2 = "X";
      }
      peerSocket = socketApi.io.sockets.sockets[peer.socketId];
      console.log(random);
      console.log("player 1: ", player1);
      console.log("player 2: ", player2);
      let room = new RoomModel.Room(socket.id + "#" + peer.socketId, peer, socket);

      dataRooms.insertRoom(room);

      peerSocket.join(room.id);
      socket.join(room.id);

      peerSocket.emit("matchFound", player1);
      socket.emit("matchFound", player2);

      await dataQueue.deleteQueueUser(peer.googleId);
    }
  } else {
    console.log(gameInfo.gameInfo);
    dataQueue.insertQueueUser({
      googleId: gameInfo.gameInfo.googleId,
      name: gameInfo.gameInfo.name,
      socketId: socket.id
    });
  }
}

function updateBoard(room, newMove) {
  room.boardState[newMove] = room.nextToMove;
  return room.boardState;
}
