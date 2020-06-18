const gameLogic = require("./helpers/gameLogicHelper");
const socket_io = require("socket.io");
const io = socket_io();
const dataRooms = require("./data_access/rooms");
const RoomModel = require("./data_access/Models/RoomModel");
const dataQueue = require("./data_access/queueUsers");

let socketApi = {};
socketApi.io = io;
module.exports = socketApi;

let queue = [];

socketApi.io.on("connection", socket => {
  socket.on("findMatch", (userInfo) => subscribeToGame(socket, userInfo));
});

const subscribeToGame = async (socket, userInfo) => {
  await findMatch(socket, userInfo);
  socket.on("move", data => {
    moveData(data);
  });
};

const moveData = async moveData => {
  console.log("moveData: ", moveData);
  let room = await dataRooms.getRoomByPlayerId(moveData.socketId);
  room = await dataRooms.updateRoomWithSteroids(room, moveData);
  console.log("updatedRoom: ", room);
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

async function findMatch(socket, userInfo) {
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
      let room = new RoomModel.Room(socket.id + "#" + peer.socketId, peerSocket, socket);

      dataRooms.insertRoom(room);

      peerSocket.join(room.id);
      socket.join(room.id);

      peerSocket.emit("matchFound", player1);
      socket.emit("matchFound", player2);

      await dataQueue.deleteQueueUser(peer.googleId);
    }
  } else {
    dataQueue.insertQueueUser({
      googleId: userInfo.googleId,
      name: userInfo.name,
      socketId: socket.id
    });
  }
}
