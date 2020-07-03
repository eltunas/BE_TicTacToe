class OnlineUser {
  constructor(googleId, name, socketId) {
    this.googleId = googleId;
    this.name = name;
  }
}

//method for User entity data access

module.exports = { OnlineUser };
