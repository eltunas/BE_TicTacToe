class User {
    constructor(id, name, createdDate) {
        this.id = id;
        this.name = name;
        this.createdDate = createdDate;
        this.wins = 0;
        this.ties = 0;
        this.loses = 0;
    }
}

//method for User entity data access

module.exports = {User}