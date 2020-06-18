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
  socket.on("findMatch", () => subscribeToGame(socket));
});

const subscribeToGame = socket => {
  findMatch(socket);
  socket.on("move", data => {
    moveData(data);
  });
};

const moveData = async moveData => {
  let room = await dataRooms.updateRoomWithSteroids(room, moveData);
  console.log(room);
  let winner = room.moves > 4 ? gameLogic.gameWon(room.boardState) : null;
  socketApi.io.in(room.id).emit("boardUpdate", room);

  if (winner || room.moves === 9) {
    socketApi.io.in(room.id).emit("matchEnded", winner);
    socketApi.io.in(room.id).clients((error, clients) => {
      clients.forEach(socket_id => {
        const player = socketApi.io.sockets.sockets[socket_id];
        player.leave(room.id);
        player.removeAllListeners();
        player.on("findMatch", () => subscribeToGame(player));
      });
    });
    await dataRooms.deleteRoom(room.id);
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

      let random = Math.random();
      if (random > 0.5) {
        player1 = "X";
        player2 = "O";
      } else {
        player1 = "O";
        player2 = "X";
      }

      console.log(random);
      console.log("player 1: ", player1);
      console.log("player 2: ", player2);
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
