let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here
socketApi.io = io;
module.exports = socketApi;

socketApi.io.on('connection', (socket) => {
    console.log('a user connected');
});
