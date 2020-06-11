class QueueUser {
  constructor(googleId, name, socketId) {
    this.googleId = googleId;
    this.name = name;
    this.socketId = socketId;
  }
}

//method for User entity data access

module.exports = { QueueUser };
