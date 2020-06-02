let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here
socketApi.io = io;
module.exports = socketApi;

let queue = [];

socketApi.io.on("connection", socket => {
    
    socket.on("findMatch", (data) => {
        findMatch(socket);

        socket.on("play", (play) => {
            console.log(play)
            socket.emit('played', play);
        });

    })


    

});


function findMatch(socket){
    if (queue) {
        // somebody is in queue, pair them!
        let peer = queue.pop();
        let room = socket.id + '#' + peer.id;
        // join them both
        peer.join(room);
        socket.join(room);
        // register rooms to their names
        rooms[peer.id] = room;
        rooms[socket.id] = room;
        // exchange names between the two of them and start the chat
        peer.emit('chat start', {'name': names[socket.id], 'room':room});
        socket.emit('chat start', {'name': names[peer.id], 'room':room});
    } else {
        // queue is empty, add our lone socket
        queue.push(socket);
    }
}
