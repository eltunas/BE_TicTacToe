let gameLogic = require("./helpers/gameLogicHelper");
let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};
//Your socket logic here
socketApi.io = io;
module.exports = socketApi;

let queue = [];
let rooms = [];

socketApi.io.on("connection", socket => {
  console.log(socket.id + " esta conectado");

  socket.on("findMatch", () => {
    findMatch(socket);
    socket.on("move", moveData => {
      let room = rooms[moveData.socketId];

      room.boardState = updateBoard(room, moveData.square);

      console.log(room.boardState);

      let matchWon = gameLogic.gameWon(room.boardState, room.nextToMove);

      room.nextToMove = room.nextToMove == "X" ? "O" : "X";

      socketApi.io.in(room.id).emit("boardUpdate", room);

      if (matchWon) {
        console.log("match ended");
        socketApi.io.in(room.id).emit("matchEnded", "");
      }
    });
  });
});

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

      let room = {
        id: socket.id + "#" + peer.id,
        boardState: ["", "", "", "", "", "", "", "", ""],
        nextToMove: "X",
        player1: peer.id,
        player2: socket.id,
      };
      // join them both
      peer.join(room.id);
      socket.join(room.id);
      // register rooms to their names
      rooms[peer.id] = room;
      rooms[socket.id] = room;
      //mandar la data de la partida
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
