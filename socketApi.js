const gameLogic = require('./helpers/gameLogicHelper')
const socket_io = require('socket.io');
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

        socket.on("move", async moveData => {            
            let room = await dataRooms.getRoomByPlayerId(moveData.socketId);
            
            console.log(room);
            
            room.boardState = updateBoard(room, moveData.square);

            let matchWon = gameLogic.gameWon(room.boardState, room.nextToMove);

            room.nextToMove = room.nextToMove == "X" ? "O" : "X";

            await dataRooms.updateRoom(room);
            
            socketApi.io.in(room.id).emit("boardUpdate", room);
            
            if(matchWon){
                console.log("match ended");
                socketApi.io.in(room.id).emit("matchEnded", "");

                //room.player1.leave(room.id);
                //room.player2.leave(room.id);

                dataRooms.deleteRoom(room.id);
            }
        })
    });
});


function findMatch(socket){
    
    if (queue.length > 0) {
        console.log("match found")
        // somebody is in queue, pair them!
        let peer = queue.pop();
        if(peer.id == socket.id){
            queue.push(peer);
        }else{
            let player1;
            let player2;

            if(Math.random > 0.5){
                player1 = "X";
                player2 = "O";
            }else{
                player1 = "O";
                player2 = "X";
            }

            let room = new RoomModel.Room(socket.id + '#' + peer.id, peer, socket);
            
            dataRooms.insertRoom(room);

            peer.join(room.id);
            socket.join(room.id);
            
            //mandar la data de la partida
            peer.emit("matchFound", player1); 
            socket.emit("matchFound", player2);
        }
    } else {
        // queue is empty, add our lone socket
        queue.push(socket);
    }
}

function updateBoard(room, newMove){
    room.boardState[newMove] = room.nextToMove;
    return room.boardState;
}