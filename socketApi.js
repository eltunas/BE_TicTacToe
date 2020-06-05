let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here
socketApi.io = io;
module.exports = socketApi;

let queue = [];
let rooms = [];

socketApi.io.on("connection", socket => {
    socket.on("findMatch", () => {
        findMatch(socket);
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
            let room = socket.id + '#' + peer.id;
            // join them both
            peer.join(room);
            socket.join(room);
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
