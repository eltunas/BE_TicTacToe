const gameLogic = require("./helpers/gameLogicHelper");
const socket_io = require("socket.io");
const io = socket_io();
const dataRooms = require("./data_access/rooms");
const RoomModel = require("./data_access/Models/RoomModel");

let socketApi = {};
socketApi.io = io;
module.exports = socketApi;

let queue = [];

socketApi.io.on("connection", socket => {
  socket.on("findMatch", () => {
    findMatch(socket);
    socket.on("move", data => {
      moveData(data);
    });
  });
});

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
          socketApi.io.sockets.sockets[socket_id].leave(room.id);
          socketApi.io.sockets.sockets[socket_id].removeAllListeners();
          socketApi.io.sockets.sockets[socket_id].on("findMatch", () => {
            findMatch(socket);
            socket.on("move", data => {
              moveData(data);
            });
          });
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

function findMatch(socket) {
  if (queue.length > 0) {
    console.log("match found");
    // somebody is in queue, pair them!
    let peer = queue.pop();
    if (peer.id == socket.id) {
      queue.push(peer);
    } else {
      let player1;
      let player2;

      if (Math.random > 0.5) {
        player1 = "X";
        player2 = "O";
      } else {
        player1 = "O";
        player2 = "X";
      }

      let room = new RoomModel.Room(socket.id + "#" + peer.id, peer, socket);

      dataRooms.insertRoom(room);

      // join them both
      peer.join(room.id);
      socket.join(room.id);

      peer.emit("matchFound", player1);
      socket.emit("matchFound", player2);
    }
  } else {
    // queue is empty, add our lone socket
    queue.push(socket);
  }
}

function updateBoard(room, newMove) {
  room.boardState[newMove] = room.nextToMove;
  return room.boardState;
}
