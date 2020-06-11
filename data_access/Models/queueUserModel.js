class QueueUser {
    constructor(googleId, name, socket) {
        this.googleId = googleId;
        this.name = name;
        this.socket = socket;
    }
}

//method for User entity data access

module.exports = { User };