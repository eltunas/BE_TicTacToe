let gameLogic = require('./helpers/gameLogicHelper')
let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here
socketApi.io = io;
module.exports = socketApi;

let queue = [];
let rooms = [];

socketApi.io.on("connection", socket => {
    console.log(socket.id + " esta conectado")

    socket.on("findMatch", () => {
        findMatch(socket);

        socket.on("move", moveData => {
            console.log("move");
            console.log(rooms);
            console.log(moveData);
      
            let room = rooms[moveData.socketId];
            console.log(room);
            room.boardState = updateBoard(room, moveData.square);

            room.nextToMove = room.nextToMove == "X" ? "O" : "X";
            console.log(room.boardState);
            console.log(room.id);
            socketApi.io.in(room.id).emit("boardUpdate", room.boardState);
            if(gameLogic.gameWon(room.boardState, room.nextToMove)){
                console.log("game finished");
                socketApi.io.in(room.id).emit("matchEnded", "");
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
            let room = {
                id: socket.id + '#' + peer.id,
                boardState: ["", "", "","", "", "","", "", ""],
                nextToMove: "X",
            }
            // join them both
            peer.join(room.id);
            socket.join(room.id);
            // register rooms to their names
            rooms[peer.id] = room;
            rooms[socket.id] = room;
            // exchange names between the two of them and start the chat
            console.log("matcheando")
            peer.emit("matchFound");
            socket.emit("matchFound");
        }
    } else {
        console.log("busco partida " + socket.id);
        
        // queue is empty, add our lone socket
        queue.push(socket);

    }
}

function updateBoard(room, newMove){
    room.boardState[newMove] = room.nextToMove;
    return room.boardState;
}